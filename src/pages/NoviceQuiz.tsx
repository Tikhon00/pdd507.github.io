// src/pages/NoviceQuiz.tsx
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
	ChevronRight,
} from 'lucide-react'

type NoviceQuestion = {
	id: string
	image: string
	question: string
	options: string[]
	correctIndex: number
	explanation: string
}

const questions: NoviceQuestion[] = [
	{
		id: 'novice_hard_01_blind_driveway',
		image: '/pdd/novice/1qs.png',
		question:
			'Ты идёшь вечером по двору. По правой стороне припаркованы машины вплотную друг к другу. Перед тобой — выезд из дворового проезда, который закрыт двумя большими внедорожниками. Из-за них не видно, есть ли кто-то на дороге. Как лучше всего пройти этот участок?',
		options: [
			'Быстро пройти между машинами, пока никто не едет.',
			'Остановиться, медленно выглянуть и убедиться, что нет машин, затем пройти.',
			'Пройти дальше по дороге, но уже по самой проезжей части.',
			'Перебежать этот участок как можно быстрее.',
		],
		correctIndex: 1,
		explanation:
			'Слепая зона — сначала нужно аккуратно оценить обстановку. Выглянуть, убедиться, что нет машин, и только потом идти.',
	},
	{
		id: 'novice_hard_02_dark_wet',
		image: '/pdd/novice/2qs.png',
		question:
			'Ты переходишь дорогу вечером. Асфальт мокрый, свет фар отражается так, что сложно понять, насколько быстро едет машина. Ты стоишь у края тротуара. Одна машина приближается, но расстояние оценить трудно. Какое действие безопаснее?',
		options: [
			'Перейти быстро — кажется, что машина ещё далеко.',
			'Начать переход, но идти медленно.',
			'Подождать пару секунд, чтобы понять, меняется ли скорость приближения.',
			'Помахать рукой водителю, чтобы он пропустил.',
		],
		correctIndex: 2,
		explanation:
			'Если скорость и расстояние оценить сложно, лучше чуть подождать и посмотреть, как меняется положение машины. Так понятнее, успеешь ли безопасно перейти.',
	},
	{
		id: 'novice_hard_03_two_stage',
		image: '/pdd/novice/3qs.png',
		question:
			'Дорога широкая — 4 полосы. Посередине есть небольшой островок безопасности. На первой половине дороги машин нет, а на второй едут автомобили. Как правильно действовать?',
		options: [
			'Перейти всю дорогу сразу, пока первая половина свободна.',
			'Перейти только первую половину до островка безопасности, затем остановиться и оценить вторую часть дороги.',
			'Подождать, пока обе половины дороги полностью пустые.',
			'Бежать диагонально, чтобы сократить путь.',
		],
		correctIndex: 1,
		explanation:
			'Островок безопасности как раз нужен для перехода в два этапа: сначала — до островка, остановка и оценка второй половины дороги.',
	},
	{
		id: 'novice_hard_04_scooter_carpark',
		image: '/pdd/novice/4qs.png',
		question:
			'Ты едешь на самокате по тротуару. Впереди стоит большая машина, которая почти полностью закрывает обзор выезда со двора. Если продолжать ехать, можно не увидеть автомобиль, выезжающий оттуда. Что безопаснее?',
		options: [
			'Объехать припаркованную машину широким радиусом, не снижая скорость.',
			'Сильно снизить скорость и быть готовым остановиться, пока не увидишь, что выезд свободен.',
			'Сигналить и ехать дальше.',
			'Съехать на проезжую часть и объехать по дороге.',
		],
		correctIndex: 1,
		explanation:
			'Слепой выезд — зона повышенного риска. Правильное действие — снижать скорость и быть готовым полностью остановиться.',
	},
	{
		id: 'novice_hard_05_driver_distraction',
		image: '/pdd/novice/5qs.png',
		question:
			'Ты сидишь рядом с водителем. Он ведёт машину по району и параллельно пытается прочитать сообщение на телефоне, опуская взгляд каждые несколько секунд. Как лучше всего поступить тебе?',
		options: [
			'Ничего не говорить — он опытный водитель.',
			'Спокойно предложить остановиться и ответить на сообщение.',
			'Резко крикнуть, чтобы он убрал телефон.',
			'Взять телефон из его рук.',
		],
		correctIndex: 1,
		explanation:
			'Лучшее решение — спокойно предложить остановиться. Это снижает риск конфликта и повышает безопасность.',
	},
	{
		id: 'novice_hard_06_school_bus',
		image: '/pdd/novice/6qs.png',
		question:
			'Автобус остановился около школы. Ты выходишь и видишь поток машин на соседней полосе — они едут быстро, обзор перекрыт автобусом. На другом конце дороги есть пешеходный переход в 25 метрах. Что сделать?',
		options: [
			'Перейти сразу, перед автобусом, пока машин на ближней полосе нет.',
			'Обойти автобус, посмотреть в обе стороны и, если машин нет, перейти.',
			'Подождать, пока автобус отъедет, и перейти по ближайшему пешеходному переходу.',
			'Подождать, пока кто-то другой перейдёт первым.',
		],
		correctIndex: 2,
		explanation:
			'Выход из-за автобуса — одна из самых опасных ситуаций. Нужно дождаться, пока он отъедет, и перейти по пешеходному переходу, когда обзор и обстановка безопасны.',
	},
]

