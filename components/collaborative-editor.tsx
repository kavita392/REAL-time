"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { useApp } from "@/lib/app-context"
import { EditorToolbar } from "@/components/editor-toolbar"
import { CollaboratorCursor } from "@/components/collaborator-cursor"
import { VersionHistory } from "@/components/version-history"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  Share2,
  History,
  MoreHorizontal,
  Check,
} from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

export function CollaborativeEditor() {
  const {
    activeDocument,
    updateDocumentContent,
    updateDocumentTitle,
    setView,
  } = useApp()

  const [showHistory, setShowHistory] = useState(false)
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [title, setTitle] = useState(activeDocument?.title ?? "")
  const [content, setContent] = useState(activeDocument?.content ?? "")
  const [shareLink, setShareLink] = useState("")
  const [copied, setCopied] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const titleInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (activeDocument) {
      setTitle(activeDocument.title)
      setContent(activeDocument.content)
    }
  }, [activeDocument])

  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus()
      titleInputRef.current.select()
    }
  }, [isEditingTitle])

  const handleContentChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newContent = e.target.value
      setContent(newContent)
      if (activeDocument) {
        updateDocumentContent(activeDocument.id, newContent)
      }
    },
    [activeDocument, updateDocumentContent]
  )

  const handleTitleSave = useCallback(() => {
    setIsEditingTitle(false)
    if (activeDocument && title.trim()) {
      updateDocumentTitle(activeDocument.id, title.trim())
    }
  }, [activeDocument, title, updateDocumentTitle])

  const handleCopyLink = useCallback(() => {
    setShareLink("https://collabo.app/doc/" + activeDocument?.id)
    navigator.clipboard.writeText(
      "https://collabo.app/doc/" + activeDocument?.id
    )
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [activeDocument?.id])

  if (!activeDocument) return null

  const onlineCollaborators = activeDocument.collaborators.filter(
    (c) => c.isOnline && c.id !== "1"
  )

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-border bg-card px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setView("dashboard")}
              className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              aria-label="Back to dashboard"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>

            {/* Editable title */}
            {isEditingTitle ? (
              <input
                ref={titleInputRef}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleTitleSave}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleTitleSave()
                  if (e.key === "Escape") {
                    setTitle(activeDocument.title)
                    setIsEditingTitle(false)
                  }
                }}
                className="text-base font-semibold text-foreground bg-transparent border-b-2 border-primary outline-none px-1 py-0.5"
              />
            ) : (
              <button
                onClick={() => setIsEditingTitle(true)}
                className="text-base font-semibold text-foreground hover:text-primary transition-colors text-left"
              >
                {activeDocument.title}
              </button>
            )}

            {/* Online indicator */}
            <div className="flex items-center gap-1.5 ml-2">
              <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
              <span className="text-xs text-muted-foreground hidden sm:inline">
                Online
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Active collaborators */}
            <TooltipProvider>
              <div className="flex -space-x-2 mr-2">
                {activeDocument.collaborators
                  .filter((c) => c.isOnline)
                  .map((collab) => (
                    <Tooltip key={collab.id}>
                      <TooltipTrigger asChild>
                        <div
                          className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-card text-xs font-medium text-primary-foreground cursor-default ring-2 ring-card"
                          style={{ backgroundColor: collab.color }}
                        >
                          {collab.avatar}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">{collab.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
              </div>
            </TooltipProvider>

            {/* History button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowHistory(!showHistory)}
              className="gap-2 hidden sm:flex"
            >
              <History className="h-4 w-4" />
              History
            </Button>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors sm:hidden"
              aria-label="Version history"
            >
              <History className="h-4 w-4" />
            </button>

            {/* Share button */}
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2">
                  <Share2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Share</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Share document</DialogTitle>
                  <DialogDescription>
                    Anyone with the link can view this document.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4 mt-4">
                  <div className="flex gap-2">
                    <Input
                      readOnly
                      value={shareLink || `https://collabo.app/doc/${activeDocument.id}`}
                      className="flex-1 text-sm"
                    />
                    <Button
                      onClick={handleCopyLink}
                      variant={copied ? "default" : "outline"}
                      size="sm"
                      className="shrink-0 gap-1.5"
                    >
                      {copied ? (
                        <>
                          <Check className="h-3.5 w-3.5" />
                          Copied
                        </>
                      ) : (
                        "Copy link"
                      )}
                    </Button>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-sm font-medium text-foreground">
                      Collaborators
                    </p>
                    {activeDocument.collaborators.map((collab) => (
                      <div
                        key={collab.id}
                        className="flex items-center gap-3 py-1.5"
                      >
                        <div
                          className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium text-primary-foreground"
                          style={{ backgroundColor: collab.color }}
                        >
                          {collab.avatar}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">
                            {collab.name}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div
                            className={`h-2 w-2 rounded-full ${
                              collab.isOnline
                                ? "bg-success"
                                : "bg-muted-foreground/30"
                            }`}
                          />
                          <span className="text-xs text-muted-foreground">
                            {collab.isOnline ? "Online" : "Offline"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </header>

        {/* Toolbar */}
        <EditorToolbar />

        {/* Editor Canvas */}
        <div className="relative flex-1 overflow-y-auto">
          <div className="relative mx-auto max-w-4xl px-6 py-8 lg:px-16 min-h-full">
            {/* Mock collaborator cursors */}
            {onlineCollaborators.map((collab) => (
              <CollaboratorCursor
                key={collab.id}
                name={collab.name}
                color={collab.color}
                containerRef={textareaRef}
              />
            ))}
            <textarea
              ref={textareaRef}
              value={content}
              onChange={handleContentChange}
              placeholder="Start typing..."
              className="w-full min-h-[calc(100vh-200px)] resize-none bg-transparent text-foreground text-base leading-relaxed outline-none placeholder:text-muted-foreground/50"
              aria-label="Document content"
            />
          </div>
        </div>
      </div>

      {/* Version History Sidebar */}
      {showHistory && (
        <VersionHistory
          versions={activeDocument.versions}
          onClose={() => setShowHistory(false)}
        />
      )}
    </div>
  )
}
