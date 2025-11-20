// src/components/Layout.tsx
import { useLocation } from 'react-router-dom'
import BottomNav from './BottomNav'
import ProgressBar from './ProgressBar'

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation()

  // На странице результата прогресс-плашку не показываем
  const hideProgressBar = location.pathname === '/result'

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Основной контент */}
      <main className="pt-4 pb-4 min-h-screen">
        <div className="mobile-container space-y-4">
          {!hideProgressBar && <ProgressBar />}
          <div className="animate-fade-in">{children}</div>
        </div>
      </main>

      {/* Нижняя навигация */}
      <BottomNav />
    </div>
  )
}

export default Layout
