// src/components/missions/CodexQuizMission.tsx
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import GlassCard from '@/components/GlassCard'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, XCircle, ChevronRight, Layers } from 'lucide-react'

type BaseQuestion = {
	id: string
	text: string
	options: string[]
	correctIndex: number
	explanation: string
	image?: string
}

type DriverTopic = {
	id: string
	title: string
	description: string
	questions: BaseQuestion[]
}

// === ВОПРОСЫ ДЛЯ "НЕ СДАВАЛ НА ВУ" (10 историй) ===
// image пути — ПРЕДПОЛОЖЕНИЕ: /images/novice/1qs.png ... 10qs.png

const NOVICE_QUESTIONS: BaseQuestion[] = [
	{
		id: 'novice_01_blind_driveway',
		text: 'Вечер, вы идёте по двору. Справа плотно припаркованы машины, из-за них не видно выезда. Как безопаснее всего пройти мимо выезда?',
		options: [
			'Быстро проскочить между машинами, пока никто не едет',
			'Остановиться, осторожно выглянуть и только потом переходить',
			'Пройти дальше по проезжей части, вдоль машин',
		],
		correctIndex: 1,
		explanation:
			'При перекрытом обзоре нужно сначала оценить обстановку, а потом переходить. Иначе легко выйти прямо под машину.',
		image: '/images/novice/1qs.png',
	},
	{
		id: 'novice_02_dark_wet',
		text: 'Ночь, мокрая дорога. Вы стоите у края тротуара, вдали едет машина, но из-за бликов непонятно, быстро она или нет. Что сделать?',
		options: [
			'Перейти дорогу бегом — кажется, что машина далеко',
			'Подождать пару секунд и оценить, как меняется расстояние до машины',
			'Перейти пешком не спеша',
		],
		correctIndex: 1,
		explanation:
			'Когда скорость и расстояние оценить сложно, нужно взять паузу и посмотреть, как меняется положение машины.',
		image: '/images/novice/2qs.png',
	},
	{
		id: 'novice_03_two_stage_crossing',
		text: 'Широкая дорога: 4 полосы и островок безопасности посередине. На первой половине машин нет, на второй — едут. Как переходить?',
		options: [
			'Перейти всю дорогу сразу, пока первая часть свободна',
			'Сначала перейти до островка, там остановиться и оценить вторую половину',
			'Ждать, пока обе половины дороги будут полностью пустые',
		],
		correctIndex: 1,
		explanation:
			'Островок безопасности позволяет делить переход на два этапа. Так проще контролировать каждую половину дороги.',
		image: '/images/novice/3qs.png',
	},
	{
		id: 'novice_04_scooter_car',
		text: 'Вы едете на самокате по тротуару. Впереди припаркован большой автомобиль, за которым находится выезд со двора. Как действовать?',
		options: [
			'Объехать машину по тротуару на той же скорости',
			'Сильно снизить скорость и быть готовым остановиться, пока не увидите выезд',
			'Съехать на проезжую часть и объехать по дороге',
		],
		correctIndex: 1,
		explanation:
			'Выезд за глухой машиной — слепая зона. Нужно минимизировать скорость и быть готовым к резкой остановке.',
		image: '/images/novice/4qs.png',
	},
	{
		id: 'novice_05_driver_phone',
		text: 'Вы сидите рядом с водителем. Он ведёт машину и периодически смотрит в телефон, читая сообщения. Что правильнее сделать?',
		options: [
			'Ничего не говорить — водитель опытный и сам всё знает',
			'Спокойно предложить остановиться и ответить на сообщение',
			'Резко закричать и вырвать телефон из рук',
		],
		correctIndex: 1,
		explanation:
			'Самый безопасный вариант — мягко предложить остановиться. Это снижает риск ДТП и не провоцирует конфликт.',
		image: '/images/novice/5qs.png',
	},
	{
		id: 'novice_06_school_bus',
		text: 'Школьный автобус остановился, вы выходите. Автобус закрывает обзор, по соседней полосе едут машины. Что сделать?',
		options: [
			'Перейти сразу перед автобусом, пока ближняя полоса свободна',
			'Обойти автобус и перейти, если машин не видно',
			'Подождать, пока автобус отъедет, и перейти по переходу',
		],
		correctIndex: 2,
		explanation:
			'Выход из-за автобуса очень опасен: другие водители могут вас не увидеть. Безопаснее дождаться, когда обзор откроется.',
		image: '/images/novice/6qs.png',
	},
	{
		id: 'novice_07_turning_car',
		text: 'Вы переходите дорогу на зелёный. Справа машина поворачивает направо на свой зелёный и должна вас пропустить. Как вам идти?',
		options: [
			'Быстро перебежать, пока машина не начала поворот',
			'Идти ровно, не меняя скорости, убедившись, что водитель вас видит',
			'Остановиться на середине перехода и ждать машину',
		],
		correctIndex: 1,
		explanation:
			'Пешеход должен двигаться предсказуемо, ровным шагом. Так водителю легче рассчитать манёвр.',
		image: '/images/novice/7qs.png',
	},
	{
		id: 'novice_08_no_sidewalk',
		text: 'Загородная дорога без тротуара. Вы идёте навстречу транспорту по обочине. В этот момент сзади и навстречу одновременно едут две машины. Что лучше сделать?',
		options: [
			'Остаться на краю дороги — водители объедут',
			'Перейти на другую сторону дороги',
			'Сойти как можно дальше с проезжей части и переждать, пока машины проедут',
		],
		correctIndex: 2,
		explanation:
			'Когда транспорт идёт с двух сторон, безопаснее полностью выйти с проезжей части, а не надеяться, что все успеют увернуться.',
		image: '/images/novice/8qs.png',
	},
	{
		id: 'novice_09_reverse_car',
		text: 'Во дворе машина сдаёт назад из парковочного места. Вы идёте прямо за ней. Как безопаснее поступить?',
		options: [
			'Быстро пройти за машиной, пока она ещё далеко',
			'Отойти в сторону так, чтобы водитель вас видел, и подождать',
			'Идти как шли — водитель обязан смотреть в зеркала',
		],
		correctIndex: 1,
		explanation:
			'При движении задним ходом у машины большая слепая зона. Лучше выйти из неё и дать водителю закончить манёвр.',
		image: '/images/novice/9qs.png',
	},
	{
		id: 'novice_10_icy_road',
		text: 'Зимой вы стоите у пешеходного перехода. Дорога скользкая, к переходу подъезжает машина. У вас зелёный. Как безопаснее?',
		options: [
			'Сразу идти — водитель обязан остановиться',
			'Подождать и убедиться, что машина действительно успевает затормозить',
			'Перебежать как можно быстрее',
		],
		correctIndex: 1,
		explanation:
			'На льду тормозной путь сильно увеличивается. Нельзя полагаться только на сигнал светофора — важно оценивать возможность остановки машины.',
		image: '/images/novice/10qs.png',
	},
]

