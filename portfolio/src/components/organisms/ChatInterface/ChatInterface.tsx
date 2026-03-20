import { useRef, useEffect, useState, useCallback } from "react"
import { useChatStore } from "@/store/chatStore"
import { ChatBubble } from "../../molecules/ChatBubble/ChatBubble"
import { ChatInput } from "../../molecules/ChatInput/ChatInput"
import { PanelLeft, Mail } from "lucide-react"
import {
  contactSchema,
  emailSchema,
  messageSchema,
  nameSchema,
} from "@/lib/contactValidation"
import { sendContactEmail } from "@/lib/api/contact"
import { streamChatMessage } from "@/lib/api/chat"
import {
  contactAskEmail,
  contactAskMessage,
  contactFlowIntro,
  contactSuccessMessage,
  contactSendErrorMessage,
} from "@/data/contact"
import { sendProjectMessages, sendExperienceMessages } from "@/lib/chatHelpers"
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
        <a 
          href="mailto:contacto@juansasia.com"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <Mail className="w-4 h-4" />
          contacto@juansasia.com
        </a>
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
    setCurrentSection,
    startStreamingMessage,
    appendToStreamingMessage,
    markMessageAsError,
  } = useChatStore()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  // Track last user message for retry functionality
  const [lastUserMessage, setLastUserMessage] = useState<string>("")

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Stream message to backend
  const sendStreamingMessage = useCallback(
    (message: string) => {
      setTyping(true)
      const messageId = startStreamingMessage("")

      streamChatMessage(message, (chunk) => {
        appendToStreamingMessage(messageId, chunk)
      })
        .catch((error: Error) => {
          console.error("Chat API error:", error)
          markMessageAsError(messageId)
          // Show user-friendly error message
          const errorMsg = error.message.includes("Failed to fetch") || error.message.includes("net::")
            ? "\n\nNo pude conectar con el servidor. Verificá que esté corriendo e intentá de nuevo."
            : "\n\nOcurrió un error. Por favor, intentá de nuevo."
          appendToStreamingMessage(messageId, errorMsg)
        })
        .finally(() => {
          setTyping(false)
        })
    },
    [setTyping, startStreamingMessage, appendToStreamingMessage, markMessageAsError]
  )

  const handleSend = (input: string) => {
    addMessage({ role: "user", content: input })

    if (contactFlowStep !== null && currentSection === "contact") {
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
            setContactData({ consulta: result.data })
            const finalData = {
              name: contactData.name ?? "",
              email: contactData.email ?? "",
              consulta: result.data,
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
      if (contactFlowStep !== null && currentSection !== "contact") {
        resetContactFlow()
      }
      // Regular AI chat with streaming
      setLastUserMessage(input) // Save for retry
      sendStreamingMessage(input)
    }
  }

  // Retry last failed message
  const handleRetry = () => {
    if (lastUserMessage) {
      sendStreamingMessage(lastUserMessage)
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
      setCurrentSection("contact")
      startContactFlow()
    })
  }

  return (
    <div className="flex flex-col h-screen w-full relative">
      {/* Top bar */}
      <div className="h-14 flex items-center px-4 border-b border-border/50 flex-shrink-0">
        {!sidebarOpen && (
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-secondary text-muted-foreground transition-colors mr-2"
            aria-label="Abrir sidebar"
            aria-expanded={sidebarOpen}
          >
            <PanelLeft className="w-5 h-5" />
          </button>
        )}
        <a 
          className="text-sm font-medium text-foreground"
          href="https://juanignaciosasia.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Juan Ignacio Sasia
        </a>
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
                <ChatBubble 
                  message={message} 
                  onRetry={message.hasError ? handleRetry : undefined} 
                />
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
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-muted-foreground">Escribiendo...</span>
                      <div className="flex gap-1 items-center">
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
        disabled={isTyping}
      />
    </div>
  )
}
