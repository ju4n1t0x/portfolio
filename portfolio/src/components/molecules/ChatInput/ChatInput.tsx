import { useState, type FormEvent, useRef, useEffect } from "react"
import { ArrowUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChatInputProps {
  onSend: (message: string) => void
  disabled?: boolean
  disabledMessage?: string
}

export function ChatInput({ onSend, disabled, disabledMessage }: ChatInputProps) {
  const [message, setMessage] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const adjustHeight = () => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = "auto"
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`
    }
  }

  useEffect(() => {
    adjustHeight()
  }, [message])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (message.trim() && !disabled) {
      onSend(message.trim())
      setMessage("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const placeholder = disabled && disabledMessage 
    ? disabledMessage 
    : "Escribi un mensaje..."

  return (
    <div className="max-w-[95%] md:max-w-[60%] mx-auto w-full px-4 pb-4">
      <form
        onSubmit={handleSubmit}
        className="relative flex items-end gap-2 rounded-2xl border border-border bg-secondary/50 px-4 py-3 shadow-sm focus-within:border-foreground/20 transition-colors"
      >
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          aria-disabled={disabled}
          rows={1}
          className="flex-1 resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed max-h-[200px]"
        />
        <button
          type="submit"
          disabled={disabled || !message.trim()}
          className={cn(
            "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
            message.trim()
              ? "bg-foreground text-background hover:bg-foreground/90"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          )}
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      </form>
      <p className="text-xs text-muted-foreground text-center mt-2">
        Portfolio interactivo de Juan Ignacio. Preguntame lo que quieras.
      </p>
    </div>
  )
}
