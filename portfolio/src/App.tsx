import { useEffect } from "react"
import { ChatInterface } from "./components/organisms/ChatInterface/ChatInterface"
import { Sidebar } from "./components/organisms/Sidebar/Sidebar"
import { useThemeStore } from "./store/chatStore"

function App() {
  const { theme } = useThemeStore()

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark")
  }, [theme])

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <ChatInterface />
    </div>
  )
}

export default App
