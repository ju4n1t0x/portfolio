import type { Project } from "@/types"

export const projects: Project[] = [
  {
    id: "1",
    title: "E-commerce Platform",
    description:
      "Plataforma de comercio electrónico full stack con carrito de compras, pasarela de pagos integrada y panel de administración. Arquitectura basada en microservicios con autenticación JWT y manejo de inventario en tiempo real.",
    technologies: ["React", "Node.js", "PostgreSQL", "Stripe", "Docker"],
    repoUrl: "https://github.com/juanignacio/ecommerce-platform",
    projectUrl: "https://ecommerce-demo.vercel.app",
    images: [
      "https://placehold.co/600x340/1a1a2e/e0e0e0?text=E-commerce+Home",
      "https://placehold.co/600x340/1a1a2e/e0e0e0?text=E-commerce+Dashboard",
    ],
  },
  {
    id: "2",
    title: "Task Manager",
    description:
      "Aplicación de gestión de tareas con colaboración en tiempo real, tableros Kanban y notificaciones push. Incluye sistema de roles, etiquetas personalizables y reportes de productividad.",
    technologies: ["TypeScript", "Next.js", "Firebase", "Tailwind CSS"],
    repoUrl: "https://github.com/juanignacio/task-manager",
    images: [
      "https://placehold.co/600x340/16213e/e0e0e0?text=Task+Manager+Board",
      "https://placehold.co/600x340/16213e/e0e0e0?text=Task+Manager+Reports",
    ],
  },
  {
    id: "3",
    title: "Weather Dashboard",
    description:
      "Dashboard meteorológico interactivo con visualización de datos en tiempo real, pronósticos a 7 días y mapas de calor. Integración con múltiples APIs de clima y geolocalización automática.",
    technologies: ["React", "TypeScript", "D3.js", "OpenWeather API", "Mapbox"],
    repoUrl: "https://github.com/juanignacio/weather-dashboard",
    projectUrl: "https://weather-dash-demo.vercel.app",
    images: [
      "https://placehold.co/600x340/0f3460/e0e0e0?text=Weather+Dashboard",
    ],
  },
  {
    id: "4",
    title: "Portfolio Chat",
    description:
      "Este mismo portfolio — una interfaz conversacional estilo ChatGPT para presentar mi perfil profesional. Diseño responsivo con modo oscuro, simulación de typing y navegación por secciones.",
    technologies: ["React", "TypeScript", "Tailwind CSS", "Zustand", "Vite"],
    repoUrl: "https://github.com/juanignacio/portfolio",
    projectUrl: "https://juanignacio.dev",
    images: [
      "https://placehold.co/600x340/1a1a2e/e0e0e0?text=Portfolio+Chat",
    ],
  },
]
