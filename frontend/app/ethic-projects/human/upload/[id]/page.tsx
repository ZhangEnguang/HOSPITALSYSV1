"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { HumanExperimentDataUploadForm } from "./components/human-experiment-data-upload-form"

// 人体伦理项目上传实验数据页面
export default function UploadHumanExperimentDataPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const projectId = params.id

  return (
    <div className="container py-6 space-y-6 max-w-5xl">
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">上传人体伦理实验数据</h1>
      </div>
      <HumanExperimentDataUploadForm projectId={projectId} />
    </div>
  )
} 