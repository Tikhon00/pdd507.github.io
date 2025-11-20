// src/lib/ai.ts

export type AiAnswer = {
	/** Текст варианта ответа */
	t: string
	/** 1 — правильный, 0 — неправильный */
	c: 0 | 1
}

export type AiQuestion = {
	/** Текст вопроса */
	q: string
	/** Варианты ответов */
	a: AiAnswer[]
	/** Пояснение к правильному ответу */
	e: string
	/** Тема (опционально) */
	topic?: string
	/** Сложность (easy|med|hard...) */
	diff?: string
}

type Difficulty = 'easy' | 'med' | 'hard'

const NEURO_API_BASE =
	import.meta.env.VITE_NEURO_API_BASE ?? 'https://neuroapi.host/v1'

const NEURO_API_KEY = import.meta.env.VITE_NEURO_API_KEY ?? ''

const SYSTEM_PROMPT =
	'Ты генератор коротких задач по ПДД РФ для аудитории 15–23 лет. ' +
	'Дай одну ситуацию и один вопрос по реальным ПДД, три варианта ответа, ' +
	'ровно один правильный. ' +
	'Отвечай ТОЛЬКО валидным JSON без пояснений и без Markdown. ' +
	'Структура: {"q":"...","a":[{"t":"...", "c":0}, {"t":"...", "c":1}, {"t":"...", "c":0}], "e":"...", "topic":"...", "diff":"med"}. ' +
	'Поле "c" = 1 только у одного варианта, у остальных 0.'

export async function generateAiPddQuestion(
	diff: Difficulty = 'med'
): Promise<AiQuestion> {
	if (!NEURO_API_KEY) {
		console.warn(
			'[AI] VITE_NEURO_API_KEY не задан. Вопросы по ПДД от нейросети работать не будут.'
		)
		throw new Error('API-ключ NeuroAPI не задан')
	}

	const userPrompt =
		'Сгенерируй одну задачу по ПДД РФ. Формат: короткое описание ситуации + вопрос и три варианта ответа. ' +
		'Темы: дорожные знаки, приоритет, пешеходы, разметка, техническое состояние ТС, опасные условия (ночь, дождь, снег, плохая видимость). ' +
		'Аудитория: 15–23 года. ' +
		'Сложность: ' +
		diff +
		'. ' +
		'Верни ТОЛЬКО JSON по указанной структуре, без комментариев и без ```.'

	const body = {
		model: 'gemini-2.0-flash',
		temperature: 0.7,
		max_tokens: 380,
		messages: [
			{ role: 'system', content: SYSTEM_PROMPT },
			{ role: 'user', content: userPrompt },
		],
	}

	const res = await fetch(`${NEURO_API_BASE}/chat/completions`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${NEURO_API_KEY}`,
		},
		body: JSON.stringify(body),
	})

	if (!res.ok) {
		const text = await res.text().catch(() => '')
		console.error('[AI] HTTP error', res.status, text)
		throw new Error('Ошибка HTTP при обращении к NeuroAPI')
	}

	const data: any = await res.json()

	const raw = data?.choices?.[0]?.message?.content ?? ''
	let text: string = String(raw).trim()

	// Срезаем ```json ... ```
	if (text.startsWith('```')) {
		const firstNewline = text.indexOf('\n')
		if (firstNewline !== -1) {
			text = text.slice(firstNewline + 1)
		}
		const lastFence = text.lastIndexOf('```')
		if (lastFence !== -1) {
			text = text.slice(0, lastFence)
		}
		text = text.trim()
	}

	try {
		const parsed: any = JSON.parse(text)

		const answersSource: any[] = Array.isArray(parsed.a) ? parsed.a : []

		const answers: AiAnswer[] = answersSource.map(item => ({
			t: String(item?.t ?? item?.text ?? ''),
			c: item?.c === 1 ? 1 : 0,
		}))

		const question: AiQuestion = {
			q: String(parsed.q ?? parsed.question ?? ''),
			a: answers,
			e: String(parsed.e ?? parsed.explanation ?? ''),
			topic: parsed.topic ? String(parsed.topic) : undefined,
			diff: parsed.diff ? String(parsed.diff) : diff,
		}

		if (!question.q || !question.a.length) {
			throw new Error('Invalid question shape')
		}

		// Если модель не пометила ни один вариант как правильный — помечаем первый
		if (!question.a.some(ans => ans.c === 1)) {
			question.a[0].c = 1
		}

		return question
	} catch (err) {
		console.error('[AI] JSON parse error. Raw:', text)
		throw new Error('Не удалось разобрать JSON от модели')
	}
}
