"use client"

import React from "react"
import { VisuallyHidden } from "@/components/ui/visually-hidden"
import ClientOnly from "@/components/client-only"

// 保证VisuallyHidden组件只在客户端渲染，避免水合错误
export function ClientWrappedVisuallyHidden({ 
  children, 
  ...props 
}: React.ComponentProps<typeof VisuallyHidden>) {
  return (
    <ClientOnly>
      <VisuallyHidden {...props}>{children}</VisuallyHidden>
    </ClientOnly>
  )
}

export default ClientWrappedVisuallyHidden 