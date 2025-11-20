// src/pages/Quiz.tsx
console.log(
	'%c LOADED QUIZ FROM src/pages/Quiz.tsx',
	'color: lime; font-size: 20px'
)

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import GlassCard from '@/components/GlassCard'
import {
	CheckCircle2,
	XCircle,
	Trophy,
	RotateCcw,
	Share2,
	ChevronRight,
} from 'lucide-react'
import { toast } from 'sonner'
import { saveMissionProgress } from '@/lib/progress'

interface Question {
	id: number
	question: string
	options: string[]
	correctIndex: number
	explanation: string
	image?: string
}

// 15 вопросов для тех, кто СДАЛ на ВУ
const QUESTIONS: Question[] = [
	{
		id: 1,
		question: 'Можно ли вам проехать вслед за полицейской машиной?',
		options: [
			'Да, если не создаю ей помех',
			'Да, если она движется медленно',
			'Нет, это будет нарушением',
			'Можно, только если включены проблесковые маячки',
		],
		correctIndex: 2,
		explanation:
			'Движение с привязкой к траектории служебного автомобиля рассматривается как создание помех и является нарушением.',
		image: '/pdd/q1.png',
	},
	{
		id: 2,
		question: 'По какой траектории водителю разрешено совершить разворот?',
		options: [
			'Только из левой полосы по широкой дуге',
			'Только по кратчайшей траектории с занятием ближайшей полосы',
			'Любой, если не пересекаю сплошную',
			'Любой, если нет разметки',
		],
		correctIndex: 1,
		explanation:
			'Разворот выполняется по минимальной траектории с занятием ближайшей к центру полосы, без лишнего выезда навстречу.',
		image: '/pdd/q2.png',
	},
	{
		id: 3,
		question:
			'При повороте налево, в показанной ситуации, Вы обязаны уступить?',
		options: [
			'Грузовику справа',
			'Красной машине, движущейся навстречу',
			'Только пешеходам',
			'Никому, если у вас главная дорога',
		],
		correctIndex: 1,
		explanation:
			'Трамвай имеет преимущество перед всеми безрельсовыми транспортными средствами при пересечении направлений движения.',
		image: '/pdd/q3.png',
	},
	{
		id: 4,
		question:
			'Вы намерены проехать перекресток в прямом направлении. В данной ситуации Вы обязаны?',
		options: [
			'Уступить встречному грузовику',
			'Проехать первым — вы на главной дороге',
			'Уступить слева синей машине',
			'Дождаться остановки всех транспортных средств',
		],
		correctIndex: 1,
		explanation:
			'Вы двигаетесь по главной дороге, остальные — по второстепенной, поэтому проезжаете перекрёсток первым.',
		image: '/pdd/q4.png',
	},
	{
		id: 5,
		question:
			'Обязательно ли вам останавливаться, если к перекрестку не приближаются другие автомобили?',
		options: [
			'Да, знак «Стоп» требует полной остановки всегда',
			'Нет, можно только снизить скорость',
			'Да, но только если есть разметка стоп-линии',
			'Нет, если обзор хороший',
		],
		correctIndex: 0,
		explanation:
			'Знак 2.5 «Движение без остановки запрещено» обязывает к полной остановке независимо от наличия других машин.',
		image: '/pdd/q5.png',
	},
	{
		id: 6,
		question:
			'Перед Вами сломанное ТС. Двигаясь на синей машине, как вы поступите?',
		options: [
			'Объеду слева, это безопаснее',
			'Объеду справа по обочине',
			'Остановлюсь и подожду, пока уберут автомобиль',
			'Объеду слева, включив левый поворотник и убедившись в отсутствии помех',
		],
		correctIndex: 3,
		explanation:
			'Объезд препятствия допускается по встречной полосе при включённом поворотнике и при условии безопасности манёвра.',
		image: '/pdd/q6.png',
	},
	{
		id: 7,
		question:
			'Разрешено ли вам продолжить движение прямо, если вы проживаете в этом доме, а иных подъездов нет?',
		options: [
			'Нет, знак запрещает движение всем',
			'Да, если есть документ, подтверждающий место проживания',
			'Нет, нужно искать другую дорогу',
			'Да, вы являетесь местным жителем и являетесь исключением',
		],
		correctIndex: 3,
		explanation:
			'Знак «Движение запрещено» допускает проезд для транспортных средств, принадлежащих гражданам, проживающим в зоне его действия.',
		image: '/pdd/q7.png',
	},
	{
		id: 8,
		question:
			'Разрешено ли вам остановиться, если ширина полосы составляет 3 м?',
		options: [
			'Да, если остановка кратковременная',
			'Нет, остановка создаст помехи движению',
			'Да, если включить аварийную сигнализацию',
			'Можно, если нет сплошной разметки',
		],
		correctIndex: 1,
		explanation:
			'Ширина полосы 3 м недостаточна: остановившееся транспортное средство перекроет движение по полосе.',
		image: '/pdd/q8.png',
	},
	{
		id: 9,
		question: 'В данной ситуации водитель находится в условиях?',
		options: [
			'Плотного транспортного потока',
			'Ограниченной видимости из-за рельефа',
			'Скользкой дороги',
			'Перегруженной магистрали',
		],
		correctIndex: 2,
		explanation:
			'На дороге снег, лёд и последствия заноса — это типичные признаки скользкого покрытия.',
		image: '/pdd/q9.png',
	},
	{
		id: 10,
		question:
			'Трамвай поворачивает налево. Вам нужно прямо, и вы ему не мешаете. Можно проехать перекрёсток вместе с ним?',
		options: [
			'Да, если скорость одинаковая',
			'Нет, трамвай имеет преимущество — он проедет первым',
			'Да, если нет знака «Уступи дорогу»',
			'Можно только после остановки трамвая',
		],
		correctIndex: 1,
		explanation:
			'Трамвай имеет преимущество перед безрельсовым транспортом при пересечении траекторий на перекрёстке.',
		image: '/pdd/q10.png',
	},
	{
		id: 11,
		question: 'Вы намерены повернуть направо, обязаны ли вы уступить автобусу?',
		options: [
			'Нет, у вас зелёная стрелка',
			'Да, автобус завершает движение прямо',
			'Нет, автобус находится на второстепенной дороге',
			'Да, если он начал движение первым',
		],
		correctIndex: 1,
		explanation:
			'Транспортное средство, движущееся прямо, имеет преимущество перед поворачивающим, автобус завершает прямое движение.',
		image: '/pdd/q11.png',
	},
	{
		id: 12,
		question:
			'Какие действия водителя обгоняемого ТС (грузовика) будут противоречить ПДД?',
		options: [
			'Сокращение скорости',
			'Включение левого поворотника',
			'Ускорение во время вашего обгона',
			'Съезд на правую обочину',
		],
		correctIndex: 2,
		explanation:
			'Водителю обгоняемого транспортного средства запрещено увеличивать скорость во время того, как его обгоняют.',
		image: '/pdd/q12.png',
	},
	{
		id: 13,
		question:
			'Вы выехали на трамвайные пути, чтобы повернуть налево. Но передумали и решили поехать прямо до следующего перекрёстка — это будет нарушением?',
		options: [
			'Нет, если не создаёте помех трамваю',
			'Да, движение по путям разрешено только для поворота',
			'Нет, если дорога свободна',
			'Можно, если ускориться и успеть уйти вперёд',
		],
		correctIndex: 1,
		explanation:
			'Движение по встречным трамвайным путям допускается только для поворота. Продолжать по ним движение прямо нельзя.',
		image: '/pdd/q13.png',
	},
	{
		id: 14,
		question: 'Вы намерены проехать прямо, как вы должны поступить?',
		options: [
			'Уступить синей машине',
			'Проехать первым',
			'Уступить автобусу и красной машине',
			'Уступить синей и красной, автобус проедет последним',
		],
		correctIndex: 2,
		explanation:
			'По схеме перекрёстка вы должны пропустить тех, кто имеет преимущество (автобус и красный автомобиль), и проехать после них.',
		image: '/pdd/q14.png',
	},
	{
		id: 15,
		question: 'В данной ситуации водитель красного обязан:',
		options: [
			'Уступить трамваю',
			'Проехать первым',
			'Двигаться по сигналу стрелки, не уступая',
			'Проехать после всех, кто справа',
		],
		correctIndex: 0,
		explanation:
			'Рельсовый транспорт (трамвай/троллейбус) имеет преимущество перед безрельсовым при пересечении траекторий движения.',
		image: '/pdd/q15.png',
	},
]

