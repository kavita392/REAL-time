"use client"

import { useState } from "react"
import { type Version } from "@/lib/app-context"
import { X, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

function formatTimestamp(date: Date): string {
  const now = new Date()
  const isToday = date.toDateString() === now.toDateString()
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  const isYesterday = date.toDateString() === yesterday.toDateString()

  const time = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })

  if (isToday) return `Today, ${time}`
  if (isYesterday) return `Yesterday, ${time}`
  return `${date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}, ${time}`
}

export function VersionHistory({
  versions,
  onClose,
}: {
  versions: Version[]
  onClose: () => void
}) {
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null)

  return (
    <div className="flex w-80 shrink-0 flex-col border-l border-border bg-card">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <RotateCcw className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold text-card-foreground">Version History</h3>
        </div>
        <button
          onClick={onClose}
          className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
          aria-label="Close version history"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Versions list */}
      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-1 p-3">
          {versions.length > 0 ? (
            versions.map((version) => (
              <button
                key={version.id}
                onClick={() =>
                  setSelectedVersion(
                    selectedVersion === version.id ? null : version.id
                  )
                }
                className={cn(
                  "flex flex-col items-start gap-1.5 rounded-md p-3 text-left transition-colors",
                  selectedVersion === version.id
                    ? "bg-primary/10 border border-primary/20"
                    : "hover:bg-accent border border-transparent"
                )}
              >
                <div className="flex items-center gap-2 w-full">
                  <span className="text-xs font-medium text-card-foreground">
                    {formatTimestamp(version.timestamp)}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  by {version.author}
                </span>

                {/* Show changes when expanded */}
                {selectedVersion === version.id && (
                  <div className="mt-2 flex flex-col gap-1.5 w-full">
                    {version.changes.map((change, idx) => (
                      <div
                        key={idx}
                        className={cn(
                          "rounded px-2 py-1 text-xs",
                          change.type === "added"
                            ? "bg-success/10 text-success"
                            : "bg-destructive/10 text-destructive"
                        )}
                      >
                        <span className="font-medium">
                          {change.type === "added" ? "+" : "-"}
                        </span>{" "}
                        {change.text}
                      </div>
                    ))}
                    <Button variant="outline" size="sm" className="mt-2 text-xs h-7">
                      Restore this version
                    </Button>
                  </div>
                )}
              </button>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center px-4">
              <RotateCcw className="h-8 w-8 text-muted-foreground/50 mb-3" />
              <p className="text-sm font-medium text-muted-foreground">No version history</p>
              <p className="text-xs text-muted-foreground/80 mt-1">
                Changes will be tracked as you and your team edit this document
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
