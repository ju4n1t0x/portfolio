import { useEffect, useRef } from "react"
import { cn, simulateTypingDelay } from "@/lib/utils"
import { useChatStore, useThemeStore } from "@/store/chatStore"
import { useIsDesktop } from "@/hooks/useMediaQuery"
import { aboutResponse } from "@/data/responses"
import { contactFlowIntro } from "@/data/contact"
import { sendProjectMessages, sendExperienceMessages } from "@/lib/chatHelpers"
import type { SidebarSectionId } from "@/types"
import {
  MessageSquare,
  Briefcase,
  Code2,
  Mail,
  Sun,
  Moon,
  PanelLeftClose,
  Plus,
  Github,
  Linkedin,
} from "lucide-react"

interface SidebarItem {
  id: SidebarSectionId
  label: string
  icon: React.ReactNode
}

const sections: SidebarItem[] = [
  { id: "about", label: "Sobre mi", icon: <MessageSquare className="w-4 h-4" /> },
  { id: "projects", label: "Proyectos", icon: <Code2 className="w-4 h-4" /> },
  { id: "experience", label: "Experiencia", icon: <Briefcase className="w-4 h-4" /> },
  { id: "contact", label: "Contacto", icon: <Mail className="w-4 h-4" /> },
]

export function Sidebar() {
  const { sidebarOpen, toggleSidebar, setSidebarOpen, addMessage, setTyping, startContactFlow, setCurrentSection } = useChatStore()
  const { theme, toggleTheme } = useThemeStore()
  const isDesktop = useIsDesktop("md")
  
  // Track if we've passed initial mount
  const isInitialMount = useRef(true)
  
  // Close sidebar on mobile (either initial or after resize)
  useEffect(() => {
    // On initial mount with mobile viewport, close sidebar
    if (isInitialMount.current) {
      isInitialMount.current = false
      if (!isDesktop && sidebarOpen) {
        setSidebarOpen(false)
      }
      return
    }
    
    // On resize from desktop to mobile, close sidebar
    if (!isDesktop && sidebarOpen) {
      setSidebarOpen(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDesktop])

  // Handle escape key to close sidebar on mobile
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && sidebarOpen && !isDesktop) {
        setSidebarOpen(false)
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [sidebarOpen, isDesktop, setSidebarOpen])

  // Handle backdrop click
  const handleBackdropClick = () => {
    setSidebarOpen(false)
  }

  const handleSectionClick = (sectionId: SidebarSectionId) => {
    // Update section state FIRST before any other action
    setCurrentSection(sectionId)

    // Auto-close sidebar on mobile after navigation
    if (!isDesktop) {
      setSidebarOpen(false)
    }
    
    switch (sectionId) {
      case "about":
        simulateTypingDelay(setTyping, () => {
          addMessage({ role: "assistant", content: aboutResponse })
        })
        break
      case "projects":
        sendProjectMessages(addMessage, setTyping)
        break
      case "experience":
        sendExperienceMessages(addMessage, setTyping)
        break
      case "contact":
        simulateTypingDelay(setTyping, () => {
          addMessage({
            role: "assistant",
            content: contactFlowIntro,
            contentType: "contact",
          })
          startContactFlow()
        })
        break
      default:
        break
    }
  }

  return (
    <>
      {/* Backdrop - only on mobile when open */}
      {!isDesktop && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={handleBackdropClick}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "flex-shrink-0 h-screen flex flex-col overflow-hidden",
          "bg-[hsl(var(--sidebar))] border-r border-[hsl(var(--sidebar-border))]",
          isDesktop
            ? cn(
                "relative transition-all duration-300 ease-in-out",
                sidebarOpen ? "w-64" : "w-0"
              )
            : cn(
                "fixed inset-y-0 left-0 z-50 w-64",
                "transition-transform duration-300 ease-in-out",
                sidebarOpen ? "translate-x-0 pointer-events-auto" : "-translate-x-full pointer-events-none"
              )
        )}
      >
      <div className="flex items-center justify-between p-3 h-14">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-[hsl(var(--sidebar-hover))] text-[hsl(var(--sidebar-foreground))] transition-colors"
          aria-label="Cerrar sidebar"
        >
          <PanelLeftClose className="w-5 h-5" />
        </button>
        <button
          className="p-2 rounded-lg hover:bg-[hsl(var(--sidebar-hover))] text-[hsl(var(--sidebar-foreground))] transition-colors"
          aria-label="Nueva conversacion"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 px-2 py-2 space-y-1 overflow-y-auto scrollbar-thin">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => handleSectionClick(section.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left transition-colors",
              "text-[hsl(var(--sidebar-foreground))] hover:bg-[hsl(var(--sidebar-hover))]"
            )}
          >
            {section.icon}
            <span className="truncate">{section.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-2 border-t border-[hsl(var(--sidebar-border))] space-y-1">
        <div className="flex items-center gap-1 px-1">
          <a
            href="https://github.com/ju4n1t0x/ju4n1t0x"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg hover:bg-[hsl(var(--sidebar-hover))] text-[hsl(var(--sidebar-foreground))] transition-colors"
            aria-label="GitHub"
          >
            <Github className="w-4 h-4" />
          </a>
          <a
            href="https://www.linkedin.com/in/juan-ignacio-sasia/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg hover:bg-[hsl(var(--sidebar-hover))] text-[hsl(var(--sidebar-foreground))] transition-colors"
            aria-label="LinkedIn"
          >
            <Linkedin className="w-4 h-4" />
          </a>
          <div className="flex-1" />
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-[hsl(var(--sidebar-hover))] text-[hsl(var(--sidebar-foreground))] transition-colors"
            aria-label={theme === "dark" ? "Modo claro" : "Modo oscuro"}
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </aside>
    </>
  )
}
