"use client"

import { cn } from "@/lib/utils"
import { FileText, Clock, Users, Archive, Plus, LogOut, Settings } from "lucide-react"
import { useApp } from "@/lib/app-context"
import { Button } from "@/components/ui/button"

type Filter = "recent" | "shared" | "archived"

export function DashboardSidebar({
  activeFilter,
  onFilterChange,
}: {
  activeFilter: Filter
  onFilterChange: (f: Filter) => void
}) {
  const { createDocument, setView, setIsAuthenticated, currentUser } = useApp()

  const navItems: { label: string; icon: React.ReactNode; filter: Filter }[] = [
    { label: "Recent", icon: <Clock className="h-4 w-4" />, filter: "recent" },
    { label: "Shared with me", icon: <Users className="h-4 w-4" />, filter: "shared" },
    { label: "Archived", icon: <Archive className="h-4 w-4" />, filter: "archived" },
  ]

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-border bg-sidebar">
     
      <div className="flex items-center gap-2 px-5 py-5 border-b border-border">
        <FileText className="h-6 w-6 text-primary" />
        <span className="text-lg font-semibold text-sidebar-foreground">Collabo</span>
      </div>

   
      <div className="px-3 pt-4 pb-2">
        <Button
          onClick={() => createDocument("Untitled Document")}
          className="w-full justify-start gap-2"
          size="sm"
        >
          <Plus className="h-4 w-4" />
          New Document
        </Button>
      </div>

   
      <nav className="flex flex-col gap-1 px-3 pt-2">
        {navItems.map((item) => (
          <button
            key={item.filter}
            onClick={() => onFilterChange(item.filter)}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              activeFilter === item.filter
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
            )}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>

    
      <div className="flex-1" />

 
      <div className="border-t border-border px-3 py-3 flex flex-col gap-1">
        <button className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors">
          <Settings className="h-4 w-4" />
          Settings
        </button>
        <button
          onClick={() => {
            setIsAuthenticated(false)
            setView("auth")
          }}
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
        <div className="flex items-center gap-3 px-3 py-2 mt-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
            {currentUser.avatar}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-sidebar-foreground">{currentUser.name}</span>
            <span className="text-xs text-muted-foreground">you@company.com</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
