"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface InteractiveHoverButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  className?: string
}

export const InteractiveHoverButton = React.forwardRef<HTMLButtonElement, InteractiveHoverButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <button
        className={cn(
          "group relative inline-flex h-9 items-center justify-center overflow-hidden rounded-md bg-[#2156FF] px-4 py-2 text-sm font-medium text-white transition-all hover:bg-[#1845e0] focus:outline-none focus:ring-2 focus:ring-[#2156FF] focus:ring-offset-2",
          className,
        )}
        ref={ref}
        {...props}
      >
        <span className="absolute inset-0 flex h-full w-full items-center justify-center text-white duration-300 group-hover:translate-y-[-100%]">
          {children}
        </span>
        <span className="absolute inset-0 flex h-full w-full translate-y-[100%] items-center justify-center text-white duration-300 group-hover:translate-y-0">
          {children}
        </span>
      </button>
    )
  },
)

InteractiveHoverButton.displayName = "InteractiveHoverButton"

