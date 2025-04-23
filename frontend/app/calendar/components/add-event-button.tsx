"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface AddEventButtonProps {
  onClick?: () => void
}

export const AddEventButton = ({ onClick }: AddEventButtonProps) => {
  return (
    <Button onClick={onClick}>
      <Plus className="h-4 w-4 mr-2" />
      新增事项/会议
    </Button>
  )
}

