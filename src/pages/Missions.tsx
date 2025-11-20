// src/pages/Missions.tsx
import { useNavigate } from 'react-router-dom'
import GlassCard from '@/components/GlassCard'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getPlayerProgress } from '@/lib/progress'
import { Car, GraduationCap, Brain } from 'lucide-react'

const Missions = () => {
	const navigate = useNavigate()
	const progress = getPlayerProgress()

	const avgScore =
		progress.missions.length > 0
			? Math.round(
					progress.missions.reduce((sum, m) => sum + m.score, 0) /
						progress.missions.length
			  )
			: 0

	return (
		<div className='space-y-6 animate-fade-in'>
			<div className='space-y-2'>
				<h1 className='text-3xl font-bold text-foreground'>Миссии</h1>
				<p className='text-muted-foreground'>
					Выбери режим: сначала потренируйся в простых историях пешехода или
					пройди тест, как настоящий водитель.
				</p>
			</div>

			{/* Карточка с прогрессом */}
			<GlassCard className='space-y-3'>
				<div className='flex items-center justify-between'>
					<div>
						<p className='text-sm text-muted-foreground'>Текущий уровень</p>
						<p className='text-lg font-semibold text-foreground'>
							{progress.level}
						</p>
					</div>
					<Badge variant='outline' className='px-3 py-1'>
						Средний балл: {avgScore}
					</Badge>
				</div>
			</GlassCard>

			{/* Выбор режимов */}
			<div className='space-y-4'>
				{/* Не сдавал на ВУ */}
				<GlassCard className='space-y-3'>
					<div className='flex items-center gap-3'>
						<div className='w-12 h-12 rounded-xl bg-muted flex items-center justify-center'>
							<Car size={24} />
						</div>
						<div>
							<h2 className='font-semibold text-foreground'>Не сдавал на ВУ</h2>
							<p className='text-sm text-muted-foreground'>
								6 интерактивных историй для пешеходов и начинающих. Потренируйся
								принимать решения в типичных ситуациях на дороге.
							</p>
						</div>
					</div>

					<Button
						className='w-full'
						size='lg'
						onClick={() => navigate('/quiz-novice')}
					>
						Начать истории
					</Button>
				</GlassCard>

				{/* Сдал на ВУ */}
				<GlassCard className='space-y-3'>
					<div className='flex items-center gap-3'>
						<div className='w-12 h-12 rounded-xl bg-muted flex items-center justify-center'>
							<GraduationCap size={24} />
						</div>
						<div>
							<h2 className='font-semibold text-foreground'>Сдал на ВУ</h2>
							<p className='text-sm text-muted-foreground'>
								15 задач по ПДД с картинками — как в экзаменационных билетах.
							</p>
						</div>
					</div>

					<Button
						className='w-full'
						size='lg'
						onClick={() => navigate('/quiz')}
					>
						Пройти тест по ПДД
					</Button>
				</GlassCard>

				{/* Вопросы от нейросети */}
				<GlassCard className='space-y-3'>
					<div className='flex items-center gap-3'>
						<div className='w-12 h-12 rounded-xl bg-muted flex items-center justify-center'>
							<Brain size={24} />
						</div>
						<div>
							<h2 className='font-semibold text-foreground'>
								Вопросы по ПДД от нейросети
							</h2>
							<p className='text-sm text-muted-foreground'>
								Модель генерирует новые вопросы по ПДД для возраста 15–23 лет.
								Каждый раз — уникальная задача.
							</p>
						</div>
					</div>

					<Button
						className='w-full'
						size='lg'
						onClick={() => navigate('/ai-quiz')}
					>
						Сгенерировать вопрос
					</Button>
				</GlassCard>
			</div>
		</div>
	)
}

export default Missions
