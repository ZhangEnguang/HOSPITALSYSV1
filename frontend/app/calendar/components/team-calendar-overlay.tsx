"use client"

import { useState } from "react"
import { Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { useRef, useEffect } from "react"

// 模拟团队成员数据
export const teamMembers = [
  {
    id: "1",
    name: "张教授",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "负责人",
    color: "#4f46e5", // indigo
    team: "人工智能研究组",
  },
  {
    id: "2",
    name: "李博士",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "研究员",
    color: "#0ea5e9", // sky
    team: "数据科学团队",
  },
  {
    id: "3",
    name: "王助研",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "助理研究员",
    color: "#10b981", // emerald
    team: "人工智能研究组",
  },
  {
    id: "4",
    name: "赵博士",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "博士生",
    color: "#f59e0b", // amber
    team: "数据科学团队",
  },
  {
    id: "5",
    name: "钱硕士",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "硕士生",
    color: "#ec4899", // pink
    team: "机器学习小组",
  },
  {
    id: "6",
    name: "孙同学",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "本科生",
    color: "#8b5cf6", // violet
    team: "机器学习小组",
  },
  {
    id: "7",
    name: "周工程师",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "技术支持",
    color: "#f43f5e", // rose
    team: "技术支持部门",
  },
  {
    id: "8",
    name: "吴助教",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "助教",
    color: "#06b6d4", // cyan
    team: "教学辅助团队",
  },
]

interface TeamCalendarOverlayProps {
  onMemberToggle?: (memberIds: string[], opacity: number) => void
  isManager?: boolean
  className?: string
}

export function TeamCalendarOverlay({ onMemberToggle, isManager = false, className }: TeamCalendarOverlayProps) {
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])
  const [opacity, setOpacity] = useState(0.5)
  const [isOpen, setIsOpen] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const startYRef = useRef<number | null>(null)
  const startOpacityRef = useRef<number>(opacity)

  // 当选中的成员或透明度变化时，通知父组件
  useEffect(() => {
    if (onMemberToggle) {
      onMemberToggle(selectedMembers, opacity)
    }
  }, [selectedMembers, opacity, onMemberToggle])

  const handleMemberToggle = (memberId: string) => {
    setSelectedMembers((prev) => {
      const newSelection = prev.includes(memberId) ? prev.filter((id) => id !== memberId) : [...prev, memberId]
      return newSelection
    })
  }

  const handleOpacityChange = (value: number[]) => {
    const newOpacity = value[0]
    setOpacity(newOpacity)
  }

  const handleSelectAll = () => {
    if (selectedMembers.length === teamMembers.length) {
      setSelectedMembers([])
    } else {
      const allMemberIds = teamMembers.map((member) => member.id)
      setSelectedMembers(allMemberIds)
    }
  }

  return (
    <div className={cn("relative", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon" className="h-8 w-8 relative">
            <Users className="h-4 w-4" />
            {selectedMembers.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full w-4 h-4 text-[10px] flex items-center justify-center">
                {selectedMembers.length}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="end">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">团队成员日历</h4>
              <Button variant="ghost" size="sm" onClick={handleSelectAll} className="h-7 text-xs">
                {selectedMembers.length === teamMembers.length ? "取消全选" : "全选"}
              </Button>
            </div>

            {isManager && (
              <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
                作为负责人，您可以查看所有团队成员的完整日程安排
              </div>
            )}

            <div className="space-y-1 max-h-60 overflow-y-auto pr-1">
              {teamMembers.map((member) => (
                <div key={member.id} className="flex items-center space-x-2 p-1 hover:bg-muted rounded">
                  <Checkbox
                    id={`member-${member.id}`}
                    checked={selectedMembers.includes(member.id)}
                    onCheckedChange={() => handleMemberToggle(member.id)}
                  />
                  <Avatar className="h-8 w-8 border-2" style={{ borderColor: member.color }}>
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback style={{ backgroundColor: member.color, color: "white" }}>
                      {member.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">{member.name}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {member.role} · <span className="text-muted-foreground font-medium">{member.team}</span>
                    </div>
                  </div>
                  <div className="h-4 w-4 rounded-full border" style={{ backgroundColor: member.color }} />
                </div>
              ))}
            </div>

            {selectedMembers.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">透明度调整</span>
                  <span className="text-xs text-muted-foreground">{Math.round(opacity * 100)}%</span>
                </div>
                <Slider value={[opacity]} min={0.1} max={0.9} step={0.1} onValueChange={handleOpacityChange} />
                <div className="text-xs text-muted-foreground">拖动滑块调整叠加日历的透明度</div>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

