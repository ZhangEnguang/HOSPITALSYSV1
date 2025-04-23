"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { X, Phone, Mail, UserCircle, Building2, Award, GraduationCap, MapPin, FileText } from "lucide-react"
import { expertLevelColors, fieldColors } from "../config/experts-config"
import { format } from "date-fns"

interface ExpertDetailsDrawerProps {
  isOpen: boolean
  onClose: () => void
  expert: any // 专家数据
}

export function ExpertDetailsDrawer({ isOpen, onClose, expert }: ExpertDetailsDrawerProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !expert) return null

  return (
    <div
      className={`fixed inset-0 z-50 bg-black/50 transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={onClose}
    >
      <div
        className={`fixed right-0 top-0 z-[60] h-full w-full max-w-md transform overflow-y-auto bg-background p-6 shadow-lg transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">专家详情</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <Separator className="my-4" />

        <div className="space-y-6">
          {/* 基本信息 */}
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={expert.avatar} />
              <AvatarFallback className="text-2xl">{expert.name[0]}</AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h3 className="text-xl font-semibold">{expert.name}</h3>
              <div className="mt-1 flex items-center justify-center gap-2">
                <Badge variant={expertLevelColors[expert.expertLevel] || "default"}>
                  {expert.expertLevel}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Award className="h-3 w-3" />
                  {expert.title || "未设置职称"}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <GraduationCap className="h-3 w-3" />
                  {expert.education || "未设置学历"}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* 工作信息 */}
          <div>
            <h4 className="mb-3 font-medium">工作信息</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">所属单位</span>
                </div>
                <p className="pl-6">{expert.departmentName || expert.department?.name || "未设置"}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <UserCircle className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">工号</span>
                </div>
                <p className="pl-6">{expert.account || "未设置"}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">入职日期</span>
                </div>
                <p className="pl-6">
                  {expert.workDate ? format(new Date(expert.workDate), "yyyy-MM-dd") : "未设置"}
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">职称</span>
                </div>
                <p className="pl-6">{expert.title || "未设置"}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* 专业领域 */}
          {expert.specialty && expert.specialty.length > 0 && (
            <>
              <div>
                <h4 className="mb-3 font-medium">专业领域</h4>
                <div className="flex flex-wrap gap-2">
                  {expert.specialty.map((field: string, index: number) => {
                    const variant = fieldColors[field] || "default"
                    return (
                      <Badge key={index} variant={variant}>
                        {field}
                      </Badge>
                    )
                  })}
                </div>
              </div>

              <Separator />
            </>
          )}

          {/* 联系方式 */}
          <div>
            <h4 className="mb-3 font-medium">联系方式</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>手机: {expert.mobile || expert.phone || "未设置"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>办公电话: {expert.telOffice || "未设置"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>邮箱: {expert.email || "未设置"}</span>
              </div>
            </div>

            {expert.address && (
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">通讯地址</span>
                </div>
                <p className="pl-6">{expert.address}</p>
              </div>
            )}
          </div>

          <Separator />

          {/* 专家简介 */}
          {(expert.intro || expert.bio) && (
            <div>
              <h4 className="mb-3 font-medium">专家简介</h4>
              <div className="rounded-md bg-muted/50 p-3">
                <div className="flex items-start gap-2">
                  <FileText className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <p className="text-sm">{expert.intro || expert.bio}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 