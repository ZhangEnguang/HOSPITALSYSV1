"use client"

import { useState, useEffect } from "react"
import { X, Building, User, Hash, Info, Calendar, PhoneCall, Contact, SortAsc, FileText } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { orgTypeNames, organizationTypeColors } from "../config/members-config"
import { format, parseISO, isValid } from 'date-fns'

interface OrganizationDetailsDrawerProps {
  isOpen: boolean
  onClose: () => void
  organization: any | null
}

const formatDateSafe = (dateString: string | null | undefined): string => {
  if (!dateString) return 'N/A';
  try {
    const date = parseISO(dateString);
    return isValid(date) ? format(date, 'yyyy-MM-dd') : '日期无效';
  } catch (e) {
    console.error("Error formatting date:", e);
    return '日期错误';
  }
};

const formatNumberSafe = (num: number | null | undefined): string => {
    return (num !== null && num !== undefined) ? num.toString() : 'N/A';
}

export function OrganizationDetailsDrawer({ isOpen, onClose, organization }: OrganizationDetailsDrawerProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !organization) return null;

  const orgTypeName = orgTypeNames[organization.unitTypeId] || organization.unitTypeId || '未知';
  const orgTypeVariant = organizationTypeColors[organization.unitTypeId] || "default";

  return (
    <div
       className={`fixed inset-0 z-50 bg-black/50 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      onClick={onClose}
    >
      <div
        className={`fixed right-0 top-0 z-[60] h-full w-full max-w-md transform overflow-y-auto bg-background p-6 shadow-lg transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">组织详情</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <Separator className="my-4" />

        <div className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={organization.avatar} />
              <AvatarFallback className="text-2xl">{organization.name ? organization.name[0] : '?'}</AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h3 className="text-xl font-semibold">{organization.name || 'N/A'}</h3>
              <div className="mt-1 flex items-center justify-center gap-2">
                 <Badge variant={orgTypeVariant}>{orgTypeName}</Badge>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="mb-3 font-medium text-base">详细信息</h4>
             <div className="grid grid-cols-1 gap-4">
               <div className="flex items-start gap-3">
                 <Hash className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                 <div>
                   <p className="text-sm font-medium">单位编号</p>
                   <p className="text-sm text-muted-foreground">{organization.code || 'N/A'}</p>
                 </div>
               </div>

                <div className="flex items-start gap-3">
                 <User className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                 <div>
                   <p className="text-sm font-medium">负责人</p>
                   <p className="text-sm text-muted-foreground">{organization.charger || 'N/A'}</p>
                 </div>
               </div>

               <div className="flex items-start gap-3">
                 <Contact className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                 <div>
                   <p className="text-sm font-medium">联系人</p>
                   <p className="text-sm text-muted-foreground">{organization.linkMan || 'N/A'}</p>
                 </div>
               </div>

               <div className="flex items-start gap-3">
                 <PhoneCall className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                 <div>
                   <p className="text-sm font-medium">联系电话</p>
                   <p className="text-sm text-muted-foreground">{organization.tel || 'N/A'}</p>
                 </div>
               </div>

                <div className="flex items-start gap-3">
                 <Calendar className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                 <div>
                   <p className="text-sm font-medium">成立日期</p>
                   <p className="text-sm text-muted-foreground">{formatDateSafe(organization.unitCreateDate)}</p>
                 </div>
               </div>

               <div className="flex items-start gap-3">
                 <SortAsc className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                 <div>
                   <p className="text-sm font-medium">排序号</p>
                   <p className="text-sm text-muted-foreground">{formatNumberSafe(organization.orderId)}</p>
                 </div>
               </div>
            </div>
          </div>

          {organization.intro && (
            <>
              <Separator />
              <div>
                <h4 className="mb-3 font-medium text-base">简介</h4>
                <div className="flex items-start gap-3 rounded-md bg-muted/50 p-3">
                  <FileText className="mt-0.5 h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <p className="text-sm">{organization.intro}</p>
                </div>
              </div>
            </>
          )}

          {organization.standBy1 && (
            <>
              <Separator />
              <div>
                <h4 className="mb-3 font-medium text-base">备注</h4>
                 <div className="flex items-start gap-3 rounded-md bg-muted/50 p-3">
                  <Info className="mt-0.5 h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <p className="text-sm">{organization.standBy1}</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