const Quiz = () => {
	const navigate = useNavigate()
	const questions = QUESTIONS

	const [currentQuestion, setCurrentQuestion] = useState(0)
	const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
	const [showExplanation, setShowExplanation] = useState(false)
	const [score, setScore] = useState(0)
	const [answeredQuestions, setAnsweredQuestions] = useState(0)
	const [isComplete, setIsComplete] = useState(false)

	const handleVibrate = () => {
		if ('vibrate' in navigator) {
			navigator.vibrate(20)
		}
	}

	const handleAnswer = (index: number) => {
		if (selectedAnswer !== null) return

		handleVibrate()
		setSelectedAnswer(index)
		setShowExplanation(true)

		if (index === questions[currentQuestion].correctIndex) {
			setScore(prev => prev + 1)
		}

		setAnsweredQuestions(prev => prev + 1)
	}

	const handleNext = () => {
		handleVibrate()

		if (currentQuestion < questions.length - 1) {
			setCurrentQuestion(prev => prev + 1)
			setSelectedAnswer(null)
			setShowExplanation(false)
		} else {
			const percentage = Math.round((score / questions.length) * 100)
			// одна основная миссия
			saveMissionProgress('main_quiz', percentage)
			setIsComplete(true)
		}
	}

	const handleRestart = () => {
		handleVibrate()
		setCurrentQuestion(0)
		setSelectedAnswer(null)
		setShowExplanation(false)
		setScore(0)
		setAnsweredQuestions(0)
		setIsComplete(false)
	}

	const handleShare = async () => {
		handleVibrate()
		const percentage = Math.round((score / questions.length) * 100)

		if (navigator.share) {
			try {
				await navigator.share({
					title: 'Drive Smart Quiz',
					text: `Я прошёл викторину по ПДД и набрал ${score} из ${questions.length} (${percentage}%)! Попробуй и ты!`,
					url: window.location.origin,
				})
			} catch (err) {
				if ((err as Error).name !== 'AbortError') {
					toast.error('Не удалось поделиться')
				}
			}
		} else {
			toast.info('Функция "Поделиться" недоступна в этом браузере')
		}
	}

	if (isComplete) {
		const percentage = Math.round((score / questions.length) * 100)
		const badge =
			percentage >= 90
				? 'Знаток ПДД'
				: percentage >= 70
				? 'Хорошист'
				: percentage >= 50
				? 'Ученик'
				: 'Новичок'
		const badgeColor =
			percentage >= 90
				? 'green'
				: percentage >= 70
				? 'cyan'
				: percentage >= 50
				? 'yellow'
				: undefined

		return (
			<div className='space-y-6'>
				<div className='text-center space-y-4'>
					<div className='w-20 h-20 mx-auto rounded-2xl glass-strong flex items-center justify-center neon-glow-green'>
						<Trophy className='text-neon-green' size={40} />
					</div>

					<h1 className='font-bold bg-gradient-to-r from-neon-green to-neon-cyan bg-clip-text text-transparent'>
						Викторина завершена!
					</h1>

					<div className='flex flex-col items-center gap-1'>
						<span className='text-xs text-muted-foreground'>
							Режим: Сдал на ВУ
						</span>
						<div className='flex items-center justify-center gap-2'>
							<Badge
								className={`text-base px-4 py-1 ${
									badgeColor ? `neon-glow-${badgeColor}` : ''
								}`}
								variant={badgeColor ? 'outline' : 'default'}
							>
								{badge}
							</Badge>
						</div>
					</div>
				</div>

				<GlassCard className='text-center space-y-4'>
					<div className='text-5xl font-bold bg-gradient-to-r from-neon-cyan to-neon-green bg-clip-text text-transparent'>
						{score}/{questions.length}
					</div>
					<p className='text-muted-foreground'>Правильных ответов</p>
					<div className='text-2xl font-semibold text-foreground'>
						{percentage}%
					</div>
				</GlassCard>

				<div className='grid gap-3'>
					<Button
						onClick={handleRestart}
						size='lg'
						className='w-full glass-strong rounded-xl bg-neon-cyan/10 hover:bg-neon-cyan/20 border border-neon-cyan/30 active:scale-95 min-h-[52px]'
					>
						<RotateCcw className='mr-2' size={20} />
						Пройти снова
					</Button>

					<Button
						onClick={() => {
							handleVibrate()
							navigate('/missions')
						}}
						size='lg'
						className='w-full glass-strong rounded-xl bg-neon-green/10 hover:bg-neon-green/20 border border-neon-green/30 active:scale-95 min-h-[52px]'
					>
						К миссиям
					</Button>

					<Button
						onClick={handleShare}
						size='lg'
						variant='outline'
						className='w-full glass rounded-xl border-muted active:scale-95 min-h-[52px]'
					>
						<Share2 className='mr-2' size={20} />
						Поделиться
					</Button>
				</div>
			</div>
		)
	}

	const question = questions[currentQuestion]
	const isCorrect = selectedAnswer === question.correctIndex

	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<div className='space-y-1'>
					<Badge variant='outline' className='glass'>
						{currentQuestion + 1} / {questions.length}
					</Badge>
					<p className='text-[11px] text-muted-foreground'>Режим: Сдал на ВУ</p>
				</div>
				<div className='flex items-center gap-2'>
					<CheckCircle2 className='text-neon-green' size={16} />
					<span className='text-sm font-medium text-foreground'>{score}</span>
				</div>
			</div>

			<GlassCard glowColor='cyan' className='space-y-6'>
				{question.image && (
					<div className='aspect-video bg-muted rounded-xl overflow-hidden'>
						<img
							src={question.image}
							alt='Иллюстрация к вопросу'
							className='w-full h-full object-cover'
						/>
					</div>
				)}

				<h2 className='text-lg font-semibold text-foreground leading-relaxed'>
					{question.question}
				</h2>

				<div className='space-y-3'>
					{question.options.map((option, index) => {
						const isSelected = selectedAnswer === index
						const isCorrectAnswer = index === question.correctIndex
						const showCorrect = showExplanation && isCorrectAnswer
						const showWrong = showExplanation && isSelected && !isCorrect

						return (
							<button
								key={index}
								onClick={() => handleAnswer(index)}
								disabled={selectedAnswer !== null}
								className={`w-full text-left p-4 rounded-xl glass transition-all active:scale-95 min-h-[52px] ${
									showCorrect
										? 'neon-glow-green border-neon-green/50'
										: showWrong
										? 'neon-glow-red border-neon-red/50'
										: 'hover:glass-strong'
								} ${
									selectedAnswer !== null ? 'cursor-default' : 'cursor-pointer'
								}`}
							>
								<div className='flex items-center justify-between gap-3'>
									<span className='text-foreground flex-1'>{option}</span>
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
						className={`p-4 rounded-xl ${
							isCorrect
								? 'bg-neon-green/10 border border-neon-green/30'
								: 'bg-neon-red/10 border border-neon-red/30'
						} animate-fade-in`}
					>
						<div className='flex items-start gap-3'>
							{isCorrect ? (
								<CheckCircle2
									className='text-neon-green flex-shrink-0 mt-0.5'
									size={20}
								/>
							) : (
								<XCircle
									className='text-neon-red flex-shrink-0 mt-0.5'
									size={20}
								/>
							)}
							<div className='space-y-1 flex-1'>
								<p className='font-semibold text-foreground'>
									{isCorrect ? 'Правильно!' : 'Неверно'}
								</p>
								<p className='text-sm text-muted-foreground leading-relaxed'>
									{question.explanation}
								</p>
							</div>
						</div>
					</div>
				)}
			</GlassCard>

			{showExplanation && (
				<Button
					onClick={handleNext}
					size='lg'
					className='w-full min-h-[52px] animate-fade-in'
				>
					{currentQuestion < questions.length - 1 ? (
						<>
							Следующий вопрос
							<ChevronRight className='ml-2' size={20} />
						</>
					) : (
						<>
							Завершить
							<Trophy className='ml-2' size={20} />
						</>
					)}
				</Button>
			)}
		</div>
	)
}

export default Quiz
