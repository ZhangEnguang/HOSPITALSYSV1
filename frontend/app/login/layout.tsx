import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "登录 - 科研管理平台",
  description: "高校科研创新管理平台登录页面",
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 