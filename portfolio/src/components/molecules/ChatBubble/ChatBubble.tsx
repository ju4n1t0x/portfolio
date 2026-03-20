import { cn } from "@/lib/utils"
import type { Message } from "@/types"
import { User, Bot, RefreshCw } from "lucide-react"

interface ChatBubbleProps {
  message: Message
  onRetry?: () => void
}

export function ChatBubble({ message, onRetry }: ChatBubbleProps) {
  const isUser = message.role === "user"
  const hasRichContent = message.richContent !== undefined

  return (
    <div className="w-full flex justify-center px-6 py-4">
      <div
        className={cn(
          "w-full max-w-[95%] md:max-w-[60%] flex",
          isUser ? "justify-end" : "justify-start"
        )}
      >
        <div
          className={cn(
            "w-fit max-w-[85%] rounded-2xl border border-border/40 shadow-sm",
            isUser
              ? "bg-primary/10 text-foreground"
              : "bg-secondary/60 text-foreground"
          )}
        >
          <div className="flex gap-4 p-5">
            <div
              className={cn(
                "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm",
                isUser
                  ? "bg-primary text-primary-foreground"
                  : "bg-emerald-600 text-white"
              )}
            >
              {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div className="flex-1 min-w-0 text-left">
              <p className="font-semibold text-sm mb-1 text-foreground">
                {isUser ? "Tu" : "Juan Ignacio"}
              </p>
              {hasRichContent ? (
                <div className="text-foreground/90 leading-relaxed">
                  {message.richContent}
                </div>
              ) : (
                <div className="text-foreground/90 leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </div>
              )}
              {message.hasError && onRetry && (
                <button
                  onClick={onRetry}
                  className="mt-3 flex items-center gap-2 text-sm text-red-600 hover:text-red-700 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Reintentar
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
