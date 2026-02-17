"use client"

import { type Document, useApp } from "@/lib/app-context"
import { FileText, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return "Just now"
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString()
}

export function DocumentCard({ document }: { document: Document }) {
  const { setActiveDocument, setView } = useApp()

  const openDocument = () => {
    setActiveDocument(document)
    setView("editor")
  }

  return (
    <div
      onClick={openDocument}
      className="group relative flex cursor-pointer flex-col rounded-lg border border-border bg-card p-5 transition-all hover:border-primary/30 hover:shadow-md"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          openDocument()
        }
      }}
    >
     
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <FileText className="h-5 w-5 text-primary" />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger
            onClick={(e) => e.stopPropagation()}
            className="opacity-0 group-hover:opacity-100 transition-opacity rounded-md p-1 hover:bg-accent"
          >
            <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
            <span className="sr-only">Document options</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); openDocument() }}>
              Open
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => e.stopPropagation()} className="text-destructive">
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

    
      <h3 className="mt-4 text-sm font-semibold text-card-foreground line-clamp-1">
        {document.title}
      </h3>
      <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
        {document.content || "Empty document"}
      </p>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {formatRelativeTime(document.lastEdited)}
        </span>
        <div className="flex -space-x-1.5">
          {document.collaborators.slice(0, 3).map((collab) => (
            <div
              key={collab.id}
              title={collab.name}
              className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-card text-[10px] font-medium text-primary-foreground"
              style={{ backgroundColor: collab.color }}
            >
              {collab.avatar}
            </div>
          ))}
          {document.collaborators.length > 3 && (
            <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-card bg-muted text-[10px] font-medium text-muted-foreground">
              +{document.collaborators.length - 3}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
