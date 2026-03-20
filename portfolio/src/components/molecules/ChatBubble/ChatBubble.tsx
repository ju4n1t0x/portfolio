import { cn } from "@/lib/utils"
import type { Message } from "@/types"
import { User, Bot, RefreshCw } from "lucide-react"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

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
                <div className="text-foreground/90 leading-relaxed">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      // Customize rendered elements
                      p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                      ul: ({ children }) => <ul className="list-disc list-inside space-y-1 mb-2">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 mb-2">{children}</ol>,
                      li: ({ children }) => <li>{children}</li>,
                      strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
                      em: ({ children }) => <em className="italic">{children}</em>,
                      a: ({ href, children }) => (
                        <a href={href} className="text-primary underline hover:text-primary/80" target="_blank" rel="noopener noreferrer">
                          {children}
                        </a>
                      ),
                      code: ({ children }) => (
                        <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">
                          {children}
                        </code>
                      ),
                      pre: ({ children }) => (
                        <pre className="bg-muted p-3 rounded-lg overflow-x-auto mb-2">
                          {children}
                        </pre>
                      ),
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
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
