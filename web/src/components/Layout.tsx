import { Outlet } from 'react-router-dom'
import NavBar from './NavBar'
import Sidebar from './Sidebar'
import Footer from './Footer'
import { type ToolDefinition } from '@/types/tools'

interface LayoutProps {
  tools: ToolDefinition[]
}

export default function Layout({ tools }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <div className="flex flex-1">
        <Sidebar tools={tools} />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  )
}
