"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, Save } from "lucide-react"
import Link from "next/link"

export default function CreateEquipmentPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Link href="/laboratory/equipment">
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-semibold">新增仪器</h1>
        </div>
        <Button className="gap-2">
          <Save className="h-4 w-4" />
          保存
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>仪器基本信息</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">仪器新增表单将在此处实现</p>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline">取消</Button>
          <Button>提交</Button>
        </CardFooter>
      </Card>
    </div>
  )
} 