const NoviceQuiz = () => {
	const navigate = useNavigate()
	const [currentQuestion, setCurrentQuestion] = useState(0)
	const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
	const [showExplanation, setShowExplanation] = useState(false)
	const [score, setScore] = useState(0)
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
	}

	const handleNext = () => {
		handleVibrate()

		if (currentQuestion < questions.length - 1) {
			setCurrentQuestion(prev => prev + 1)
			setSelectedAnswer(null)
			setShowExplanation(false)
		} else {
			setIsComplete(true)
		}
	}

	const handleRestart = () => {
		handleVibrate()
		setCurrentQuestion(0)
		setSelectedAnswer(null)
		setShowExplanation(false)
		setScore(0)
		setIsComplete(false)
	}

	if (isComplete) {
		const percentage = Math.round((score / questions.length) * 100)
		const badge =
			percentage >= 90
				? 'Почти как водитель!'
				: percentage >= 70
				? 'Молодец, хороший уровень'
				: percentage >= 50
				? 'Неплохо, но нужно повторить'
				: 'Начало положено'

		return (
			<div className='space-y-6'>
				<div className='text-center space-y-4'>
					<div className='w-20 h-20 mx-auto rounded-2xl glass-strong flex items-center justify-center'>
						<Trophy size={40} />
					</div>

					<h1 className='font-bold text-foreground'>Истории пройдены!</h1>

					<Badge variant='outline' className='px-4 py-1'>
						{badge}
					</Badge>
				</div>

				<GlassCard className='text-center space-y-4'>
					<div className='text-5xl font-bold'>
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
						className='w-full glass-strong rounded-xl min-h-[52px]'
					>
						<RotateCcw className='mr-2' size={20} />
						Пройти ещё раз
					</Button>

					<Button
						onClick={() => {
							handleVibrate()
							navigate('/missions')
						}}
						size='lg'
						variant='outline'
						className='w-full glass rounded-xl min-h-[52px]'
					>
						Вернуться к миссиям
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
				<Badge variant='outline' className='glass'>
					{currentQuestion + 1} / {questions.length}
				</Badge>
				<div className='flex items-center gap-2 text-sm text-muted-foreground'>
					Правильно: {score}
				</div>
			</div>

			<GlassCard className='space-y-6'>
				<div className='aspect-video bg-muted rounded-xl overflow-hidden'>
					<img
						src={question.image}
						alt='Ситуация'
						className='w-full h-full object-cover'
					/>
				</div>

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
										? 'border border-green-500'
										: showWrong
										? 'border border-red-500'
										: 'hover:glass-strong'
								} ${
									selectedAnswer !== null ? 'cursor-default' : 'cursor-pointer'
								}`}
							>
								<div className='flex items-center justify между gap-3'>
									<span className='text-foreground flex-1'>{option}</span>
									{showCorrect && (
										<CheckCircle2
											className='text-green-500 flex-shrink-0'
											size={20}
										/>
									)}
									{showWrong && (
										<XCircle className='text-red-500 flex-shrink-0' size={20} />
									)}
								</div>
							</button>
						)
					})}
				</div>

				{showExplanation && (
					<div
						className={`p-4 rounded-xl border ${
							isCorrect ? 'border-green-500/60' : 'border-red-500/60'
						} animate-fade-in`}
					>
						<div className='flex items-start gap-3'>
							{isCorrect ? (
								<CheckCircle2
									className='text-green-500 flex-shrink-0 mt-0.5'
									size={20}
								/>
							) : (
								<XCircle
									className='text-red-500 flex-shrink-0 mt-0.5'
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

export default NoviceQuiz
