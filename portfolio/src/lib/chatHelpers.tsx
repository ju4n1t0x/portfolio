import type { ChatState } from "@/types"
import { projects } from "@/data/projects"
import { experiences } from "@/data/experiences"
import { ProjectCard } from "@/components/molecules/ProjectCard/ProjectCard"
import { ExperienceCard } from "@/components/molecules/ExperienceCard/ExperienceCard"
import { simulateTypingDelay } from "./utils"

type AddMessage = ChatState["addMessage"]
type SetTyping = ChatState["setTyping"]

export function sendProjectMessages(addMessage: AddMessage, setTyping: SetTyping) {
  simulateTypingDelay(setTyping, () => {
    addMessage({
      role: "assistant",
      content: "Estos son algunos de mis proyectos destacados:",
      contentType: "text",
    })

    projects.forEach((project, index) => {
      const delay = (index + 1) * 600
      setTimeout(() => {
        setTyping(true)
        setTimeout(() => {
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

export function sendExperienceMessages(addMessage: AddMessage, setTyping: SetTyping) {
  simulateTypingDelay(setTyping, () => {
    addMessage({
      role: "assistant",
      content: "Esta es mi experiencia profesional:",
      contentType: "text",
    })

    experiences.forEach((experience, index) => {
      const delay = (index + 1) * 600
      setTimeout(() => {
        setTyping(true)
        setTimeout(() => {
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
