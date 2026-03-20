import type { Experience } from "@/types"

export const experiences: Experience[] = [
  {
    id: "1",
    company: "Globant",
    role: "Senior Full Stack Developer",
    period: { start: "2023", end: "Presente" },
    description:
      "Desarrollo de aplicaciones web a gran escala para clientes internacionales. Liderazgo técnico de un equipo de 5 desarrolladores, definición de arquitectura frontend y revisión de código. Implementación de CI/CD pipelines y mejora de performance con lazy loading y code splitting.",
    technologies: ["React", "TypeScript", "Node.js", "AWS", "Docker", "GraphQL"],
    companyUrl: "https://www.globant.com",
  },
  {
    id: "2",
    company: "MercadoLibre",
    role: "Full Stack Developer",
    period: { start: "2021", end: "2023" },
    description:
      "Desarrollo y mantenimiento de microservicios para el flujo de checkout y pagos. Integración con APIs de terceros y optimización de consultas a bases de datos. Participación activa en ceremonias ágiles y mentoring de desarrolladores junior.",
    technologies: ["React", "Java", "Spring Boot", "MySQL", "Redis", "Kafka"],
    companyUrl: "https://www.mercadolibre.com",
  },
  {
    id: "3",
    company: "Accenture",
    role: "Frontend Developer",
    period: { start: "2019", end: "2021" },
    description:
      "Desarrollo de interfaces de usuario para aplicaciones empresariales del sector bancario. Migración de aplicaciones legacy a React con TypeScript. Implementación de design systems y componentes reutilizables con Storybook.",
    technologies: ["React", "TypeScript", "Redux", "Sass", "Storybook", "Jest"],
    companyUrl: "https://www.accenture.com",
  },
  {
    id: "4",
    company: "Freelance",
    role: "Web Developer",
    period: { start: "2017", end: "2019" },
    description:
      "Desarrollo de sitios web y aplicaciones para pequeñas y medianas empresas. Diseño responsivo, integración con CMS y optimización SEO. Gestión directa con clientes, desde relevamiento de requerimientos hasta deploy en producción.",
    technologies: ["JavaScript", "HTML/CSS", "WordPress", "PHP", "Firebase"],
  },
]
