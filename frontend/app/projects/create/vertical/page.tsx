"use client"

import { useEffect, useState } from "react"
import { ProjectCreationForm } from "@/components/project-creation/project-creation-form"

export default function CreateVerticalProjectPage() {
  const [mockAnalysisResult, setMockAnalysisResult] = useState<Record<string, any>>({})

  useEffect(() => {
    // 模拟分析结果数据
    const mockResult = {
      批准号: "XM2025001",
      项目名称: "基于人工智能的智慧校园管理系统研发",
      所属单位: "信息工程学院",
      项目分类: "工程技术",
      项目级别: "省级",
      经费来源: "省科技厅专项资金",
      项目状态: "申请中",
      开始日期: "2025-04-01",
      结束日期: "2026-03-31",
      项目负责人: "张三",
      职称: "教授",
      联系电话: "13800138000",
      电子邮箱: "zhangsan@example.com",
      身份证号: "110101199001011234",
      项目经办人: "李四",
      经办人电话: "13900139000",
      项目类型: "纵向",
    }

    // 保存到localStorage以便刷新后仍能使用
    localStorage.setItem("analysisResult", JSON.stringify(mockResult))
    setMockAnalysisResult(mockResult)
  }, [])

  return (
    <ProjectCreationForm
      projectType="纵向"
      mockAnalysisResult={mockAnalysisResult}
      localStorageKey="verticalProjectDraft"
      redirectPath="/projects"
      showAIPanel={true}
    />
  )
}

