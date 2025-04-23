"use client"

import { CarryoverForm } from "../../../create/carryover/components/carryover-form"

export default function EditCarryoverPage() {
  // 添加更完整的演示数据
  const demoData = {
    expenseName: "项目结题经费结转",
    amount: 50000,
    date: "2023-11-20",
    description: "省部级重点项目结题阶段经费结转",
    projectId: "1",
    category: "结题结转",
    fromYear: "2023",
    toYear: "2024",
    carryoverReason: "项目实施进度调整",
    status: "待审核",
    applicant: "王五",
    isEditMode: true  // 标记为编辑模式
  }

  return <CarryoverForm initialData={demoData} />
} 