// src/lib/progress.ts
export interface MissionProgress {
	id: string
	title: string
	score: number
	maxScore: number
	completed: boolean
	completedAt?: number
}

export interface PlayerProgress {
	missions: MissionProgress[]
	badges: string[]
	level: string
}

const STORAGE_KEY = 'ds_progress_v1'

// название кастомного события, которое будем диспатчить при изменении прогресса
const PROGRESS_EVENT = 'progress-updated'

const DEFAULT_MISSIONS: MissionProgress[] = [
	{
		id: 'exam_novice',
		title: 'Миссии для новичков',
		score: 0,
		completed: false,
		maxScore: 100,
	},
	{
		id: 'exam_pro',
		title: 'Экзамен по ПДД',
		score: 0,
		completed: false,
		maxScore: 100,
	},
]

export const getPlayerProgress = (): PlayerProgress => {
	const stored = localStorage.getItem(STORAGE_KEY)
	if (stored) {
		try {
			return JSON.parse(stored)
		} catch {
			return getDefaultProgress()
		}
	}
	return getDefaultProgress()
}

const getDefaultProgress = (): PlayerProgress => ({
	missions: DEFAULT_MISSIONS,
	badges: [],
	level: 'Новичок',
})

// внутренний помощник: после любого изменения прогресса оповещаем все компоненты
const notifyProgressUpdated = () => {
	if (typeof window !== 'undefined') {
		window.dispatchEvent(new Event(PROGRESS_EVENT))
	}
}

export const saveMissionProgress = (missionId: string, score: number) => {
	const progress = getPlayerProgress()

	const missionIndex = progress.missions.findIndex(m => m.id === missionId)
	if (missionIndex === -1) return progress

	// Обновляем миссию
	progress.missions[missionIndex] = {
		...progress.missions[missionIndex],
		score,
		completed: score >= 60,
		completedAt: Date.now(),
	}

	// Бейджи (пока не используем, но логика сохранена)
	const newBadge = getBadgeForMission(missionId, score)
	if (newBadge && !progress.badges.includes(newBadge)) {
		progress.badges.push(newBadge)
	}

	// Обновляем уровень
	progress.level = calculateLevel(progress.missions)

	localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))

	// сигнал всем подписчикам
	notifyProgressUpdated()

	return progress
}

const getBadgeForMission = (
	missionId: string,
	score: number
): string | undefined => {
	switch (missionId) {
		case 'exam_novice':
			return score >= 90 ? 'Юный инспектор' : undefined
		case 'exam_pro':
			return score >= 90 ? 'Профи ПДД' : undefined
		default:
			return undefined
	}
}

const calculateLevel = (missions: MissionProgress[]): string => {
	const totalScore = missions.reduce((sum, m) => sum + m.score, 0)
	const avgScore = Math.round(totalScore / missions.length)

	if (avgScore >= 80) return 'Профи БДД'
	if (avgScore >= 60) return 'Городской водитель'
	return 'Новичок'
}

export const getProgressPercentage = (): number => {
	const progress = getPlayerProgress()
	const completedCount = progress.missions.filter(m => m.completed).length
	return Math.round((completedCount / progress.missions.length) * 100)
}

export const getTotalScore = (): number => {
	const progress = getPlayerProgress()
	return Math.round(
		progress.missions.reduce((sum, m) => sum + m.score, 0) /
			progress.missions.length
	)
}

export const getMotivationalMessage = (score: number): string => {
	if (score >= 95) {
		return 'Ты знаешь ПДД лучше, чем большинство водителей! Отлично!'
	} else if (score >= 85) {
		return 'Потрясающий результат! Ты почти эксперт ПДД!'
	} else if (score >= 70) {
		return 'Отличная работа! Продолжай в том же духе!'
	} else if (score >= 60) {
		return 'Хороший результат! Ещё немного практики и будешь профи!'
	} else {
		return 'Неплохое начало! Попробуй ещё раз, у тебя получится!'
	}
}

export const resetProgress = () => {
	localStorage.removeItem(STORAGE_KEY)
	// после сброса тоже оповещаем всех
	notifyProgressUpdated()
}
