"use client"

import type { ReactNode } from "react"
import { TabsProvider } from "@/contexts/tabs-context"

export default function RootLayout({ children }: { children: ReactNode }) {
  return <TabsProvider>{children}</TabsProvider>
}

