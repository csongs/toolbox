import { type ToolDefinition } from '@/types/tools'
import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'

interface SidebarProps {
  tools: ToolDefinition[]
}

export default function Sidebar({ tools }: SidebarProps) {
  return (
    <nav className="flex flex-col gap-y-1">
      {tools.map((tool) => (
        <NavLink
          key={tool.id}
          to={tool.path}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-x-2 rounded-md p-2 text-sm font-medium hover:bg-accent',
              isActive && 'bg-accent'
            )
          }
        >
          <tool.icon className="h-5 w-5" />
          <span>{tool.name}</span>
        </NavLink>
      ))}
    </nav>
  )
}
