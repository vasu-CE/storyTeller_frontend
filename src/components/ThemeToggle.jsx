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
        className="rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] hover:bg-[var(--surface3)]"
        aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
        title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      >
        {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </Button>
    </div>
  )
}

export default ThemeToggle
