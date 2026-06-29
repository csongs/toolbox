import { Shield } from 'lucide-react'
import ThemeToggle from './ThemeToggle'

export default function NavBar() {
  return (
    <header className="border-b">
      <div className="flex h-14 items-center px-4 gap-4">
        <Shield className="h-6 w-6" />
        <span className="font-semibold">Crypto Toolbox</span>
        <div className="ml-auto">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
