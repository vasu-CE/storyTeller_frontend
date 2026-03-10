import { Moon, Sun } from 'lucide-react'
import { Button } from './ui/button'

function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === 'dark'

  return (
    <div className="fixed right-4 top-4 z-50 sm:right-6 sm:top-6">
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={onToggle}
        className="rounded-full border border-[#d8deea] bg-white text-[#191c26] hover:bg-[#f0f3fa] dark:border-[#2e3142] dark:bg-[#1a1d27] dark:text-[#eaeaf0] dark:hover:bg-[#21242f]"
        aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
        title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      >
        {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </Button>
    </div>
  )
}

export default ThemeToggle
