"use client"

import React, { useRef, useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface StickyTableProps extends React.HTMLAttributes<HTMLDivElement> {
  stickyFirstCol?: boolean
  stickyLastCol?: boolean
  firstColWidth?: string
  lastColWidth?: string
  shadowIntensity?: "light" | "medium" | "strong"
  fadeRange?: "narrow" | "medium" | "wide"
  cellPadding?: "tight" | "normal" | "loose"
  children: React.ReactNode
}

export function StickyTable({
  stickyFirstCol = true,
  stickyLastCol = true,
  firstColWidth = "12rem",
  lastColWidth = "8rem",
  shadowIntensity = "medium",
  fadeRange = "medium",
  cellPadding = "normal",
  className,
  children,
  ...props
}: StickyTableProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [showLeftShadow, setShowLeftShadow] = useState(false)
  const [showRightShadow, setShowRightShadow] = useState(false)

  // Shadow intensity classes
  const shadowClasses = {
    light: "shadow-[5px_0_5px_-5px_rgba(0,0,0,0.1)]",
    medium: "shadow-[5px_0_10px_-5px_rgba(0,0,0,0.2)]",
    strong: "shadow-[5px_0_15px_-5px_rgba(0,0,0,0.3)]",
  }

  // Fade range classes
  const fadeClasses = {
    narrow: "w-4",
    medium: "w-8",
    wide: "w-12",
  }

  // Cell padding classes
  const paddingClasses = {
    tight: "p-2",
    normal: "p-3",
    loose: "p-4",
  }

  // Handle scroll event to show/hide shadows
  const handleScroll = () => {
    if (!scrollContainerRef.current) return

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
    const maxScrollLeft = scrollWidth - clientWidth

    // Show left shadow if scrolled from the left edge
    setShowLeftShadow(scrollLeft > 0)

    // Show right shadow if not scrolled all the way to the right
    setShowRightShadow(scrollLeft < maxScrollLeft - 1) // -1 for rounding errors
  }

  // Check initial scroll state
  useEffect(() => {
    handleScroll()
    // Add resize listener to recheck shadows when window size changes
    window.addEventListener("resize", handleScroll)
    return () => window.removeEventListener("resize", handleScroll)
  }, [])

  return (
    <div className={cn("relative overflow-hidden", className)} {...props}>
      {/* Left shadow indicator */}
      {showLeftShadow && (
        <div
          className={cn(
            "absolute left-0 top-0 bottom-0 z-10 pointer-events-none",
            fadeClasses[fadeRange],
            "bg-gradient-to-r from-background to-transparent",
          )}
        />
      )}

      {/* Right shadow indicator */}
      {showRightShadow && (
        <div
          className={cn(
            "absolute right-0 top-0 bottom-0 z-10 pointer-events-none",
            fadeClasses[fadeRange],
            "bg-gradient-to-l from-background to-transparent",
          )}
        />
      )}

      <div
        ref={scrollContainerRef}
        className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
        onScroll={handleScroll}
        style={{
          // Custom scrollbar styling
          scrollbarWidth: "thin",
          msOverflowStyle: "none", // IE and Edge
        }}
      >
        <style jsx global>{`
          .sticky-table-cell {
            position: sticky;
            z-index: 2;
            background-color: inherit;
          }
          
          .sticky-table-cell-first {
            left: 0;
            ${showLeftShadow ? `box-shadow: 5px 0 10px -5px rgba(0,0,0,0.2);` : ""}
          }
          
          .sticky-table-cell-last {
            right: 0;
            ${showRightShadow ? `box-shadow: -5px 0 10px -5px rgba(0,0,0,0.2);` : ""}
          }
          
          /* Ensure sticky cells appear above regular cells */
          .sticky-table thead tr th {
            background-color: white;
            position: sticky;
            top: 0;
            z-index: 3;
          }
          
          /* Ensure corner cells appear above all others */
          .sticky-table-cell-first.sticky-table-header,
          .sticky-table-cell-last.sticky-table-header {
            z-index: 4;
          }
          
          /* Apply custom widths to sticky columns */
          .sticky-table-cell-first {
            width: ${firstColWidth};
            min-width: ${firstColWidth};
          }
          
          .sticky-table-cell-last {
            width: ${lastColWidth};
            min-width: ${lastColWidth};
          }
          
          /* Apply custom padding to all cells */
          .sticky-table th,
          .sticky-table td {
            ${paddingClasses[cellPadding]};
          }
        `}</style>

        <table className="w-full border-collapse sticky-table">
          {React.Children.map(children, (child) => {
            if (!React.isValidElement(child)) return child

            // Process thead
            if (child.type === "thead") {
              return React.cloneElement(child, {
                ...child.props,
                children: React.Children.map(child.props.children, (tr) => {
                  if (!React.isValidElement(tr)) return tr

                  return React.cloneElement(tr, {
                    ...tr.props,
                    children: React.Children.map(tr.props.children, (th, thIndex) => {
                      if (!React.isValidElement(th)) return th

                      const isFirstCol = thIndex === 0 && stickyFirstCol
                      const isLastCol = thIndex === React.Children.count(tr.props.children) - 1 && stickyLastCol

                      return React.cloneElement(th, {
                        ...th.props,
                        className: cn(
                          th.props.className,
                          "sticky-table-header",
                          isFirstCol && "sticky-table-cell sticky-table-cell-first",
                          isLastCol && "sticky-table-cell sticky-table-cell-last",
                        ),
                      })
                    }),
                  })
                }),
              })
            }

            // Process tbody
            if (child.type === "tbody") {
              return React.cloneElement(child, {
                ...child.props,
                children: React.Children.map(child.props.children, (tr) => {
                  if (!React.isValidElement(tr)) return tr

                  return React.cloneElement(tr, {
                    ...tr.props,
                    children: React.Children.map(tr.props.children, (td, tdIndex) => {
                      if (!React.isValidElement(td)) return td

                      const isFirstCol = tdIndex === 0 && stickyFirstCol
                      const isLastCol = tdIndex === React.Children.count(tr.props.children) - 1 && stickyLastCol

                      return React.cloneElement(td, {
                        ...td.props,
                        className: cn(
                          td.props.className,
                          isFirstCol && "sticky-table-cell sticky-table-cell-first",
                          isLastCol && "sticky-table-cell sticky-table-cell-last",
                        ),
                      })
                    }),
                  })
                }),
              })
            }

            return child
          })}
        </table>
      </div>
    </div>
  )
}

