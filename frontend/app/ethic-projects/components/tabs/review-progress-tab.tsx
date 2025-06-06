"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle, ChevronDown, ChevronUp, Bell, AlertCircle, Check, FileCheck, ChevronRight } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

// 导入新的自定义组件
import { ReviewTimelineCard as ReviewCard, AnimationStyles } from "./review-progress-card"

// 使用新的增强版审查流程卡片组件
const ReviewTimelineCard = ({ 
  review, 
  type = "progress",
  getDocumentStatusColor,
  index = 0
}: { 
  review: any, 
  type?: "progress" | "completed",
  getDocumentStatusColor: (status: string) => string,
  index?: number
}) => {
  // 直接返回新的ReviewCard组件，传入index=-1确保默认收起
  return (
    <ReviewCard 
      review={review}
      type={type}
      getDocumentStatusColor={getDocumentStatusColor}
      index={-1} // 传入-1确保所有卡片默认收起
    />
  );
};

export default function ReviewProgressTab({ projectId, projectType = "animal" }: { projectId?: string; projectType?: "animal" | "human" }) {
  
  // 模拟审查流程数据
  const [reviewData] = useState([
      {
        id: "1",
      type: "动物实验伦理初始审查",
      status: "审核中", // 改为中文
      submittedDate: "2024-01-20",
      expectedCompletionDate: "2024-02-25",
      submittedBy: "王教授",
      currentStep: "专家评审",
      progress: 75,
        reviewHistory: [
        {
          date: "2024-01-20",
          action: "提交申请",
          operator: "王教授",
          comments: "已提交完整的动物实验伦理审查申请材料，包括实验方案、动物使用计划等文档。"
        },
        {
          date: "2024-01-25",
          action: "初步审查",
          operator: "伦理委员会秘书处",
          comments: "材料齐全，符合审查要求，转入专家评审环节。"
        },
        {
          date: "2024-02-05",
          action: "专家评审中",
          operator: "评审专家组",
          comments: "正在进行详细的专家评审，重点关注动物福利保护措施和实验必要性。"
        }
        ],
        documents: [
        { name: "动物实验申请书.pdf", uploadDate: "2024-01-20", status: "已审核" },
        { name: "实验方案书.docx", uploadDate: "2024-01-20", status: "已审核" },
        { name: "动物使用计划.pdf", uploadDate: "2024-01-20", status: "已审核" },
        { name: "研究人员资质证明.pdf", uploadDate: "2024-01-20", status: "已审核" }
      ]
    },
      {
      id: "2",
      type: "科研试验项目备案审核",
      status: "已完成", // 改为中文
      submittedDate: "2023-12-10",
      completedDate: "2023-12-20",
      submittedBy: "李研究员",
      currentStep: "已完成",
      progress: 100,
      result: "备案批准",
      remarks: "经审核，该科研试验项目符合相关规定和伦理要求，予以备案批准。请严格按照备案内容执行，如有变更需及时报告。",
        reviewHistory: [
        {
          date: "2023-12-10",
          action: "提交备案申请",
          operator: "李研究员",
          comments: "提交科研试验项目备案申请及相关材料。"
        },
        {
          date: "2023-12-15",
          action: "专家评审",
          operator: "评审委员会",
          comments: "对项目进行全面评审，确认符合伦理要求。"
        },
        {
          date: "2023-12-20",
          action: "审核通过",
          operator: "伦理委员会",
          comments: "项目通过审核，正式备案批准。"
        }
        ],
        documents: [
        { name: "项目备案申请书.pdf", uploadDate: "2023-12-10", status: "已审核" },
        { name: "研究方案.docx", uploadDate: "2023-12-10", status: "已审核" },
        { name: "伦理审查报告.pdf", uploadDate: "2023-12-20", status: "已审核" }
      ]
    }
  ]);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "审核中":
        return "bg-blue-100 text-blue-700";
      case "已完成":
        return "bg-green-100 text-green-700";
      case "已拒绝":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getDocumentStatusColor = (status: string) => {
    switch (status) {
      case "已审核":
        return "text-green-600";
      case "待审核":
        return "text-yellow-600";
      case "需修改":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };



  return (
    <div className="space-y-6">
      {/* 添加全局动画样式 */}
      <AnimationStyles />
      
      {/* 审查流程时间线 */}
      <div className="space-y-1">
        {reviewData.map((review, index) => (
                    <ReviewTimelineCard 
                  key={review.id} 
                  review={review} 
            type={review.status === "审核中" ? "progress" : "completed"}
                  getDocumentStatusColor={getDocumentStatusColor}
                  index={index}
                />
                  ))}
                </div>

      {reviewData.length === 0 && (
        <Card>
                  <CardContent className="flex flex-col items-center justify-center py-8">
            <Clock className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500 text-center">暂无审查流程记录</p>
            <p className="text-sm text-gray-400 text-center mt-1">
              提交审查申请后，相关记录将在此处显示
                    </p>
                  </CardContent>
                </Card>
      )}
    </div>
  );
} 