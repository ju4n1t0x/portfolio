interface ContactEmailData {
  name: string
  email: string
  message: string
}

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000"

export async function sendContactEmail(data: ContactEmailData) {
  try {
    const response = await fetch(`${API_BASE_URL}/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error("Contact API error:", error)
      return { success: false, error }
    }

    const result = await response.json()
    return { success: true, data: result }
  } catch (error) {
    console.error("Error sending contact:", error)
    return { success: false, error }
  }
}