// === ВОПРОСЫ ДЛЯ "СДАЛ НА ВУ" (15 ПДД, РАЗБИТЫ НА 3 ТЕМЫ ПО 5) ===
// image пути — ПРЕДПОЛОЖЕНИЕ: /images/pro/1.png ... /images/pro/15.png

const DRIVER_TOPICS: DriverTopic[] = [
	{
		id: 'priority',
		title: 'Перекрёстки и приоритет',
		description: 'Сложные ситуации на перекрёстках и с трамваем',
		questions: [
			{
				id: 'q2_trajectories',
				text: 'По какой траектории водитель имеет право выполнить разворот на перекрёстке (по рисунку)?',
				options: [
					'По траектории А — ближайшей дугой',
					'По траектории Б — с выходом на дальние полосы',
					'По любой, если нет помех',
				],
				correctIndex: 0,
				explanation:
					'Разворот выполняется по кратчайшей траектории из своей полосы. Выход на дальние полосы — лишний манёвр и нарушение разметки.',
				image: '/images/pro/2.png',
			},
			{
				id: 'q3_turn_left',
				text: 'При повороте налево по главной дороге вы видите встречный автомобиль и спецтехнику на второстепенной. Кому вы обязаны уступить?',
				options: [
					'Только встречному автомобилю',
					'Только спецтехнике на второстепенной',
					'Всем транспортным средствам',
				],
				correctIndex: 0,
				explanation:
					'Вы на главной. Спецтехника на второстепенной уступает вам. При левом повороте вы обязаны уступить только встречному, движущемуся по главной.',
				image: '/images/pro/3.png',
			},
			{
				id: 'q4_straight_main',
				text: 'Вы намерены проехать перекрёсток прямо. Грузовик справа тоже на главной дороге и поворачивает налево. Ваши действия?',
				options: [
					'Проехать первым — вы движетесь прямо',
					'Уступить грузовику, так как он справа на пересечении траекторий',
					'Договориться жестами, кто поедет первым',
				],
				correctIndex: 1,
				explanation:
					'При движении по главной приоритет имеет транспорт справа, если траектории пересекаются. Здесь грузовик расположен справа относительно вас.',
				image: '/images/pro/4.png',
			},
			{
				id: 'q10_tram_cross',
				text: 'На перекрёстке трамвай поворачивает налево, вам нужно прямо. Вы не мешаете его траектории, но горит красный сигнал. Можно ли ехать вместе с трамваем?',
				options: [
					'Да, если трамвай уже начал движение',
					'Нет, на красный выезжать нельзя вне зависимости от действий трамвая',
					'Можно, если вы убедились в безопасности',
				],
				correctIndex: 1,
				explanation:
					'Запрещающий сигнал светофора обязателен для всех участников. Движение трамвая не даёт права игнорировать красный.',
				image: '/images/pro/10.png',
			},
			{
				id: 'q14_main_cross',
				text: 'Вы выезжаете со второстепенной дороги под знак «Уступите дорогу», автобус и легковой автомобиль движутся по главной. Вам нужно прямо. Как поступить?',
				options: [
					'Проехать первым — вам не нужно поворачивать',
					'Уступить обоим транспортным средствам на главной дороге',
					'Уступить только автобусу',
				],
				correctIndex: 1,
				explanation:
					'Со второстепенной дороги необходимо уступить всем, кто движется по главной, независимо от направления их движения.',
				image: '/images/pro/14.png',
			},
		],
	},
	{
		id: 'signs_and_special',
		title: 'Знаки и особые случаи',
		description: 'STOP, въезд запрещён, трамвайные пути и спецтранспорт',
		questions: [
			{
				id: 'q1_police_follow',
				text: 'На перекрёстке стоит знак «Уступи дорогу» с табличкой движения только направо. Полицейский автомобиль с маячками едет прямо. Можно ли следовать за ним прямо?',
				options: [
					'Да, можно ехать вслед за полицейской машиной',
					'Нет, вы обязаны выполнить требования знака и повернуть направо',
					'Можно, если перекрёсток пуст',
				],
				correctIndex: 1,
				explanation:
					'Спецтранспорт с маячками может отступать от требований знаков, но остальные водители обязаны выполнять указания знаков и разметки.',
				image: '/images/pro/1.png',
			},
			{
				id: 'q5_stop_sign',
				text: 'Перед пересечением установлен знак STOP. Других машин не видно. Обязаны ли вы останавливаться?',
				options: [
					'Да, нужно выполнить полную остановку перед стоп-линией или краем проезжей части',
					'Нет, можно проехать медленно, если перекрёсток пуст',
					'Остановка нужна только при наличии помех',
				],
				correctIndex: 0,
				explanation:
					'Знак STOP всегда требует полной остановки независимо от наличия других транспортных средств.',
				image: '/images/pro/5.png',
			},
			{
				id: 'q7_no_entry_resident',
				text: 'У двора установлен знак «Въезд запрещён». Иной подъезд к дому отсутствует, а вы живёте в этом доме. Можно ли проехать под знак?',
				options: [
					'Нет, знак запрещает въезд всем без исключения',
					'Да, жильцам и обслуживающему транспорту въезд допускается',
					'Можно только ночью',
				],
				correctIndex: 1,
				explanation:
					'Для жителей и обслуживающего транспорта допускается въезд к объекту в зоне действия знака, если иначе подъехать нельзя.',
				image: '/images/pro/7.png',
			},
			{
				id: 'q13_tram_tracks',
				text: 'Вы выехали на трамвайные пути встречного направления, чтобы повернуть налево, но передумали и хотите ехать прямо до следующего перекрёстка. Законно ли продолжить движение по путям?',
				options: [
					'Да, если не мешаете трамваю',
					'Нет, движение по путям встречного направления допустимо только для поворота или разворота',
					'Можно, если скорость небольшая',
				],
				correctIndex: 1,
				explanation:
					'Трамвайные пути встречного направления используются только для завершения манёвра (левый поворот, разворот), а не для движения прямо.',
				image: '/images/pro/13.png',
			},
			{
				id: 'q15_tram_stop',
				text: 'На перекрёстке неработающий светофор, стоит знак STOP и «Уступи дорогу». Рядом с вами трамвай, движущийся по пересекающейся дороге. Ваши действия?',
				options: [
					'Проехать первым — вы уже стоите ближе к перекрёстку',
					'Остановиться перед стоп-линией и уступить дорогу трамваю',
					'Ехать одновременно с трамваем',
				],
				correctIndex: 1,
				explanation:
					'При неработающем светофоре действуют знаки приоритета, а трамвай имеет преимущество перед автомобилями. Знак STOP дополнительно требует полной остановки.',
				image: '/images/pro/15.png',
			},
		],
	},
	{
		id: 'maneuvers',
		title: 'Манёвры, обгон и остановка',
		description: 'Сломанное ТС, остановка, обгон, условия дороги',
		questions: [
			{
				id: 'q6_broken_car',
				text: 'Перед вами в правой полосе стоит сломанное транспортное средство с знаком аварийной остановки. Слева — двойная сплошная, справа ряд занят. Ваши действия?',
				options: [
					'Объехать через встречную полосу, аккуратно пересекая сплошную',
					'Остановиться за сломанным автомобилем и ждать возможности для законного продолжения движения',
					'Объехать по обочине',
				],
				correctIndex: 1,
				explanation:
					'Пересекать двойную сплошную и двигаться по обочине запрещено. В такой ситуации остаётся только остановиться и ждать.',
				image: '/images/pro/6.png',
			},
			{
				id: 'q8_stop_width',
				text: 'Ширина полосы движения — 3 метра, справа идёт тротуар без обочины. Можно ли остановиться на проезжей части?',
				options: [
					'Да, если включить аварийную сигнализацию',
					'Нет, после остановки для других ТС останется менее 3 м ширины',
					'Можно, если ненадолго',
				],
				correctIndex: 1,
				explanation:
					'Остановка запрещена, если оставшаяся ширина для движения менее 3 метров. Здесь это условие явно нарушается.',
				image: '/images/pro/8.png',
			},
			{
				id: 'q9_winter_conditions',
				text: 'Зимняя дорога, укатанный снег и лёд, подъём. В каких условиях находится водитель?',
				options: [
					'Только в условиях ограниченной видимости',
					'Только в условиях плохой освещённости',
					'В условиях скользкой дороги и частично ограниченной видимости из-за подъёма',
				],
				correctIndex: 2,
				explanation:
					'Зимой при льду и подъёме ухудшается сцепление и обзор. Это требует увеличения дистанции и снижения скорости.',
				image: '/images/pro/9.png',
			},
			{
				id: 'q11_bus_green_arrow',
				text: 'Красный автомобиль поворачивает направо на дополнительную зелёную стрелку при основном красном сигнале. По пересекаемой дороге прямо едет автобус на свой зелёный. Нужно ли уступить автобусу?',
				options: [
					'Нет, стрелка даёт полный приоритет',
					'Да, при движении по доп. секции нужно уступить всем, кто едет на основной зелёный',
					'Только если автобус поворачивает',
				],
				correctIndex: 1,
				explanation:
					'Зелёная стрелка в дополнительной секции разрешает движение, но без преимущества. Нужно уступить тем, кто едет на основной зелёный.',
				image: '/images/pro/11.png',
			},
			{
				id: 'q12_overtake_truck',
				text: 'Легковой автомобиль обгоняет грузовик по соседней полосе. Какие действия водителя обгоняемого грузовика будут нарушением ПДД?',
				options: [
					'Сохранить скорость и двигаться прямо',
					'Слегка снизить скорость для облегчения обгона',
					'Увеличить скорость или иным образом мешать обгону',
				],
				correctIndex: 2,
				explanation:
					'Обгоняемый водитель не имеет права увеличивать скорость и создавать препятствия транспортному средству, выполняющему обгон.',
				image: '/images/pro/12.png',
			},
		],
	},
]

