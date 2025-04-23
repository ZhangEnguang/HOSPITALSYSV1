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

interface DataListBatchActionsProps {
  show: boolean
  selectedCount: number
  actions: BatchAction[]
  onClearSelection: () => void
}

export default function DataListBatchActions({
  show,
  selectedCount,
  actions,
  onClearSelection,
}: DataListBatchActionsProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed bottom-6 left-1/2 z-50 bg-background border rounded-lg shadow-lg px-4 py-3 flex items-center gap-4"
          initial={{ opacity: 0, y: 50, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: 50, x: "-50%" }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div className="flex items-center gap-2">
            <span className="font-medium">已选择 {selectedCount} 项</span>
            <Button variant="ghost" size="sm" onClick={onClearSelection} className="text-muted-foreground">
              取消选择
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

