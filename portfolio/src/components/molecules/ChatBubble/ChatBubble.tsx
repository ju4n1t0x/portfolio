import { cn } from "@/lib/utils"
import type { Message } from "@/types"
import { User, Bot } from "lucide-react"

interface ChatBubbleProps {
  message: Message
}

export function ChatBubble({ message }: ChatBubbleProps) {
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
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