// === Универсальный компонент викторины для одного набора вопросов ===

interface QuizViewProps {
	modeTitle: string
	topicTitle?: string
	questions: BaseQuestion[]
	onFinish: (score: number) => void
}

const QuizView = ({
	modeTitle,
	topicTitle,
	questions,
	onFinish,
}: QuizViewProps) => {
	const [current, setCurrent] = useState(0)
	const [selected, setSelected] = useState<number | null>(null)
	const [showExplanation, setShowExplanation] = useState(false)
	const [score, setScore] = useState(0)

	const question = questions[current]
	const isCorrect = selected !== null && selected === question.correctIndex

	const handleVibrate = () => {
		if ('vibrate' in navigator) {
			navigator.vibrate(20)
		}
	}

	const handleAnswer = (index: number) => {
		if (selected !== null) return
		handleVibrate()
		setSelected(index)
		setShowExplanation(true)
		if (index === question.correctIndex) {
			setScore(prev => prev + 1)
		}
	}

	const handleNext = () => {
		handleVibrate()
		if (current < questions.length - 1) {
			setCurrent(prev => prev + 1)
			setSelected(null)
			setShowExplanation(false)
		} else {
			const percent = Math.round((score / questions.length) * 100)
			onFinish(percent)
		}
	}

	return (
		<div className='space-y-6 animate-fade-in'>
			<div className='flex items-center justify-between'>
				<Badge variant='outline' className='glass'>
					{current + 1} / {questions.length}
				</Badge>
				<span className='text-xs text-muted-foreground'>
					{modeTitle}
					{topicTitle ? ` • ${topicTitle}` : ''}
				</span>
			</div>

			<GlassCard className='space-y-4'>
				{question.image && (
					<div className='aspect-video bg-muted rounded-xl overflow-hidden'>
						<img
							src={question.image}
							alt='Иллюстрация к вопросу'
							className='w-full h-full object-cover'
						/>
					</div>
				)}

				<p className='text-base font-semibold text-foreground leading-relaxed'>
					{question.text}
				</p>

				<div className='space-y-2'>
					{question.options.map((option, index) => {
						const isSelected = selected === index
						const isCorrectAns = index === question.correctIndex
						const showCorrect = showExplanation && isCorrectAns
						const showWrong = showExplanation && isSelected && !isCorrectAns

						return (
							<button
								key={index}
								onClick={() => handleAnswer(index)}
								disabled={selected !== null}
								className={`w-full text-left p-3 rounded-xl glass transition-all active:scale-95 ${
									showCorrect
										? 'neon-glow-green border-neon-green/50'
										: showWrong
										? 'neon-glow-red border-neon-red/50'
										: 'hover:glass-strong'
								} ${selected !== null ? 'cursor-default' : 'cursor-pointer'}`}
							>
								<div className='flex items-center justify-between gap-3'>
									<span className='text-sm text-foreground flex-1'>
										{option}
									</span>
									{showCorrect && (
										<CheckCircle2
											className='text-neon-green flex-shrink-0'
											size={20}
										/>
									)}
									{showWrong && (
										<XCircle
											className='text-neon-red flex-shrink-0'
											size={20}
										/>
									)}
								</div>
							</button>
						)
					})}
				</div>

				{showExplanation && (
					<div
						className={`p-4 rounded-xl text-sm leading-relaxed ${
							isCorrect
								? 'bg-neon-green/10 border border-neon-green/30'
								: 'bg-neon-red/10 border border-neon-red/30'
						}`}
					>
						<p className='font-semibold mb-1'>
							{isCorrect ? 'Правильно!' : 'Неверно'}
						</p>
						<p className='text-muted-foreground'>{question.explanation}</p>
					</div>
				)}
			</GlassCard>

			{showExplanation && (
				<Button
					onClick={handleNext}
					size='lg'
					className='w-full glass-strong rounded-xl bg-neon-cyan/10 hover:bg-neon-cyan/20 border border-neon-cyan/30 active:scale-95'
				>
					{current < questions.length - 1 ? (
						<>
							Следующий вопрос
							<ChevronRight className='ml-2' size={18} />
						</>
					) : (
						<>
							Завершить
							<Layers className='ml-2' size={18} />
						</>
					)}
				</Button>
			)}
		</div>
	)
}

