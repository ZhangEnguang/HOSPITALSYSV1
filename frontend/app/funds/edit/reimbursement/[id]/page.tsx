"use client"

import { ReimbursementForm } from "../../../create/reimbursement/components/reimbursement-form"

export default function EditReimbursementPage() {
  // 添加更完整的演示数据
  const demoData = {
    expenseName: "差旅费报销",
    amount: 5200,
    date: "2023-06-15",
    description: "参加全国学术会议的差旅费和会议注册费",
    projectId: "1",
    category: "差旅费",
    expenseType: "差旅费",
    expenseDate: "2023-06-10",
    receiptNumber: "RX20230615001",
    status: "待审核",
    applicant: "王五",
    isEditMode: true  // 标记为编辑模式
  }

  return <ReimbursementForm initialData={demoData} />
} 