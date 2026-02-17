"use client"

import { useState } from "react"
import { useApp } from "@/lib/app-context"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DocumentCard } from "@/components/document-card"
import { Input } from "@/components/ui/input"
import { Search, Menu, X, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

type Filter = "recent" | "shared" | "archived"

export function Dashboard() {
  const { documents, createDocument } = useApp()
  const [activeFilter, setActiveFilter] = useState<Filter>("recent")
  const [searchQuery, setSearchQuery] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase())

    switch (activeFilter) {
      case "recent":
        return matchesSearch && !doc.archived
      case "shared":
        return matchesSearch && doc.sharedWithMe && !doc.archived
      case "archived":
        return matchesSearch && doc.archived
      default:
        return matchesSearch
    }
  })

  const filterLabels: Record<Filter, string> = {
    recent: "Recent Documents",
    shared: "Shared with Me",
    archived: "Archived",
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
    
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

    
      <div
        className={`fixed inset-y-0 left-0 z-50 transform transition-transform lg:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <DashboardSidebar
          activeFilter={activeFilter}
          onFilterChange={(f) => {
            setActiveFilter(f)
            setSidebarOpen(false)
          }}
        />
      </div>

   
      <div className="hidden lg:block">
        <DashboardSidebar
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
      </div>

    
      <main className="flex flex-1 flex-col overflow-hidden">
      
        <header className="flex items-center gap-4 border-b border-border px-6 py-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-muted-foreground hover:text-foreground"
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9"
            />
          </div>

          <Button
            size="sm"
            className="ml-auto lg:hidden gap-2"
            onClick={() => createDocument("Untitled Document")}
          >
            <Plus className="h-4 w-4" />
            <span className="sr-only sm:not-sr-only">New</span>
          </Button>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-semibold text-foreground">
              {filterLabels[activeFilter]}
            </h1>
            <span className="text-sm text-muted-foreground">
              {filteredDocuments.length} document{filteredDocuments.length !== 1 ? "s" : ""}
            </span>
          </div>

          {filteredDocuments.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filteredDocuments.map((doc) => (
                <DocumentCard key={doc.id} document={doc} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
                <Search className="h-7 w-7 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground">No documents found</h3>
              <p className="mt-1 text-sm text-muted-foreground max-w-sm">
                {searchQuery
                  ? `No documents match "${searchQuery}"`
                  : "Create a new document to get started"}
              </p>
              {!searchQuery && (
                <Button
                  className="mt-4 gap-2"
                  onClick={() => createDocument("Untitled Document")}
                >
                  <Plus className="h-4 w-4" />
                  Create Document
                </Button>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
