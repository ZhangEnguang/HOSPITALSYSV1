"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { ClipboardCheck, Users } from "lucide-react"

interface ProjectReviewButtonProps {
  projectId: string | number
  type?: "review" | "assign"
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

export function ProjectReviewButton({
  projectId,
  type = "review",
  variant = "outline",
  size = "sm",
  className,
}: ProjectReviewButtonProps) {
  const router = useRouter()

  const handleClick = () => {
    if (type === "review") {
      router.push(`/applications/review-projects/${projectId}`)
    } else if (type === "assign") {
      router.push(`/applications/assign-reviewers/${projectId}`)
    }
  }

  return (
    <Button variant={variant} size={size} className={`flex items-center gap-1 ${className}`} onClick={handleClick}>
      {type === "review" ? <ClipboardCheck className="h-4 w-4" /> : <Users className="h-4 w-4" />}
      {type === "review" ? "查看详情" : "分派专家"}
    </Button>
  )
}

