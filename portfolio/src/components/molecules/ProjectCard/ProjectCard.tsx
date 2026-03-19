import type { Project } from "@/types"
import { ExternalLink, Github } from "lucide-react"

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="space-y-3">
      {/* Title */}
      <h3 className="text-lg font-semibold text-foreground">
        {project.title}
      </h3>

      {/* Description */}
      <p className="text-foreground/90 leading-relaxed text-sm">
        {project.description}
      </p>

      {/* Technology tags */}
      <div className="flex flex-wrap gap-1.5">
        {project.technologies.map((tech) => (
          <span
            key={tech}
            className="px-2.5 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary border border-primary/20"
          >
            {tech}
          </span>
        ))}
      </div>

      {/* Thumbnail images */}
      {project.images.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pt-1 pb-1 scrollbar-thin">
          {project.images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`${project.title} preview ${index + 1}`}
              className="rounded-lg border border-border/40 object-cover h-36 w-auto flex-shrink-0"
              loading="lazy"
            />
          ))}
        </div>
      )}

      {/* Links */}
      {(project.repoUrl ?? project.projectUrl) && (
        <div className="flex items-center gap-3 pt-1">
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="w-3.5 h-3.5" />
              Repositorio
            </a>
          )}
          {project.projectUrl && (
            <a
              href={project.projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Ver proyecto
            </a>
          )}
        </div>
      )}
    </div>
  )
}
