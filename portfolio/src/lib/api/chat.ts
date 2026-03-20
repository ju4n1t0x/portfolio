import type { SidebarSectionId } from "@/types"
import { tokenManager } from "@/lib/auth/tokenManager"

interface ChatRequest {
  message: string
  section?: SidebarSectionId | null
}

interface ChatResponse {
  response: string
}

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api"

export async function sendChatMessage(
  message: string,
  section?: SidebarSectionId | null
): Promise<ChatResponse> {
  const token = await tokenManager.getAccessToken()
  const body: ChatRequest = { message }
  
  // Only include section if it's a valid value (not null/undefined)
  if (section) {
    body.section = section
  }

  const response = await fetch(`${API_BASE_URL}/agentJuani`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    throw new Error(`Chat API error: ${response.status}`)
  }

  return response.json()
}

/**
 * Stream chat messages from /agentJuani endpoint.
 * Uses Server-Sent Events (SSE) streaming.
 * 
 * @param message - The user's message
 * @param onChunk - Callback invoked for each chunk of streamed content
 * @returns void when streaming completes
 * @throws Error if the request fails
 */
export async function streamChatMessage(
  message: string,
  onChunk: (content: string) => void
): Promise<void> {
  const token = await tokenManager.getAccessToken()
  
  const response = await fetch(`${API_BASE_URL}/agentJuani`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ message }),
  })

  if (!response.ok) {
    throw new Error(`Chat API error: ${response.status}`)
  }

  if (!response.body) {
    throw new Error("Response body is null")
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()

  try {
    while (true) {
      const { done, value } = await reader.read()
      
      if (done) break

      // stream: false ensures immediate delivery of each chunk
      const chunk = decoder.decode(value, { stream: false })
      
      // Parse SSE format: "data: {content}\n\n"
      // Each chunk may contain multiple SSE events
      const lines = chunk.split("\n")
      
      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const content = line.slice(6) // Remove "data: " prefix
          if (content && content !== "[DONE]") {
            onChunk(content)
          }
        }
      }
    }
  } finally {
    reader.releaseLock()
  }
}
