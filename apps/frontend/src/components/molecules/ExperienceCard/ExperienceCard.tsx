import type { Experience } from "@/types"
import { ExternalLink, Calendar } from "lucide-react"

interface ExperienceCardProps {
  experience: Experience
}

export function ExperienceCard({ experience }: ExperienceCardProps) {
  return (
    <article className="space-y-3 p-4 rounded-2xl bg-card border border-border/40 shadow-[0_1px_2px_rgba(0,0,0,0.3),0_8px_24px_-12px_rgba(0,0,0,0.5)] hover:-translate-y-0.5 hover:shadow-[0_2px_4px_rgba(0,0,0,0.4),0_12px_32px_-8px_rgba(0,0,0,0.6)] transition-all duration-200" aria-label={`Experiencia: ${experience.role} en ${experience.company}`}>
      {/* Title — company & role */}
      <div>
        <h3 className="text-lg font-semibold text-foreground">
          {experience.role}
        </h3>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-sm font-medium text-foreground/70">
            {experience.company}
          </span>
          <span className="text-muted-foreground/50">·</span>
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            {experience.period.start} – {experience.period.end}
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="text-muted-foreground leading-relaxed text-sm">
        {experience.description}
      </p>

      {/* Technology tags */}
      <div className="flex flex-wrap gap-2">
        {experience.technologies.map((tech) => (
          <span
            key={tech}
            className="flex items-center gap-1.5 rounded-full border border-border bg-secondary/60 px-3 py-1 font-mono text-xs text-muted-foreground"
          >
            <span className="size-1.5 rounded-full bg-primary opacity-70 shrink-0" />
            {tech}
          </span>
        ))}
      </div>

      {/* Links */}
      {experience.companyUrl && (
        <div className="flex items-center gap-3 pt-1">
          <a
            href={experience.companyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-accent transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Sitio web de la empresa
          </a>
        </div>
      )}
    </article>
  )
}
