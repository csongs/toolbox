import { type ToolDefinition } from '@/types/tools'
import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'

interface SidebarProps {
  tools: ToolDefinition[]
}

export default function Sidebar({ tools }: SidebarProps) {
  return (
    <aside className="w-56 border-r bg-muted/40 p-2 flex flex-col gap-1">
      {tools.map((tool) => (
        <NavLink
          key={tool.id}
          to={tool.path}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-muted'
            )
          }
        >
          <tool.icon className="h-4 w-4" />
          {tool.name}
        </NavLink>
      ))}
    </aside>
  )
}
