"use client"

import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, X } from "lucide-react"

interface CompletionNoticeProps {
  showCompletionNotice: boolean
  setShowCompletionNotice: (show: boolean) => void
  calculateFillTime: () => string
}

export function CompletionNotice({
  showCompletionNotice,
  setShowCompletionNotice,
  calculateFillTime,
}: CompletionNoticeProps) {
  // 自动关闭通知
  useEffect(() => {
    if (showCompletionNotice) {
      const timer = setTimeout(() => {
        setShowCompletionNotice(false)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [showCompletionNotice, setShowCompletionNotice])

  return (
    <AnimatePresence>
      {showCompletionNotice && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-6 right-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 max-w-md border border-green-200 dark:border-green-900"
        >
          <div className="flex items-start">
            <div className="flex-shrink-0 bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">AI自动填充完成</h3>
              <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                <p>已成功填充所有识别字段，耗时 {calculateFillTime()} 秒</p>
              </div>
            </div>
            <button
              type="button"
              className="flex-shrink-0 ml-4 h-5 w-5 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              onClick={() => setShowCompletionNotice(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

