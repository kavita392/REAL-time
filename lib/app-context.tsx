"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

export type Document = {
  id: string
  title: string
  content: string
  lastEdited: Date
  collaborators: Collaborator[]
  archived: boolean
  sharedWithMe: boolean
  versions: Version[]
}

export type Collaborator = {
  id: string
  name: string
  avatar: string
  color: string
  isOnline: boolean
}

export type Version = {
  id: string
  timestamp: Date
  author: string
  changes: { type: "added" | "removed"; text: string }[]
  content: string
}

type View = "auth" | "dashboard" | "editor"

type AppContextType = {
  view: View
  setView: (view: View) => void
  documents: Document[]
  activeDocument: Document | null
  setActiveDocument: (doc: Document | null) => void
  createDocument: (title: string) => void
  updateDocumentContent: (id: string, content: string) => void
  updateDocumentTitle: (id: string, title: string) => void
  isAuthenticated: boolean
  setIsAuthenticated: (auth: boolean) => void
  currentUser: Collaborator
}

const COLLABORATORS: Collaborator[] = [
  { id: "1", name: "You", avatar: "Y", color: "#4B6BFB", isOnline: true },
  { id: "2", name: "Sarah Chen", avatar: "SC", color: "#F59E0B", isOnline: true },
  { id: "3", name: "Alex Rivera", avatar: "AR", color: "#10B981", isOnline: true },
  { id: "4", name: "Maya Patel", avatar: "MP", color: "#EF4444", isOnline: false },
  { id: "5", name: "James Lee", avatar: "JL", color: "#8B5CF6", isOnline: false },
]

const INITIAL_DOCUMENTS: Document[] = [
  {
    id: "1",
    title: "Q1 Product Roadmap",
    content: "Our Q1 roadmap focuses on three key areas:\n\n1. Platform Performance\nWe will optimize our core infrastructure to reduce latency by 40%. This includes migrating our database layer and implementing edge caching.\n\n2. User Experience\nThe new dashboard redesign will roll out in phases, starting with the navigation overhaul and followed by the analytics views.\n\n3. API Improvements\nOur public API will receive rate limiting enhancements and new webhook capabilities for real-time event processing.",
    lastEdited: new Date(Date.now() - 1000 * 60 * 30),
    collaborators: [COLLABORATORS[0], COLLABORATORS[1], COLLABORATORS[2]],
    archived: false,
    sharedWithMe: false,
    versions: [
      {
        id: "v1",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
        author: "Sarah Chen",
        changes: [
          { type: "added", text: "Added API improvements section" },
          { type: "removed", text: "Removed outdated timeline" },
        ],
        content: "Our Q1 roadmap focuses on two key areas...",
      },
      {
        id: "v2",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
        author: "Alex Rivera",
        changes: [
          { type: "added", text: "Updated latency targets to 40%" },
        ],
        content: "Our Q1 roadmap focuses on three key areas...",
      },
    ],
  },
  {
    id: "2",
    title: "Design System Guidelines",
    content: "This document outlines our design system principles and component library standards.\n\nColor Palette\nPrimary: Blue (#4B6BFB)\nSecondary: Slate tones\nAccent: Amber for warnings\n\nTypography\nHeadings: Inter Semi-Bold\nBody: Inter Regular, 16px base\nCode: JetBrains Mono",
    lastEdited: new Date(Date.now() - 1000 * 60 * 60 * 2),
    collaborators: [COLLABORATORS[0], COLLABORATORS[3]],
    archived: false,
    sharedWithMe: false,
    versions: [
      {
        id: "v3",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
        author: "Maya Patel",
        changes: [
          { type: "added", text: "Added typography section" },
        ],
        content: "This document outlines our design system...",
      },
    ],
  },
  {
    id: "3",
    title: "Meeting Notes - Feb 14",
    content: "Attendees: Sarah, Alex, Maya, James\n\nAgenda:\n- Sprint retrospective\n- Feature prioritization\n- Resource allocation for Q2\n\nKey Decisions:\n1. Move to bi-weekly releases\n2. Hire two more frontend engineers\n3. Sunset legacy dashboard by March 30",
    lastEdited: new Date(Date.now() - 1000 * 60 * 60 * 5),
    collaborators: [COLLABORATORS[1], COLLABORATORS[2], COLLABORATORS[3], COLLABORATORS[4]],
    archived: false,
    sharedWithMe: true,
    versions: [],
  },
  {
    id: "4",
    title: "API Documentation v2",
    content: "REST API Reference\n\nAuthentication\nAll requests must include a Bearer token in the Authorization header.\n\nEndpoints:\nGET /api/documents - List all documents\nPOST /api/documents - Create a new document\nPUT /api/documents/:id - Update a document\nDELETE /api/documents/:id - Delete a document",
    lastEdited: new Date(Date.now() - 1000 * 60 * 60 * 24),
    collaborators: [COLLABORATORS[0], COLLABORATORS[4]],
    archived: false,
    sharedWithMe: true,
    versions: [],
  },
  {
    id: "5",
    title: "Old Brand Guidelines",
    content: "This document contains our previous brand guidelines that are no longer in active use.",
    lastEdited: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
    collaborators: [COLLABORATORS[0]],
    archived: true,
    sharedWithMe: false,
    versions: [],
  },
  {
    id: "6",
    title: "Sprint Planning Template",
    content: "Sprint Goal:\n[Define the main objective]\n\nUser Stories:\n- As a user, I want to...\n- As an admin, I want to...\n\nCapacity:\nTeam availability and velocity estimates.",
    lastEdited: new Date(Date.now() - 1000 * 60 * 60 * 8),
    collaborators: [COLLABORATORS[0], COLLABORATORS[1], COLLABORATORS[2]],
    archived: false,
    sharedWithMe: false,
    versions: [],
  },
]

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<View>("auth")
  const [documents, setDocuments] = useState<Document[]>(INITIAL_DOCUMENTS)
  const [activeDocument, setActiveDocument] = useState<Document | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const createDocument = useCallback((title: string) => {
    const newDoc: Document = {
      id: Date.now().toString(),
      title,
      content: "",
      lastEdited: new Date(),
      collaborators: [COLLABORATORS[0]],
      archived: false,
      sharedWithMe: false,
      versions: [],
    }
    setDocuments((prev) => [newDoc, ...prev])
    setActiveDocument(newDoc)
    setView("editor")
  }, [])

  const updateDocumentContent = useCallback((id: string, content: string) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === id ? { ...doc, content, lastEdited: new Date() } : doc
      )
    )
    setActiveDocument((prev) =>
      prev?.id === id ? { ...prev, content, lastEdited: new Date() } : prev
    )
  }, [])

  const updateDocumentTitle = useCallback((id: string, title: string) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === id ? { ...doc, title, lastEdited: new Date() } : doc
      )
    )
    setActiveDocument((prev) =>
      prev?.id === id ? { ...prev, title, lastEdited: new Date() } : prev
    )
  }, [])

  return (
    <AppContext.Provider
      value={{
        view,
        setView,
        documents,
        activeDocument,
        setActiveDocument,
        createDocument,
        updateDocumentContent,
        updateDocumentTitle,
        isAuthenticated,
        setIsAuthenticated,
        currentUser: COLLABORATORS[0],
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error("useApp must be used within AppProvider")
  return context
}
