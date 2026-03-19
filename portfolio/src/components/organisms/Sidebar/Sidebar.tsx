import { cn, simulateTypingDelay } from "@/lib/utils"
import { useChatStore, useThemeStore } from "@/store/chatStore"
import { aboutResponse } from "@/data/responses"
import { projects } from "@/data/projects"
import { experiences } from "@/data/experiences"
import { contactFlowIntro } from "@/data/contact"
import { ProjectCard } from "../../molecules/ProjectCard/ProjectCard"
import { ExperienceCard } from "../../molecules/ExperienceCard/ExperienceCard"
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

function sendProjectMessages(
  addMessage: ReturnType<typeof useChatStore.getState>["addMessage"],
  setTyping: ReturnType<typeof useChatStore.getState>["setTyping"]
) {
  // First send an intro message
  simulateTypingDelay(setTyping, () => {
    addMessage({
      role: "assistant",
      content: "Estos son algunos de mis proyectos destacados:",
      contentType: "text",
    })

    // Then send each project as a separate bubble with staggered delays
    projects.forEach((project, index) => {
      const delay = (index + 1) * 600
      window.setTimeout(() => {
        setTyping(true)
        window.setTimeout(() => {
          addMessage({
            role: "assistant",
            content: project.title,
            contentType: "project",
            richContent: <ProjectCard project={project} />,
          })
          setTyping(false)
        }, 700)
      }, delay)
    })
  })
}

function sendExperienceMessages(
  addMessage: ReturnType<typeof useChatStore.getState>["addMessage"],
  setTyping: ReturnType<typeof useChatStore.getState>["setTyping"]
) {
  simulateTypingDelay(setTyping, () => {
    addMessage({
      role: "assistant",
      content: "Esta es mi experiencia profesional:",
      contentType: "text",
    })

    experiences.forEach((experience, index) => {
      const delay = (index + 1) * 600
      window.setTimeout(() => {
        setTyping(true)
        window.setTimeout(() => {
          addMessage({
            role: "assistant",
            content: `${experience.role} en ${experience.company}`,
            contentType: "experience",
            richContent: <ExperienceCard experience={experience} />,
          })
          setTyping(false)
        }, 700)
      }, delay)
    })
  })
}

export function Sidebar() {
  const { sidebarOpen, toggleSidebar, addMessage, setTyping, startContactFlow, setCurrentSection } = useChatStore()
  const { theme, toggleTheme } = useThemeStore()

  const handleSectionClick = (sectionId: SidebarSectionId) => {
    // Update section state FIRST before any other action
    setCurrentSection(sectionId)
    
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
    <aside
      className={cn(
        "flex-shrink-0 h-screen flex flex-col transition-all duration-300 ease-in-out overflow-hidden",
        "bg-[hsl(var(--sidebar))] border-r border-[hsl(var(--sidebar-border))]",
        sidebarOpen ? "w-64" : "w-0"
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
  )
}
