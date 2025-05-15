"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { documentConfigItems } from "../../data/document-config-demo-data"
import { DocumentConfigEditForm } from "./components/document-config-edit-form"

export default function EditDocumentConfigPage() {
  const params = useParams()
  const id = params?.id as string
  const [config, setConfig] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  console.log("编辑页面被初始化", id);
  console.log("页面路径参数:", params);
  
  // 添加当前URL日志
  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log("当前URL:", window.location.href);
      console.log("当前路径:", window.location.pathname);
    }
  }, []);

  useEffect(() => {
    // 模拟API请求，获取配置详情
    const fetchConfig = async () => {
      console.log("正在获取配置数据", id);
      setLoading(true)
      try {
        // 从演示数据中查找配置
        const foundConfig = documentConfigItems.find(item => item.id === id)
        if (foundConfig) {
          console.log("找到配置数据:", foundConfig);
          setConfig(foundConfig)
        } else {
          console.error("未找到ID为", id, "的配置数据");
        }
      } catch (error) {
        console.error("获取配置数据失败:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchConfig()
  }, [id])

  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center">
        <div className="mb-4">
          <div className="w-10 h-10 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        </div>
        <div className="text-lg font-medium">正在加载...</div>
        <div className="text-sm text-gray-500 mt-2">请稍候，正在加载配置数据</div>
      </div>
    )
  }

  if (!config) {
    return (
      <div className="p-8 flex flex-col items-center justify-center">
        <div className="text-lg font-medium text-red-500">未找到数据</div>
        <div className="text-sm text-gray-500 mt-2">找不到指定的送审文件配置</div>
      </div>
    )
  }

  // 使用外部的完整编辑表单组件
  return <DocumentConfigEditForm configData={config} />
} 