// === Основной компонент миссии «Кодекс выживания» ===

interface CodexQuizMissionProps {
	onComplete: (score: number) => void
}

type Mode = 'select' | 'novice' | 'driver_topics' | 'driver_quiz'

const CodexQuizMission = ({ onComplete }: CodexQuizMissionProps) => {
	const [mode, setMode] = useState<Mode>('select')
	const [currentTopic, setCurrentTopic] = useState<DriverTopic | null>(null)

	const handleVibrate = () => {
		if ('vibrate' in navigator) {
			navigator.vibrate(20)
		}
	}

	// Стартовая развилка: сдавал / не сдавал
	if (mode === 'select') {
		return (
			<GlassCard className='space-y-6 animate-fade-in'>
				<div className='space-y-3'>
					<h2 className='text-2xl font-bold text-foreground'>
						Кодекс выживания
					</h2>
					<p className='text-sm text-muted-foreground'>
						Выбери, есть ли у тебя опыт сдачи экзамена на водительское
						удостоверение. От этого зависит уровень заданий.
					</p>
				</div>

				<div className='grid gap-3'>
					<Button
						size='lg'
						className='w-full glass-strong rounded-xl bg-neon-cyan/10 hover:bg-neon-cyan/20 border border-neon-cyan/30 active:scale-95'
						onClick={() => {
							handleVibrate()
							setMode('novice')
						}}
					>
						Не сдавал(а) на ВУ
					</Button>
					<Button
						size='lg'
						className='w-full glass-strong rounded-xl bg-neon-green/10 hover:bg-neon-green/20 border border-neon-green/30 active:scale-95'
						onClick={() => {
							handleVibrate()
							setMode('driver_topics')
						}}
					>
						Сдал(а) на ВУ
					</Button>
				</div>
			</GlassCard>
		)
	}

	// Блок с темами для водителей
	if (mode === 'driver_topics') {
		return (
			<div className='space-y-4 animate-fade-in'>
				<GlassCard className='space-y-3'>
					<h2 className='text-xl font-bold text-foreground'>Выбор темы</h2>
					<p className='text-sm text-muted-foreground'>
						Для водителей задания разбиты на три блока. Выбери тему, с которой
						хочешь начать.
					</p>
				</GlassCard>

				<div className='grid gap-3'>
					{DRIVER_TOPICS.map(topic => (
						<GlassCard
							key={topic.id}
							className='cursor-pointer hover:glass-strong transition-all active:scale-95'
							onClick={() => {
								handleVibrate()
								setCurrentTopic(topic)
								setMode('driver_quiz')
							}}
						>
							<div className='flex items-center justify-between gap-3'>
								<div>
									<h3 className='font-semibold text-foreground'>
										{topic.title}
									</h3>
									<p className='text-xs text-muted-foreground mt-1'>
										{topic.description}
									</p>
								</div>
								<Badge variant='outline'>5 вопросов</Badge>
							</div>
						</GlassCard>
					))}
				</div>

				<Button
					variant='ghost'
					size='sm'
					className='text-xs text-muted-foreground'
					onClick={() => setMode('select')}
				>
					Назад к выбору уровня
				</Button>
			</div>
		)
	}

	if (mode === 'novice') {
		return (
			<QuizView
				modeTitle='Уровень: не сдавал на ВУ'
				questions={NOVICE_QUESTIONS}
				onFinish={score => onComplete(score)}
			/>
		)
	}

	if (mode === 'driver_quiz' && currentTopic) {
		return (
			<QuizView
				modeTitle='Уровень: водитель'
				topicTitle={currentTopic.title}
				questions={currentTopic.questions}
				onFinish={score => onComplete(score)}
			/>
		)
	}

	return null
}

export default CodexQuizMission
