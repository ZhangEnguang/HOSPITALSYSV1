"use client"

import type React from "react"

import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export interface BatchAction {
  id: string
  label: string
  icon?: React.ReactNode
  onClick: () => void
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  disabled?: boolean
}

interface BatchActionsBarProps {
  show: boolean
  selectedCount: number
  actions: BatchAction[]
  onClearSelection: () => void
  selectionLabel?: string
  clearSelectionLabel?: string
  position?: "bottom" | "top"
  className?: string
}

export default function BatchActionsBar({
  show,
  selectedCount,
  actions,
  onClearSelection,
  selectionLabel = "已选择",
  clearSelectionLabel = "取消选择",
  position = "bottom",
  className = "",
}: BatchActionsBarProps) {
  // 根据位置设置不同的样式
  const positionStyles = position === "bottom" ? "fixed bottom-6 left-1/2 z-50" : "fixed top-6 left-1/2 z-50"

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className={`${positionStyles} bg-background border rounded-lg shadow-lg px-4 py-3 flex items-center gap-4 ${className}`}
          initial={{ opacity: 0, y: position === "bottom" ? 50 : -50, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: position === "bottom" ? 50 : -50, x: "-50%" }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div className="flex items-center gap-2">
            <span className="font-medium">
              {selectionLabel} {selectedCount} 项
            </span>
            <Button variant="ghost" size="sm" onClick={onClearSelection} className="text-muted-foreground">
              {clearSelectionLabel}
            </Button>
          </div>

          <Separator orientation="vertical" className="h-8" />

          <div className="flex items-center gap-2">
            {actions.map((action) => (
              <motion.div key={action.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant={action.variant || "outline"}
                  onClick={action.onClick}
                  className="gap-1"
                  disabled={!!action.disabled}
                >
                  {action.icon && action.icon}
                  {action.label}
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

