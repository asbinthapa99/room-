"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { ArrowUpRight } from "lucide-react"

interface Project {
  title: string
  description: string
  year: string
  link: string
  image: string
}

const projects: Project[] = [
  {
    title: "Verified Rooms",
    description: "Reviewed listings with clear photos, rent details, bills, and availability.",
    year: "Live",
    link: "/listings",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1600&auto=format&fit=crop",
  },
  {
    title: "Direct Messaging",
    description: "Tenants and landlords can arrange viewings without sharing personal contact details first.",
    year: "Live",
    link: "/dashboard/messages",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=1600&auto=format&fit=crop",
  },
  {
    title: "Saved Shortlist",
    description: "Renters can save rooms, compare options, and return when they are ready to book a viewing.",
    year: "Live",
    link: "/dashboard/saved",
    image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1600&auto=format&fit=crop",
  },
  {
    title: "Landlord Tools",
    description: "Post rooms, manage listings, track interest, and keep inventory clean from one dashboard.",
    year: "Live",
    link: "/dashboard/listings",
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1600&auto=format&fit=crop",
  },
]

export function ProjectShowcase() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [smoothPosition, setSmoothPosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)
  const targetPosition = useRef({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor

    const animate = () => {
      setSmoothPosition((prev) => ({
        x: lerp(prev.x, targetPosition.current.x, 0.15),
        y: lerp(prev.y, targetPosition.current.y, 0.15),
      }))
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    targetPosition.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
  }

  const handleMouseEnter = (index: number) => {
    setHoveredIndex(index)
    setIsVisible(true)
  }

  const handleMouseLeave = () => {
    setHoveredIndex(null)
    setIsVisible(false)
  }

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full max-w-3xl mx-auto px-4 sm:px-6 py-16 md:py-20"
    >
      <h2 className="text-muted-foreground text-sm font-semibold tracking-widest uppercase mb-8">
        Marketplace Highlights
      </h2>

      <div
        className="pointer-events-none fixed z-50 hidden overflow-hidden rounded-xl shadow-2xl md:block"
        style={{
          left: containerRef.current?.getBoundingClientRect().left ?? 0,
          top: containerRef.current?.getBoundingClientRect().top ?? 0,
          transform: `translate3d(${smoothPosition.x + 20}px, ${smoothPosition.y - 100}px, 0) scale(${isVisible ? 1 : 0.8})`,
          opacity: isVisible ? 1 : 0,
          transition: "opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <div className="relative h-[180px] w-[280px] overflow-hidden rounded-xl bg-muted">
          {projects.map((project, index) => (
            <img
              key={project.title}
              src={project.image}
              alt={project.title}
              className="absolute inset-0 h-full w-full object-cover transition-all duration-500 ease-out"
              style={{
                opacity: hoveredIndex === index ? 1 : 0,
                transform: `scale(${hoveredIndex === index ? 1 : 1.1})`,
                filter: hoveredIndex === index ? "none" : "blur(10px)",
              }}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
        </div>
      </div>

      <div>
        {projects.map((project, index) => (
          <a
            key={project.title}
            href={project.link}
            className="group block"
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            <div className="relative border-t border-border py-5 transition-all duration-300 ease-out">
              <div
                className={`absolute inset-0 -mx-4 rounded-lg bg-muted/50 px-4 transition-all duration-300 ease-out ${
                  hoveredIndex === index ? "opacity-100 scale-100" : "opacity-0 scale-95"
                }`}
              />

              <div className="relative flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="inline-flex items-center gap-2">
                    <h3 className="text-foreground font-medium text-lg tracking-tight">
                      <span className="relative">
                        {project.title}
                        <span
                          className={`absolute left-0 -bottom-0.5 h-px bg-foreground transition-all duration-300 ease-out ${
                            hoveredIndex === index ? "w-full" : "w-0"
                          }`}
                        />
                      </span>
                    </h3>

                    <ArrowUpRight
                      className={`h-4 w-4 text-muted-foreground transition-all duration-300 ease-out ${
                        hoveredIndex === index
                          ? "opacity-100 translate-x-0 translate-y-0"
                          : "opacity-0 -translate-x-2 translate-y-2"
                      }`}
                    />
                  </div>

                  <p
                    className={`text-muted-foreground mt-1 text-sm leading-relaxed transition-all duration-300 ease-out ${
                      hoveredIndex === index ? "text-foreground/70" : "text-muted-foreground"
                    }`}
                  >
                    {project.description}
                  </p>
                </div>

                <span
                  className={`text-muted-foreground font-mono text-xs tabular-nums transition-all duration-300 ease-out ${
                    hoveredIndex === index ? "text-foreground/60" : ""
                  }`}
                >
                  {project.year}
                </span>
              </div>
            </div>
          </a>
        ))}

        <div className="border-t border-border" />
      </div>
    </section>
  )
}
