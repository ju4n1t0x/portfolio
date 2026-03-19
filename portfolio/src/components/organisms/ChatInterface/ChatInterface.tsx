import { useRef, useEffect } from "react"
import { useChatStore } from "@/store/chatStore"
import { ChatBubble } from "../../molecules/ChatBubble/ChatBubble"
import { ChatInput } from "../../molecules/ChatInput/ChatInput"
import { ProjectCard } from "../../molecules/ProjectCard/ProjectCard"
import { ExperienceCard } from "../../molecules/ExperienceCard/ExperienceCard"
import { PanelLeft } from "lucide-react"
import {
  contactSchema,
  emailSchema,
  messageSchema,
  nameSchema,
} from "@/lib/contactValidation"
import { sendContactEmail } from "@/lib/api/contact"
import { sendChatMessage } from "@/lib/api/chat"
import { projects } from "@/data/projects"
import { experiences } from "@/data/experiences"
import {
  contactAskEmail,
  contactAskMessage,
  contactFlowIntro,
  contactSuccessMessage,
  contactSendErrorMessage,
} from "@/data/contact"
import { simulateTypingDelay } from "@/lib/utils"
import heroAvatar from "@/assets/avatar-4.png"

interface WelcomeScreenProps {
  onProjects: () => void
  onExperience: () => void
  onContact: () => void
  avatarSrc?: string
  avatarAlt?: string
}

function WelcomeScreen({
  onProjects,
  onExperience,
  onContact,
  avatarSrc,
  avatarAlt,
}: WelcomeScreenProps) {
  const suggestions = [
    { label: "Te cuento sobre mis proyectos", onClick: onProjects },
    { label: "Quieres saber cual es mi experiencia?", onClick: onExperience },
    { label: "Como me contactas?", onClick: onContact },
  ]
  const resolvedAvatarSrc = avatarSrc ?? heroAvatar
  const resolvedAvatarAlt = avatarAlt ?? "Juan Ignacio"

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center max-w-lg space-y-4">
        <div className="w-16 h-16 sm:w-[150px] sm:h-[150px] rounded-full overflow-hidden mx-auto shadow-sm">
          <img
            src={resolvedAvatarSrc}
            alt={resolvedAvatarAlt}
            className="w-full h-full object-cover"
          />
        </div>
        <h1 className="text-3xl font-semibold text-foreground tracking-tight">
          Hola, soy Juan Ignacio
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Desarrollador Full Stack. Te invito a chatear conmigo y conocerme.
        </p>
        <div className="flex flex-wrap justify-center gap-2 pt-4">
          {suggestions.map((suggestion) => (
              <button
                key={suggestion.label}
                onClick={suggestion.onClick}
                className="neon-suggestion px-4 py-2 rounded-xl border border-border text-sm text-foreground/80 hover:bg-secondary/80 transition-colors"
              >
                {suggestion.label}
              </button>
            ))}
        </div>
      </div>
    </div>
  )
}

