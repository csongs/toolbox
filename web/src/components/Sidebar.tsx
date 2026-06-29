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
                  'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                )
              }
            >
              <tool.icon className="h-5 w-5 shrink-0 leading-none self-center" />
              <span className="truncate leading-none self-center -mt-px">{tool.name}</span>
            </NavLink>
          </TooltipTrigger>
          <TooltipContent side="right">{tool.name}</TooltipContent>
        </Tooltip>
      ))}
    </TooltipProvider>
  )
}
