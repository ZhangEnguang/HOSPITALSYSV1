"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"

interface AnimalRoomManageFormProps {
  roomId: string
}

export function AnimalRoomManageForm({ roomId }: AnimalRoomManageFormProps) {
  const router = useRouter()
  
  const handleSave = () => {
    toast({
      title: "保存成功",
      description: "动物房管理配置已保存",
    })
  }
  
  const handleReturnToList = () => {
    router.push("/laboratory/animal-rooms")
  }

  return (
    <div className="container py-6 space-y-6 max-w-5xl">
      <div className="flex items-center">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleReturnToList}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">动物房饲养管理</h1>
          <Badge variant="outline" className="ml-2">
            AR-{roomId} - 动物房{roomId}
          </Badge>
        </div>
      </div>

      <Card className="border-[#E9ECF2] shadow-sm">
        <CardContent className="p-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">基本信息</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>房间类型</Label>
                <p className="font-medium">SPF饲养间</p>
              </div>
              <div>
                <Label>当前状态</Label>
                <Badge>使用中</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={handleReturnToList}>
          返回列表
        </Button>
        <Button onClick={handleSave}>
          <CheckCircle2 className="h-4 w-4 mr-2" />
          保存管理配置
        </Button>
      </div>
    </div>
  )
}