function sendProjectMessages(
  addMessage: ReturnType<typeof useChatStore.getState>["addMessage"],
  setTyping: ReturnType<typeof useChatStore.getState>["setTyping"]
) {
  simulateTypingDelay(setTyping, () => {
    addMessage({
      role: "assistant",
      content: "Estos son algunos de mis proyectos destacados:",
      contentType: "text",
    })

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

export function ChatInterface() {
  const {
    messages,
    addMessage,
    isTyping,
    sidebarOpen,
    toggleSidebar,
    setTyping,
    contactFlowStep,
    contactData,
    setContactFlowStep,
    setContactData,
    resetContactFlow,
    startContactFlow,
    currentSection,
  } = useChatStore()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = (input: string) => {
    addMessage({ role: "user", content: input })

    if (contactFlowStep !== null) {
      switch (contactFlowStep) {
        case "name": {
          const result = nameSchema.safeParse(input)
          if (result.success) {
            setContactData({ name: result.data })
            simulateTypingDelay(setTyping, () => {
              addMessage({
                role: "assistant",
                content: contactAskEmail(result.data),
                contentType: "contact",
              })
              setContactFlowStep("email")
            })
          } else {
            simulateTypingDelay(setTyping, () => {
              addMessage({
                role: "assistant",
                content: result.error.issues[0]?.message ?? "El nombre es inválido.",
                contentType: "contact",
              })
            })
          }
          break
        }

        case "email": {
          const result = emailSchema.safeParse(input)
          if (result.success) {
            setContactData({ email: result.data })
            simulateTypingDelay(setTyping, () => {
              addMessage({
                role: "assistant",
                content: contactAskMessage,
                contentType: "contact",
              })
              setContactFlowStep("message")
            })
          } else {
            simulateTypingDelay(setTyping, () => {
              addMessage({
                role: "assistant",
                content: result.error.issues[0]?.message ?? "El email es inválido.",
                contentType: "contact",
              })
            })
          }
          break
        }

        case "message": {
          const result = messageSchema.safeParse(input)
          if (result.success) {
            const finalData = {
              name: contactData.name ?? "",
              email: contactData.email ?? "",
              message: result.data,
            }
            const finalParse = contactSchema.safeParse(finalData)
            if (!finalParse.success) {
              simulateTypingDelay(setTyping, () => {
                addMessage({
                  role: "assistant",
                  content: finalParse.error.issues[0]?.message ?? "Hay campos inválidos.",
                  contentType: "contact",
                })
              })
              break
            }
            setTyping(true)
            sendContactEmail(finalParse.data)
              .then((emailResult) => {
                if (emailResult.success) {
                  addMessage({
                    role: "assistant",
                    content: contactSuccessMessage,
                    contentType: "contact",
                  })
                } else {
                  addMessage({
                    role: "assistant",
                    content: contactSendErrorMessage,
                    contentType: "contact",
                  })
                }
              })
              .catch(() => {
                addMessage({
                  role: "assistant",
                  content: contactSendErrorMessage,
                  contentType: "contact",
                })
              })
              .finally(() => {
                setTyping(false)
                resetContactFlow()
              })
          } else {
            simulateTypingDelay(setTyping, () => {
              addMessage({
                role: "assistant",
                content: result.error.issues[0]?.message ?? "El mensaje es inválido.",
                contentType: "contact",
              })
            })
          }
          break
        }
      }
    } else {
      // Regular AI chat with section context
      setTyping(true)
      sendChatMessage(input, currentSection)
        .then((response) => {
          addMessage({
            role: "assistant",
            content: response.response,
          })
        })
        .catch((error) => {
          console.error("Chat API error:", error)
          addMessage({
            role: "assistant",
            content: "Lo siento, hubo un error al procesar tu mensaje. Por favor, intentá de nuevo.",
          })
        })
        .finally(() => {
          setTyping(false)
        })
    }
  }

  const hasMessages = messages.length > 0
  const handleProjectsSuggestion = () => sendProjectMessages(addMessage, setTyping)
  const handleExperienceSuggestion = () =>
    sendExperienceMessages(addMessage, setTyping)
  const handleContactSuggestion = () => {
    simulateTypingDelay(setTyping, () => {
      addMessage({
        role: "assistant",
        content: contactFlowIntro,
        contentType: "contact",
      })
      startContactFlow()
    })
  }

  return (
    <div className="flex flex-col h-screen w-full">
      {/* Top bar */}
      <div className="h-14 flex items-center px-4 border-b border-border/50 flex-shrink-0">
        {!sidebarOpen && (
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-secondary text-muted-foreground transition-colors mr-2"
            aria-label="Abrir sidebar"
          >
            <PanelLeft className="w-5 h-5" />
          </button>
        )}
        <span className="text-sm font-medium text-foreground">
          Juan Ignacio Sasia
        </span>
      </div>

      {/* Chat area */}
      {hasMessages ? (
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {messages.map((message, index) => {
            const previous = messages[index - 1]
            const showDivider = Boolean(previous && previous.role !== message.role)

            return (
              <div key={message.id}>
                {showDivider && (
                  <div className="w-full flex justify-center">
                    <div className="w-full max-w-[95%] md:max-w-[60%] px-6">
                      <div className="h-px bg-border/60" />
                    </div>
                  </div>
                )}
                <ChatBubble message={message} />
              </div>
            )
          })}
          {isTyping && (
            <div className="w-full flex justify-center px-6 py-4">
              <div className="w-full max-w-[95%] md:max-w-[60%] flex justify-start">
                <div className="w-fit max-w-[85%] rounded-2xl border border-border/40 bg-secondary/60 shadow-sm">
                  <div className="flex flex-row gap-4 p-5">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                      <span className="text-xs font-semibold">JI</span>
                    </div>
                    <div className="flex gap-1 items-center pt-2">
                      <span
                        className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      />
                      <span
                        className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      />
                      <span
                        className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      ) : (
        <WelcomeScreen
          onProjects={handleProjectsSuggestion}
          onExperience={handleExperienceSuggestion}
          onContact={handleContactSuggestion}
          avatarSrc={heroAvatar}
        />
      )}

      {/* Input */}
      <ChatInput 
        onSend={handleSend} 
        disabled={isTyping || currentSection === "contact"} 
        disabledMessage={currentSection === "contact" ? "Chat deshabilitado en la sección Contacto" : undefined}
      />
    </div>
  )
}
