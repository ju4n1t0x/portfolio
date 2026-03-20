import type { ReactNode } from "react"

// --- Content type discriminator for rich chat messages ---
export type MessageContentType = "text" | "project" | "experience" | "contact"

export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  contentType?: MessageContentType
  richContent?: ReactNode
  timestamp: Date
  hasError?: boolean
}

// --- Project data model ---
export interface Project {
  id: string
  title: string
  description: string
  technologies: string[]
  repoUrl?: string
  projectUrl?: string
  images: (string | URL)[]
}

// --- Experience data model ---
export interface Experience {
  id: string
  company: string
  role: string
  period: {
    start: string
    end: string
  }
  description: string
  technologies: string[]
  companyUrl?: string
}

export type SidebarSectionId = "about" | "projects" | "experience" | "contact"

export interface SidebarSection {
  id: SidebarSectionId
  label: string
  icon: string
}

export interface SectionContent {
  id: SidebarSectionId
  content: string
}

export type ContactFlowStep = "name" | "email" | "message"

export interface ContactData {
  name?: string
  email?: string
  consulta?: string
}

export interface ChatState {
  messages: Message[]
  isTyping: boolean
  sidebarOpen: boolean
  contactFlowStep: ContactFlowStep | null
  contactData: ContactData
  currentSection: SidebarSectionId | null
  addMessage: (message: Omit<Message, "id" | "timestamp">) => void
  setTyping: (typing: boolean) => void
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  startContactFlow: () => void
  setContactFlowStep: (step: ContactFlowStep | null) => void
  setContactData: (data: ContactData) => void
  resetContactFlow: () => void
  clearMessages: () => void
  setCurrentSection: (section: SidebarSectionId | null) => void
  // Streaming message actions
  startStreamingMessage: (content: string) => string
  appendToStreamingMessage: (id: string, content: string) => void
  markMessageAsError: (id: string) => void
}

export interface ThemeState {
  theme: "light" | "dark"
  toggleTheme: () => void
  setTheme: (theme: "light" | "dark") => void
}
