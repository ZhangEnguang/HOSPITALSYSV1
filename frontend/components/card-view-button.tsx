"use client"

import { useRouter } from "next/navigation"
import { Eye } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CardViewButtonProps {
  itemId: number | string
  label?: string
}

export function CardViewButton({ itemId, label = "查看详情" }: CardViewButtonProps) {
  const router = useRouter()

  const handleClick = () => {
    router.push(`/projects/${itemId}`)
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="gap-2 transition-colors duration-200"
      onClick={handleClick}
    >
      <Eye className="h-4 w-4" />
      {label}
    </Button>
  )
}
