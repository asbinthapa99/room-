"use client"

import React, { useState, useRef, useLayoutEffect, cloneElement } from "react"
import { cn } from "@/lib/utils"

type NavItem = {
  id: string | number
  icon: React.ReactElement
  label?: string
  onClick?: () => void
}

type LimelightNavProps = {
  items: NavItem[]
  activeIndex?: number
  onTabChange?: (index: number) => void
  className?: string
  limelightClassName?: string
  iconContainerClassName?: string
  iconClassName?: string
}

export function LimelightNav({
  items,
  activeIndex: controlledIndex,
  onTabChange,
  className,
  limelightClassName,
  iconContainerClassName,
  iconClassName,
}: LimelightNavProps) {
  const [internalIndex, setInternalIndex] = useState(controlledIndex ?? 0)
  const [isReady, setIsReady] = useState(false)
  const navItemRefs = useRef<(HTMLButtonElement | null)[]>([])
  const limelightRef = useRef<HTMLDivElement | null>(null)

  const activeIndex = controlledIndex ?? internalIndex

  useLayoutEffect(() => {
    if (items.length === 0) return
    const limelight = limelightRef.current
    const activeItem = navItemRefs.current[activeIndex]
    if (limelight && activeItem) {
      const newLeft = activeItem.offsetLeft + activeItem.offsetWidth / 2 - limelight.offsetWidth / 2
      limelight.style.left = `${newLeft}px`
      if (!isReady) setTimeout(() => setIsReady(true), 50)
    }
  }, [activeIndex, isReady, items])

  if (items.length === 0) return null

  const handleClick = (index: number, itemOnClick?: () => void) => {
    setInternalIndex(index)
    onTabChange?.(index)
    itemOnClick?.()
  }

  return (
    <nav className={cn(
      "relative inline-flex items-center h-16 rounded-2xl bg-white/90 backdrop-blur-2xl border border-gray-100 shadow-float px-2",
      className
    )}>
      {items.map(({ id, icon, label, onClick }, index) => (
        <button
          key={id}
          ref={(el) => { navItemRefs.current[index] = el }}
          className={cn(
            "relative z-20 flex h-full cursor-pointer items-center justify-center p-5 transition-transform duration-150 active:scale-90",
            iconContainerClassName
          )}
          onClick={() => handleClick(index, onClick)}
          aria-label={label}
          type="button"
        >
          {cloneElement(icon as React.ReactElement<{ className?: string }>, {
            className: cn(
              "w-[22px] h-[22px] transition-all duration-200",
              activeIndex === index ? "opacity-100 scale-110" : "opacity-35",
              (icon as React.ReactElement<{ className?: string }>).props.className,
              iconClassName
            ),
          })}
        </button>
      ))}

      {/* Limelight indicator */}
      <div
        ref={limelightRef}
        className={cn(
          "absolute top-0 z-10 w-11 h-[3px] rounded-full bg-primary",
          isReady ? "transition-[left] duration-300 ease-in-out" : "",
          limelightClassName
        )}
        style={{
          left: "-999px",
          boxShadow: "0 30px 20px var(--primary)",
        }}
      >
        {/* Cone of light */}
        <div className="absolute left-[-30%] top-[3px] w-[160%] h-14 pointer-events-none bg-gradient-to-b from-primary/25 to-transparent [clip-path:polygon(5%_100%,25%_0,75%_0,95%_100%)]" />
      </div>
    </nav>
  )
}
