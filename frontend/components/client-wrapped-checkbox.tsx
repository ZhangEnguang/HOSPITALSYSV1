"use client"

import React from "react"
import ClientOnly from "@/components/client-only"
import { Checkbox } from "@/components/ui/checkbox"

// 包装Checkbox组件，确保只在客户端渲染
export function ClientWrappedCheckbox(props: React.ComponentProps<typeof Checkbox>) {
  return (
    <ClientOnly>
      <Checkbox {...props} />
    </ClientOnly>
  )
}

export { ClientWrappedCheckbox as Checkbox } 