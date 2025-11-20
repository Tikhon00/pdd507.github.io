// src/pages/Results.tsx
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import GlassCard from '@/components/GlassCard'
import BadgeCard from '@/components/BadgeCard'
import AnimatedBackground from '@/components/AnimatedBackground'
import { Trophy, Home, RotateCcw } from 'lucide-react'
import { getPlayerProgress, resetProgress, getTotalScore } from '@/lib/progress'
import { useState } from 'react'

const Results = () => {
	const navigate = useNavigate()
	const [progress, setProgress] = useState(getPlayerProgress())
	const totalScore = getTotalScore()

	const handleReset = () => {
		if (confirm('Вы уверены? Весь прогресс будет удалён!')) {
			resetProgress()
			setProgress(getPlayerProgress())
		}
	}

	return (
		<div className='relative min-h-screen'>
			<AnimatedBackground />

			<div className='relative z-10 space-y-6 animate-fade-in'>
				<GlassCard className='text-center space-y-4 neon-glow-green'>
					<div className='w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto neon-glow-green'>
						<Trophy className='text-white' size={40} />
					</div>

					<div className='space-y-2'>
						<h1 className='text-3xl font-bold text-foreground'>
							Твой результат
						</h1>
						<p className='text-lg text-primary font-semibold'>
							{progress.level}
						</p>
					</div>

					<div className='grid grid-cols-2 gap-4 py-4'>
						<div className='space-y-1'>
							<p className='text-2xl font-bold text-primary'>{totalScore}</p>
							<p className='text-sm text-muted-foreground'>Средний балл</p>
						</div>
						<div className='space-y-1'>
							<p className='text-2xl font-bold text-primary'>
								{progress.missions.filter(m => m.completed).length}
							</p>
							<p className='text-sm text-muted-foreground'>Миссий пройдено</p>
						</div>
					</div>
				</GlassCard>

				{progress.badges.length > 0 && (
					<GlassCard className='space-y-3'>
						<h2 className='text-xl font-semibold text-foreground'>
							Бейджи ({progress.badges.length})
						</h2>
						<div className='space-y-2'>
							{progress.badges.map((badge, idx) => (
								<BadgeCard key={idx} badge={badge} />
							))}
						</div>
					</GlassCard>
				)}

				<GlassCard className='space-y-3'>
					<h2 className='text-xl font-semibold text-foreground'>Все миссии</h2>
					<div className='space-y-2'>
						{progress.missions.map(mission => (
							<div
								key={mission.id}
								className='flex items-center justify-between p-3 rounded-xl bg-muted/30'
							>
								<span className='text-sm text-foreground'>{mission.title}</span>
								<span
									className={`text-sm font-semibold ${
										mission.completed ? 'text-primary' : 'text-muted-foreground'
									}`}
								>
									{mission.completed
										? `${mission.score} баллов`
										: 'Не пройдена'}
								</span>
							</div>
						))}
					</div>
				</GlassCard>

				<div className='space-y-3'>
					<Button
						onClick={() => navigate('/missions')}
						variant='default'
						className='w-full gap-2'
						size='lg'
					>
						<Home size={20} />К миссиям
					</Button>

					<Button
						onClick={handleReset}
						variant='outline'
						className='w-full gap-2'
						size='lg'
					>
						<RotateCcw size={20} />
						Сбросить прогресс
					</Button>
				</div>
			</div>
		</div>
	)
}

export default Results
