// src/components/ProgressBar.tsx
import { useEffect, useState } from 'react'
import { Progress } from '@/components/ui/progress'
import {
	getPlayerProgress,
	getProgressPercentage,
	getTotalScore,
} from '@/lib/progress'
import { Trophy } from 'lucide-react'

const PROGRESS_EVENT = 'progress-updated'

const ProgressBar = () => {
	// локальное состояние, которое можно обновлять при событии
	const [percentage, setPercentage] = useState(() => getProgressPercentage())
	const [totalScore, setTotalScore] = useState(() => getTotalScore())
	const [completedCount, setCompletedCount] = useState(() => {
		const p = getPlayerProgress()
		return p.missions.filter(m => m.completed).length
	})
	const [level, setLevel] = useState(() => getPlayerProgress().level)
	const [missionsTotal, setMissionsTotal] = useState(
		() => getPlayerProgress().missions.length
	)

	useEffect(() => {
		const update = () => {
			const p = getPlayerProgress()
			setPercentage(getProgressPercentage())
			setTotalScore(getTotalScore())
			setCompletedCount(p.missions.filter(m => m.completed).length)
			setLevel(p.level)
			setMissionsTotal(p.missions.length)
		}

		// сразу на всякий случай синхронизируемся
		update()

		if (typeof window !== 'undefined') {
			window.addEventListener(PROGRESS_EVENT, update)
			return () => window.removeEventListener(PROGRESS_EVENT, update)
		}
	}, [])

	return (
		<div className='glass rounded-2xl p-4 space-y-3'>
			<div className='flex items-center justify-between'>
				<div className='flex items-center gap-2'>
					<Trophy className='text-primary' size={20} />
					<span className='text-sm font-semibold text-foreground'>{level}</span>
				</div>
				<span className='text-xs text-muted-foreground'>
					{completedCount} из {missionsTotal} миссий
				</span>
			</div>

			<Progress value={percentage} className='h-2' />

			<div className='flex items-center justify-between text-xs'>
				<span className='text-muted-foreground'>Прогресс: {percentage}%</span>
				<span className='text-primary font-semibold'>{totalScore} баллов</span>
			</div>
		</div>
	)
}

export default ProgressBar
