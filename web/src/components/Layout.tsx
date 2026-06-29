import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import NavBar from './NavBar'
import Sidebar from './Sidebar'
import Footer from './Footer'
import { cn } from '@/lib/utils'
import { type ToolDefinition } from '@/types/tools'

interface LayoutProps {
  tools: ToolDefinition[]
}

export default function Layout({ tools }: LayoutProps): JSX.Element {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
      />
      <div className="flex flex-1">
        <aside
          className={cn(
            'w-56 border-r bg-muted/40 p-2 flex flex-col gap-1 transition-all',
            'max-md:fixed max-md:inset-y-14 max-md:left-0 max-md:z-50 max-md:bg-background max-md:shadow-lg',
            !sidebarOpen && 'max-md:-translate-x-full'
          )}
        >
          <Sidebar tools={tools} />
        </aside>
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  )
}
