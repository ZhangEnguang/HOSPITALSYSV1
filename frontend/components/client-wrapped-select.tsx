"use client"

import React from "react"
import ClientOnly from "@/components/client-only"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue
} from "@/components/ui/select"

// 包装基础Select组件
export function ClientWrappedSelect(props: React.ComponentProps<typeof Select>) {
  return (
    <ClientOnly>
      <Select {...props} />
    </ClientOnly>
  )
}

// 包装其他Select相关组件
export function ClientWrappedSelectContent(props: React.ComponentProps<typeof SelectContent>) {
  return <SelectContent {...props} />
}

export function ClientWrappedSelectItem(props: React.ComponentProps<typeof SelectItem>) {
  return <SelectItem {...props} />
}

export function ClientWrappedSelectTrigger(props: React.ComponentProps<typeof SelectTrigger>) {
  return <SelectTrigger {...props} />
}

export function ClientWrappedSelectValue(props: React.ComponentProps<typeof SelectValue>) {
  return <SelectValue {...props} />
}

// 导出所有组件
export {
  ClientWrappedSelect as Select,
  ClientWrappedSelectContent as SelectContent,
  ClientWrappedSelectItem as SelectItem,
  ClientWrappedSelectTrigger as SelectTrigger,
  ClientWrappedSelectValue as SelectValue
} 