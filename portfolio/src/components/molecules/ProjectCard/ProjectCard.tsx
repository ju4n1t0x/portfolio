import { useState } from "react"
import type { Project } from "@/types"
import { ExternalLink, Github, Maximize2 } from "lucide-react"
import { ImageModal } from "@/components/atoms"

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  const [modalImage, setModalImage] = useState<string | URL | null>(null)

  return (
    <article className="space-y-3 p-4 rounded-2xl bg-card border border-border/40 shadow-[0_1px_2px_rgba(0,0,0,0.3),0_8px_24px_-12px_rgba(0,0,0,0.5)] hover:-translate-y-0.5 hover:shadow-[0_2px_4px_rgba(0,0,0,0.4),0_12px_32px_-8px_rgba(0,0,0,0.6)] transition-all duration-200" aria-label={`Proyecto: ${project.title}`}>
      {/* Title */}
      <h3 className="text-lg font-semibold text-foreground">
        {project.title}
      </h3>

      {/* Description */}
      <p className="text-muted-foreground leading-relaxed text-sm">
        {project.description}
      </p>

      {/* Technology tags */}
      <div className="flex flex-wrap gap-2">
        {project.technologies.map((tech) => (
          <span
            key={tech}
            className="flex items-center gap-1.5 rounded-full border border-border bg-secondary/60 px-3 py-1 font-mono text-xs text-muted-foreground"
          >
            <span className="size-1.5 rounded-full bg-primary opacity-70 shrink-0" />
            {tech}
          </span>
        ))}
      </div>

      {/* Thumbnail images */}
      {project.images.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pt-1 pb-1 scrollbar-thin">
          {project.images.map((img, index) => (
            <div key={index} className="relative group flex-shrink-0 animate-message-in" style={{ "--stagger-index": index } as React.CSSProperties}>
              <img
                src={typeof img === "string" ? img : img.toString()}
                alt={`${project.title} preview ${index + 1}`}
                className="rounded-xl border border-border object-cover h-36 w-auto cursor-pointer transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
                onClick={() => setModalImage(img)}
              />
              {/* Hover overlay with expand icon - pointer-events-none so clicks pass through to img */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center pointer-events-none">
                <Maximize2 className="w-6 h-6 text-white" />
              </div>
            </div>
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
              className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-accent transition-colors"
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
              className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-accent transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Ver proyecto
            </a>
          )}
        </div>
      )}

      {/* Image Modal */}
      <ImageModal
        src={modalImage || ""}
        alt={`${project.title} preview`}
        isOpen={!!modalImage}
        onClose={() => setModalImage(null)}
      />
    </article>
  )
}
