import { useEffect } from "react"
import { HelmetProvider } from "react-helmet-async"
import { ChatInterface } from "./components/organisms/ChatInterface/ChatInterface"
import { Sidebar } from "./components/organisms/Sidebar/Sidebar"
import { useThemeStore } from "./store/chatStore"
import { tokenManager } from "./lib/auth/tokenManager"
import { SEO } from "./components/atoms"

function App() {
  const { theme } = useThemeStore()

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark")
  }, [theme])

  useEffect(() => {
    tokenManager.initialize()
  }, [])

  return (
    <HelmetProvider>
      <SEO />
      <div className="flex h-screen overflow-hidden bg-background">
        <Sidebar />
        <main role="main" className="flex-1 flex flex-col overflow-hidden">
          <ChatInterface />
        </main>
      </div>
    </HelmetProvider>
  );
}

export default App
