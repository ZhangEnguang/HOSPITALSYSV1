"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { FormData } from "../page"

interface SuccessViewProps {
  formData: FormData;
  onAddAnother: () => void;
  onReturnToList: () => void;
}

export function SuccessView({ formData, onAddAnother, onReturnToList }: SuccessViewProps) {
  // 时间格式化函数
  const formatDate = (date: Date | string) => {
    if (!date) return ""
    if (typeof date === "string") return date
    return new Intl.DateTimeFormat("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  }

  return (
    <div className="w-full bg-white p-8 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center">
      <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
        <CheckCircle className="h-10 w-10 text-green-500" />
      </div>
      
      <h2 className="text-xl font-bold mb-3">提交成功</h2>
      
      <p className="text-gray-500 text-sm text-center mb-6 max-w-lg">
        您的申报批次已成功提交，可在申报批次管理中查看。
      </p>
      
      <div className="w-full max-w-lg bg-gray-50 p-4 rounded-md mb-6">
        <h3 className="font-medium mb-3 text-center">申报计划信息</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-gray-500">申请计划名称：</p>
            <p>{formData.name}</p>
          </div>
          <div>
            <p className="text-gray-500">项目分类：</p>
            <p>{formData.category}</p>
          </div>
          <div>
            <p className="text-gray-500">申请时间：</p>
            <p>{formatDate(formData.startDate)} 至 {formatDate(formData.endDate)}</p>
          </div>
        </div>
      </div>
      
      <div className="flex space-x-4">
        <Button 
          onClick={onReturnToList}
          className="px-6"
        >
          返回列表
        </Button>
        <Button 
          variant="outline"
          onClick={onAddAnother}
          className="px-6"
        >
          继续添加
        </Button>
      </div>
    </div>
  );
}
