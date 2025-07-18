"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"

interface Member {
  name: string
  role: string
  avatar?: string | null
}

interface ProjectMemberAvatarsProps {
  members: Member[]
  maxDisplay?: number
  size?: "sm" | "md" | "lg"
  className?: string
}

// 生成姓名首字母
const getInitials = (name: string): string => {
  if (!name) return "?"
  
  // 如果是中文姓名，取第一个字符（通常是姓氏）
  if (name.match(/[\u4e00-\u9fa5]/)) {
    return name.slice(0, 1)
  }
  
  // 如果是英文姓名，取首字母
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

// 根据姓名生成背景色
const getAvatarColor = (name: string): string => {
  const colors = [
    '#3B82F6', // 蓝色
    '#8B5CF6', // 紫色
    '#06B6D4', // 青色
    '#10B981', // 绿色
    '#F59E0B', // 橙色
    '#EF4444', // 红色
    '#EC4899'  // 粉色
  ]
  
  const hash = name.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc)
  }, 0)
  
  return colors[Math.abs(hash) % colors.length]
}

export default function ProjectMemberAvatars({ 
  members, 
  maxDisplay = 3, 
  size = "sm",
  className 
}: ProjectMemberAvatarsProps) {
  if (!members || members.length === 0) {
    return null
  }

  const displayMembers = members.slice(0, maxDisplay)
  const remainingCount = members.length - maxDisplay

  const sizeClasses = {
    sm: "h-7 w-7 text-xs",
    md: "h-8 w-8 text-sm", 
    lg: "h-10 w-10 text-base"
  }

  const marginClasses = {
    sm: "-ml-1.5",
    md: "-ml-2",
    lg: "-ml-2.5"
  }

  return (
    <TooltipProvider>
      <div className={cn("flex items-center", className)}>
        {displayMembers.map((member, index) => {
          const isLeader = index === 0
          return (
          <Tooltip key={`${member.name}-${index}`}>
            <TooltipTrigger asChild>
              <div
                className={cn(
                    "inline-flex items-center justify-center rounded-full border-2 border-white shadow-sm cursor-pointer hover:z-10 transition-transform hover:scale-110",
                  sizeClasses[size],
                    index > 0 && marginClasses[size],
                    isLeader 
                      ? "text-white" 
                      : "text-gray-700 bg-gray-200"
                )}
                  style={isLeader ? { backgroundColor: getAvatarColor(member.name) } : {}}
              >
                {member.avatar ? (
                  <img 
                    src={member.avatar} 
                    alt={member.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  getInitials(member.name)
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <div className="text-center">
                <p className="font-medium">{member.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {isLeader ? "项目负责人" : member.role}
                  </p>
              </div>
            </TooltipContent>
          </Tooltip>
          )
        })}
        
        {remainingCount > 0 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className={cn(
                  "inline-flex items-center justify-center rounded-full border-2 border-white bg-gray-200 text-gray-700 shadow-sm cursor-pointer hover:z-10 transition-transform hover:scale-110",
                  sizeClasses[size],
                  marginClasses[size]
                )}
              >
                +{remainingCount}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <div className="max-w-xs">
                <p className="font-medium mb-1">其他成员:</p>
                {members.slice(maxDisplay).map((member, index) => (
                  <div key={index} className="text-xs">
                    <span className="font-medium">{member.name}</span>
                    <span className="text-muted-foreground ml-1">({member.role})</span>
                  </div>
                ))}
              </div>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  )
} 