import type { Experience } from "@/types"
import { ExternalLink, Calendar } from "lucide-react"

interface ExperienceCardProps {
  experience: Experience
}

export function ExperienceCard({ experience }: ExperienceCardProps) {
  return (
    <div className="space-y-3">
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
      <p className="text-foreground/90 leading-relaxed text-sm">
        {experience.description}
      </p>

      {/* Technology tags */}
      <div className="flex flex-wrap gap-1.5">
        {experience.technologies.map((tech) => (
          <span
            key={tech}
            className="px-2.5 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary border border-primary/20"
          >
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
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Sitio web
          </a>
        </div>
      )}
    </div>
  )
}
