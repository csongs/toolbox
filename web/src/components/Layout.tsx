import { useCallback, useEffect, useRef, useState } from 'react'
import { Outlet } from 'react-router-dom'
import NavBar from './NavBar'
import Sidebar from './Sidebar'
import Footer from './Footer'
import { cn } from '@/lib/utils'
import { type ToolDefinition } from '@/types/tools'
import { GripVertical } from 'lucide-react'

interface LayoutProps {
  tools: ToolDefinition[]
}

const MIN_SIDEBAR = 160
const MAX_SIDEBAR = 400
const DEFAULT_SIDEBAR = 200

export default function Layout({ tools }: LayoutProps): JSX.Element {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_SIDEBAR)
  const dragging = useRef(false)

  const onMouseDown = useCallback(() => {
    dragging.current = true
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
  }, [])

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!dragging.current) return
      const newWidth = Math.min(MAX_SIDEBAR, Math.max(MIN_SIDEBAR, e.clientX))
      setSidebarWidth(newWidth)
    }
    const onMouseUp = () => {
      if (dragging.current) {
        dragging.current = false
        document.body.style.cursor = ''
        document.body.style.userSelect = ''
      }
    }
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
      />
      <div className="flex flex-1">
        <aside
          className={cn(
            'border-r bg-muted/40 p-2 flex flex-col gap-1 relative',
            'max-md:fixed max-md:inset-y-14 max-md:left-0 max-md:z-50 max-md:bg-background max-md:shadow-lg',
            'transition-[transform] max-sm:transition-all',
            !sidebarOpen && 'max-md:-translate-x-full'
          )}
          style={{ width: sidebarWidth }}
        >
          <Sidebar tools={tools} />

          {/* Drag handle */}
          <div
            onMouseDown={onMouseDown}
            className="absolute right-0 top-0 bottom-0 w-3 cursor-col-resize flex items-center justify-center hover:bg-accent/50 group max-md:hidden"
          >
            <GripVertical className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </aside>

        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <main className="flex-1 p-4 md:p-6 overflow-auto min-w-0">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  )
}
