"use client"

import { cn } from "@/lib/utils"
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  List,
  Code,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  Link,
} from "lucide-react"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type ToolbarButton = {
  icon: React.ReactNode
  label: string
  shortcut?: string
}

export function EditorToolbar() {
  const formatGroup1: ToolbarButton[] = [
    { icon: <Bold className="h-4 w-4" />, label: "Bold", shortcut: "Ctrl+B" },
    { icon: <Italic className="h-4 w-4" />, label: "Italic", shortcut: "Ctrl+I" },
    { icon: <Underline className="h-4 w-4" />, label: "Underline", shortcut: "Ctrl+U" },
    { icon: <Strikethrough className="h-4 w-4" />, label: "Strikethrough" },
  ]

  const formatGroup2: ToolbarButton[] = [
    { icon: <Heading1 className="h-4 w-4" />, label: "Heading 1" },
    { icon: <Heading2 className="h-4 w-4" />, label: "Heading 2" },
  ]

  const formatGroup3: ToolbarButton[] = [
    { icon: <List className="h-4 w-4" />, label: "Bullet List" },
    { icon: <Code className="h-4 w-4" />, label: "Code Block" },
    { icon: <Link className="h-4 w-4" />, label: "Insert Link" },
  ]

  const formatGroup4: ToolbarButton[] = [
    { icon: <AlignLeft className="h-4 w-4" />, label: "Align Left" },
    { icon: <AlignCenter className="h-4 w-4" />, label: "Align Center" },
  ]

  return (
    <TooltipProvider delayDuration={300}>
      <div className="sticky top-0 z-10 flex items-center gap-1 border-b border-border bg-card px-4 py-2 overflow-x-auto">
        <ToolbarGroup buttons={formatGroup1} />
        <Separator orientation="vertical" className="mx-1 h-6" />
        <ToolbarGroup buttons={formatGroup2} />
        <Separator orientation="vertical" className="mx-1 h-6" />
        <ToolbarGroup buttons={formatGroup3} />
        <Separator orientation="vertical" className="mx-1 h-6" />
        <ToolbarGroup buttons={formatGroup4} />
      </div>
    </TooltipProvider>
  )
}

function ToolbarGroup({ buttons }: { buttons: ToolbarButton[] }) {
  return (
    <div className="flex items-center gap-0.5">
      {buttons.map((btn) => (
        <Tooltip key={btn.label}>
          <TooltipTrigger asChild>
            <button
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-md transition-colors",
                "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
              aria-label={btn.label}
            >
              {btn.icon}
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-xs">
            {btn.label}
            {btn.shortcut && (
              <span className="ml-2 text-muted-foreground">{btn.shortcut}</span>
            )}
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  )
}
