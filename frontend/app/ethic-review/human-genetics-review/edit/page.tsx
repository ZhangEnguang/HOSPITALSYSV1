"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { humanGeneticsReviewItems } from "../data/human-genetics-review-demo-data"
import { toast } from "@/components/ui/use-toast"

export default function HumanGeneticsReviewEdit() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = searchParams?.get("id") || null
  const type = searchParams?.get("type") || null

  useEffect(() => {
    if (!id && !type) {
      toast({
        title: "参数错误",
        description: "缺少人遗资源项目ID或类型",
        variant: "destructive",
      })
      router.push("/ethic-review/human-genetics-review")
      return
    }

    if (id) {
      // 如果有ID，查找项目并根据其类型重定向
      const project = humanGeneticsReviewItems.find(item => item.id === id)
      
      if (project) {
        const approvalType = project.approvalType
        let redirectPath = ""

        switch (approvalType) {
          case "人遗采集审批":
            redirectPath = `/ethic-review/human-genetics-review/edit/collection?id=${id}`
            break
          case "人遗保藏审批":
            redirectPath = `/ethic-review/human-genetics-review/edit/preservation?id=${id}`
            break
          case "国际合作科研审批":
            redirectPath = `/ethic-review/human-genetics-review/edit/international-research?id=${id}`
            break
          case "材料出境审批":
            redirectPath = `/ethic-review/human-genetics-review/edit/export?id=${id}`
            break
          case "国际合作临床试验":
            redirectPath = `/ethic-review/human-genetics-review/edit/international-clinical?id=${id}`
            break
          case "对外提供使用备案":
            redirectPath = `/ethic-review/human-genetics-review/edit/external-use?id=${id}`
            break
          case "重要家系资源备案":
            redirectPath = `/ethic-review/human-genetics-review/edit/important-resource?id=${id}`
            break
          default:
            toast({
              title: "未知的审批类型",
              description: `未能识别的审批类型: ${approvalType}`,
              variant: "destructive",
            })
            router.push("/ethic-review/human-genetics-review")
            return
        }

        router.push(redirectPath)
      } else {
        toast({
          title: "项目不存在",
          description: `未找到ID为 ${id} 的人遗资源项目`,
          variant: "destructive",
        })
        router.push("/ethic-review/human-genetics-review")
      }
    } else if (type) {
      // 如果有类型，直接重定向到相应的新建页面
      router.push(`/ethic-review/human-genetics-review/edit/${type}`)
    }
  }, [id, type, router])

  return (
    <div className="flex items-center justify-center h-screen bg-slate-50">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-slate-700">加载中...</h2>
        <p className="text-slate-500 mt-2">正在跳转到相应的编辑页面</p>
      </div>
    </div>
  )
} 