import type { Experience } from "@/types"

export const experiences: Experience[] = [
  {
    id: "1",
    company: "Xinergia",
    role: "Backend Developer",
    period: { start: "2025", end: "Presente" },
    description:
      "Desarrollo y mantenimiento de APIs REST y servicios backend para plataforma e-learning. Integración con servicios externos: CRMs, ERPs y pasarelas de pago. Modelado y optimización de bases de datos relacionales (PostgreSQL, MySQL). Implementación de pipelines CI/CD y enfoque API-first. Arquitectura por capas con separación Controllers/Services y principios SOLID.",
    technologies: ["Laravel 12", "PHP 8.3", "PostgreSQL", "MySQL", "REST API", "CI/CD", "SOLID"],
    companyUrl: "https://www.xinergia.com",
  },
  {
    id: "2",
    company: "SteelMat",
    role: "Web Developer",
    period: { start: "04/2025", end: "10/2025" },
    description:
      "Desarrollo integral de sitio web corporativo para empresa de construcción en seco. Implementación de emails transaccionales con Resend, migración de hosting, configuración de dominio y DNS en Vercel, y optimización SEO para posicionamiento local.",
    technologies: ["Astro", "TypeScript", "Resend", "Tailwind CSS"],
    companyUrl: "https://www.steelmat.com.ar",
  },
  {
    id: "3",
    company: "UTN - Facultad Regional Santa Fe",
    role: "Tutor Académico",
    period: { start: "2025", end: "Presente" },
    description:
      "Tutor en la Tecnicatura Universitaria en Tecnologías de la Información. Acompañamiento académico a estudiantes en las asignaturas Diseño de Sistemas de Información y Desarrollo de Sitios Web. Apoyo en resolución de trabajos prácticos, refuerzo de conceptos teóricos y mentoría en buenas prácticas de desarrollo.",
    technologies: ["UML", "Diagramas de flujo", "HTML", "CSS", "JavaScript"],
    companyUrl: "https://www.frsf.utn.edu.ar",
  },
]
