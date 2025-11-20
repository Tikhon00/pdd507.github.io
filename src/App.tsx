// src/App.tsx
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'

import Layout from './components/Layout'
import IntroAnimation from './components/IntroAnimation'
import Home from './pages/Home'
import Missions from './pages/Missions'
import Results from './pages/Results'
import NotFound from './pages/NotFound'
import Quiz from './pages/Quiz'
import NoviceQuiz from './pages/NoviceQuiz'
import AiQuiz from './pages/AiQuiz'

const queryClient = new QueryClient()

const App = () => {
	const [showIntro, setShowIntro] = useState(true)
	const [hasSeenIntro, setHasSeenIntro] = useState(false)

	useEffect(() => {
		const seen = localStorage.getItem('hasSeenIntro')
		if (seen) {
			setShowIntro(false)
			setHasSeenIntro(true)
		}
	}, [])

	const handleIntroComplete = () => {
		localStorage.setItem('hasSeenIntro', 'true')
		setHasSeenIntro(true)
		setShowIntro(false)
	}

	return (
		<QueryClientProvider client={queryClient}>
			<TooltipProvider>
				<Toaster />
				<Sonner position='top-center' />
				{showIntro && !hasSeenIntro && (
					<IntroAnimation onComplete={handleIntroComplete} />
				)}
				<BrowserRouter>
					<Layout>
						<Routes>
							<Route path='/' element={<Home />} />
							<Route path='/missions' element={<Missions />} />
							{/* тесты по ПДД */}
							<Route path='/quiz' element={<Quiz />} /> {/* сдал на ВУ */}
							<Route path='/quiz-novice' element={<NoviceQuiz />} />{' '}
							{/* не сдавал */}
							{/* вопросы от нейросети */}
							<Route path='/ai-quiz' element={<AiQuiz />} />
							<Route path='/result' element={<Results />} />
							<Route path='*' element={<NotFound />} />
						</Routes>
					</Layout>
				</BrowserRouter>
			</TooltipProvider>
		</QueryClientProvider>
	)
}

export default App
