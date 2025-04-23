"use client"

import { ReactNode } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface SettingsContainerProps {
  title: string
  description?: string
  children: ReactNode
}

export function SettingsContainer({ title, description, children }: SettingsContainerProps) {
  return (
    <Card className="mb-6 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
        {description && <p className="text-sm text-slate-500 mt-1">{description}</p>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
} 