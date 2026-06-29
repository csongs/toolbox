import { Shield, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ThemeToggle from './ThemeToggle'

interface NavBarProps {
  onToggleSidebar?: () => void
}

export default function NavBar({ onToggleSidebar }: NavBarProps) {
  return (
    <header className="border-b">
      <div className="flex h-14 items-center px-4 gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onToggleSidebar}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <span className="font-semibold">TOOLBOX</span>
        <div className="ml-auto">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
