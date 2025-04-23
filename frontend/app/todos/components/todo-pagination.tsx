"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function TodoPagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  return (
    <div className="flex justify-center items-center mt-6 space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="h-8 w-8 p-0"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {Array.from({ length: Math.min(5, Math.max(1, totalPages)) }, (_, i) => {
        // 显示当前页附近的页码
        let pageToShow: number
        if (totalPages <= 5) {
          pageToShow = i + 1
        } else if (currentPage <= 3) {
          pageToShow = i + 1
        } else if (currentPage >= totalPages - 2) {
          pageToShow = totalPages - 4 + i
        } else {
          pageToShow = currentPage - 2 + i
        }

        return (
          <Button
            key={pageToShow}
            variant={currentPage === pageToShow ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(pageToShow)}
            className="h-8 w-8 p-0"
          >
            {pageToShow}
          </Button>
        )
      })}

      {totalPages > 5 && currentPage < totalPages - 2 && (
        <>
          <span className="text-muted-foreground">...</span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onPageChange(totalPages)} 
            className="h-8 w-8 p-0"
          >
            {totalPages}
          </Button>
        </>
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || totalPages === 0}
        className="h-8 w-8 p-0"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      <div className="text-sm text-muted-foreground ml-2">
        第 {currentPage} 页，共 {Math.max(1, totalPages)} 页
      </div>
    </div>
  )
} 