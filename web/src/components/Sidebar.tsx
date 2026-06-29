import { type ToolDefinition } from '@/types/tools'
import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface SidebarProps {
  tools: ToolDefinition[]
}

export default function Sidebar({ tools }: SidebarProps) {
  return (
    <TooltipProvider>
      {tools.map((tool) => (
        <Tooltip key={tool.id}>
          <TooltipTrigger asChild>
            <NavLink
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
          </TooltipTrigger>
          <TooltipContent side="right">{tool.name}</TooltipContent>
        </Tooltip>
      ))}
    </TooltipProvider>
  )
}
