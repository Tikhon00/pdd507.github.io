// src/pages/AiQuiz.tsx
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import GlassCard from '@/components/GlassCard'
import { Badge } from '@/components/ui/badge'
import AnimatedBackground from '@/components/AnimatedBackground'
import { Brain, Sparkles, CheckCircle2, XCircle, RefreshCw } from 'lucide-react'
import { generateAiPddQuestion } from '@/lib/ai'
import type { AiQuestion } from '@/lib/ai'

const AiQuiz = () => {
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [question, setQuestion] = useState<AiQuestion | null>(null)
	const [selected, setSelected] = useState<number | null>(null)
	const [showExplanation, setShowExplanation] = useState(false)

	const handleVibrate = () => {
		if ('vibrate' in navigator) {
			navigator.vibrate(20)
		}
	}

	const handleGenerate = async () => {
		if (loading) return
		handleVibrate()
		setLoading(true)
		setError(null)
		setSelected(null)
		setShowExplanation(false)

		try {
			const q = await generateAiPddQuestion('med')
			setQuestion(q)
		} catch (err) {
			console.error(err)
			setError('Не удалось сгенерировать вопрос. Попробуй ещё раз.')
		} finally {
			setLoading(false)
		}
	}

	const handleAnswer = (index: number) => {
		if (!question || selected !== null) return
		handleVibrate()
		setSelected(index)
		setShowExplanation(true)
	}

	const answers = question && Array.isArray(question.a) ? question.a : []

	const isCorrect = (idx: number) => {
		if (!answers.length) return false
		return answers[idx]?.c === 1
	}

	return (
		<div className='relative min-h-screen'>
			<AnimatedBackground />

			<div className='relative z-10 space-y-6 animate-fade-in'>
				{/* Заголовок */}
				<GlassCard className='flex items-center gap-4'>
					<div className='w-12 h-12 rounded-xl glass-strong flex items-center justify-center'>
						<Brain className='text-primary' size={24} />
					</div>
					<div className='space-y-1'>
						<h1 className='text-xl font-semibold text-foreground'>
							Вопросы по ПДД от нейросети
						</h1>
						<p className='text-xs text-muted-foreground'>
							Модель генерирует новые задачи по реальным ПДД для возраста 15–23
							лет. Каждый раз — новый вопрос.
						</p>
					</div>
				</GlassCard>

				{/* Кнопка генерации */}
				<Button
					onClick={handleGenerate}
					size='lg'
					className='w-full gradient-button gap-2'
					disabled={loading}
				>
					{loading ? (
						<>
							<RefreshCw className='animate-spin' size={18} />
							Генерируем вопрос...
						</>
					) : question ? (
						<>
							<RefreshCw size={18} />
							Сгенерировать новый вопрос
						</>
					) : (
						<>
							<Sparkles size={18} />
							Сгенерировать вопрос
						</>
					)}
				</Button>

				{/* Ошибка */}
				{error && (
					<GlassCard className='border border-red-200 bg-red-50/60 text-sm text-red-700'>
						{error}
					</GlassCard>
				)}

				{/* Анимация во время загрузки */}
				{loading && (
					<GlassCard className='space-y-4'>
						<div className='h-5 w-24 rounded-full bg-muted animate-pulse' />
						<div className='h-16 rounded-xl bg-muted animate-pulse' />
						<div className='space-y-2'>
							<div className='h-10 rounded-xl bg-muted animate-pulse' />
							<div className='h-10 rounded-xl bg-muted animate-pulse' />
							<div className='h-10 rounded-xl bg-muted animate-pulse' />
						</div>
						<div className='flex items-center justify-center gap-2 text-xs text-muted-foreground'>
							<span>Нейросеть придумывает задачу</span>
							<span className='flex gap-1'>
								<span className='w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:0ms]' />
								<span className='w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:150ms]' />
								<span className='w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:300ms]' />
							</span>
						</div>
					</GlassCard>
				)}

				{/* Содержимое вопроса */}
				{question && !loading && (
					<GlassCard className='space-y-4'>
						<div className='flex items-center justify-between'>
							<Badge variant='outline' className='glass'>
								Вопрос от нейросети
							</Badge>
							<div className='flex items-center gap-2 text-xs text-muted-foreground'>
								{question.topic && (
									<span className='px-2 py-0.5 rounded-full bg-muted'>
										{question.topic}
									</span>
								)}
								{question.diff && (
									<span className='px-2 py-0.5 rounded-full bg-muted'>
										Сложность: {question.diff}
									</span>
								)}
							</div>
						</div>

						<p className='text-foreground text-base leading-relaxed'>
							{question.q}
						</p>

						<div className='space-y-2'>
							{answers.map((ans, idx) => {
								const isSelected = selected === idx
								const correct = isCorrect(idx)
								const showCorrect = showExplanation && correct
								const showWrong = showExplanation && isSelected && !correct

								return (
									<button
										key={idx}
										onClick={() => handleAnswer(idx)}
										disabled={selected !== null}
										className={`w-full text-left p-3 rounded-xl glass transition-all active:scale-95 text-sm ${
											showCorrect
												? 'neon-glow-green border-neon-green/50'
												: showWrong
												? 'neon-glow-red border-neon-red/50'
												: 'hover:glass-strong'
										} ${
											selected !== null ? 'cursor-default' : 'cursor-pointer'
										}`}
									>
										<div className='flex items-center justify-between gap-3'>
											<span className='text-foreground flex-1'>{ans.t}</span>
											{showCorrect && (
												<CheckCircle2
													className='text-neon-green flex-shrink-0'
													size={18}
												/>
											)}
											{showWrong && (
												<XCircle
													className='text-neon-red flex-shrink-0'
													size={18}
												/>
											)}
										</div>
									</button>
								)
							})}
						</div>

						{showExplanation && (
							<div className='p-3 rounded-xl bg-muted/60 text-xs leading-relaxed'>
								<span className='font-semibold text-foreground'>
									Пояснение:{' '}
								</span>
								<span className='text-muted-foreground'>{question.e}</span>
							</div>
						)}
					</GlassCard>
				)}

				{!question && !loading && !error && (
					<p className='text-xs text-muted-foreground text-center'>
						Нажми «Сгенерировать вопрос», чтобы получить задачу по ПДД от
						нейросети.
					</p>
				)}
			</div>
		</div>
	)
}

export default AiQuiz
