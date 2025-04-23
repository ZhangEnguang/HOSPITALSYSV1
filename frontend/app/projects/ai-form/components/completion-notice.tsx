"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Check, Clock, X } from "lucide-react"

interface CompletionNoticeProps {
  showCompletionNotice: boolean
  setShowCompletionNotice: (show: boolean) => void
  calculateFillTime: () => string
}

export const CompletionNotice = ({
  showCompletionNotice,
  setShowCompletionNotice,
  calculateFillTime,
}: CompletionNoticeProps) => {
  return (
    <AnimatePresence>
      {showCompletionNotice && (
        <motion.div
          className="fixed bottom-4 right-4 bg-green-50 text-green-600 p-4 rounded-lg shadow-lg flex items-center z-50 border border-green-200"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          <div className="mr-3 bg-green-100 rounded-full p-2">
            <Check className="h-5 w-5 text-green-600" />
          </div>
          <div className="mr-4">
            <div className="font-medium">填充完成</div>
            <div className="text-sm flex items-center">
              <Clock className="h-3.5 w-3.5 mr-1" />
              耗时 {calculateFillTime()} 秒
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowCompletionNotice(false)}
            className="h-6 w-6 rounded-full hover:bg-green-100"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

