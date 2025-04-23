"use client"

import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { InfoIcon, CalendarIcon, User, BookOpen, FileText, Upload, AlertCircle, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { useEffect, useRef, useState } from "react"
import { toast } from "@/hooks/use-toast"
import Link from "next/link"

interface ProjectDetailStepProps {
  formData: Record<string, any>
  handleInputChange: (field: string, value: any) => void
  validationErrors: Record<string, string>
  batchInfo?: {
    formGenerationType?: "全流程在线生成" | "智能协同生成" | string
  }
}

export function ProjectDetailStep({
  formData,
  handleInputChange,
  validationErrors,
  batchInfo = {}
}: ProjectDetailStepProps) {
  const isIntelligentGeneration = batchInfo?.formGenerationType === "智能协同生成";
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileUploaded, setFileUploaded] = useState(!!formData["申报书正文"]);
  const [fileName, setFileName] = useState(formData["申报书正文"]?.name || "");
  
  // 监听batchInfo变化，更新界面
  useEffect(() => {
    console.log("表单生成方式变更:", batchInfo?.formGenerationType);
    // 当生成方式改变时，更新状态
  }, [batchInfo?.formGenerationType]);
  
  // 处理文件上传
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 20 * 1024 * 1024) { // 20MB
        toast({
          title: "文件过大",
          description: "附件大小不能超过20M",
          variant: "destructive",
        });
        return;
      }
      
      setFileName(file.name);
      setFileUploaded(true);
      handleInputChange("申报书正文", file);
    }
  };
  
  // 触发文件选择
  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };
  
  // 正文信息在线输入模式
  const renderOnlineInputMode = () => (
    <>
      <div className="space-y-2">
        <Label htmlFor="background" className="flex items-center">
          研究背景
          <span className="text-destructive ml-1">*</span>
        </Label>
        <Textarea
          id="background"
          placeholder="请详细描述项目的研究背景"
          value={formData["研究背景"] || ""}
          onChange={(e) => handleInputChange("研究背景", e.target.value)}
          className={cn(
            "min-h-[120px]",
            validationErrors["研究背景"] && "border-destructive",
          )}
        />
        {validationErrors["研究背景"] && <p className="text-destructive text-sm mt-1">{validationErrors["研究背景"]}</p>}
      </div>

      {/* 研究目标 */}
      <div className="space-y-2">
        <Label htmlFor="goals" className="flex items-center">
          研究目标
          <span className="text-destructive ml-1">*</span>
        </Label>
        <Textarea
          id="goals"
          placeholder="请详细描述项目的研究目标"
          value={formData["研究目标"] || ""}
          onChange={(e) => handleInputChange("研究目标", e.target.value)}
          className={cn(
            "min-h-[120px]",
            validationErrors["研究目标"] && "border-destructive",
          )}
        />
        {validationErrors["研究目标"] && <p className="text-destructive text-sm mt-1">{validationErrors["研究目标"]}</p>}
      </div>

      {/* 研究内容 */}
      <div className="space-y-2">
        <Label htmlFor="content" className="flex items-center">
          研究内容
          <span className="text-destructive ml-1">*</span>
        </Label>
        <Textarea
          id="content"
          placeholder="请详细描述项目的研究内容和方法"
          value={formData["研究内容"] || ""}
          onChange={(e) => handleInputChange("研究内容", e.target.value)}
          className={cn(
            "min-h-[120px]",
            validationErrors["研究内容"] && "border-destructive",
          )}
        />
        {validationErrors["研究内容"] && <p className="text-destructive text-sm mt-1">{validationErrors["研究内容"]}</p>}
      </div>

      {/* 预期成果 */}
      <div className="space-y-2">
        <Label htmlFor="expectedResults" className="flex items-center">
          预期成果
          <span className="text-destructive ml-1">*</span>
        </Label>
        <Textarea
          id="expectedResults"
          placeholder="请详细描述项目的预期成果及其意义"
          value={formData["预期成果详情"] || ""}
          onChange={(e) => handleInputChange("预期成果详情", e.target.value)}
          className={cn(
            "min-h-[120px]",
            validationErrors["预期成果详情"] && "border-destructive",
          )}
        />
        {validationErrors["预期成果详情"] && <p className="text-destructive text-sm mt-1">{validationErrors["预期成果详情"]}</p>}
      </div>
    </>
  );
  
  // 智能协同生成模式 - 文件上传
  const renderIntelligentGenerationMode = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="flex items-center font-medium">
          申报书正文
          <span className="text-destructive ml-1">*</span>
        </Label>
      
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept=".doc,.docx,.pdf"
        onChange={handleFileUpload}
        className="hidden"
      />
      
      {validationErrors["申报书正文"] && (
        <div className="flex items-center gap-2 text-destructive">
          <AlertCircle className="h-4 w-4" />
          <p className="text-sm">请上传申报书正文文件</p>
        </div>
      )}
      
      {fileUploaded ? (
        <Card className="border shadow-sm transition-all hover:shadow-md">
          <CardContent className="p-4 flex justify-between items-center">
            <div className="flex items-center gap-2 ">
              <FileText className="h-5 w-5" />
              <span className="font-medium">{fileName}</span>
              <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                已上传
              </span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-700 hover:text-blue-800 hover:bg-blue-100 transition-colors"
                onClick={() => {
                  // 处理预览文件逻辑
                  toast({
                    title: "文件预览",
                    description: "正在准备预览，请稍候...",
                  });
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                预览
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={triggerFileUpload}
                className="text-green-700 hover:text-green-800 hover:bg-green-100 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                重新上传
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border border-dashed cursor-pointer transition-all hover:border-blue-300 hover:bg-blue-50/30" onClick={triggerFileUpload}>
          <CardContent className="flex flex-col items-center justify-center p-6 text-muted-foreground">
            <Upload className="h-8 w-8 mb-2 text-blue-500" />
            <p>点击或拖拽文件至此区域上传</p>
            <p className="text-sm mt-1">支持 .doc/.docx/.pdf 格式，附件大小不超过20M</p>
          </CardContent>
        </Card>
      )}
      
      <div className="bg-muted/50  p-4 rounded-md">
        <h4 className="text-sm font-medium mb-2  ">
          申请须知
        </h4>
        <ul className="text-sm space-y-1 text-muted-foreground ">
          <li>1. 下载申报书正文模板;</li>
          <li>2. 根据模板需要填写申报书正文;</li>
          <li>3. 离线编辑完成后转换为PDF格式;</li>
          <li>4. 上传PDF格式的申报书正文电子版(注意上传的正文需要删除封面首页);</li>
          <li>5. 填写申请信息可以在列表预览申请书草稿，提交后预览则是正式提交申请书。</li>
        </ul>
        <div className="mt-2">
          <Button variant="link" className="h-auto p-0 text-blue-600">
            <Download className="mr-1 h-4 w-4" />
            下载申报书正文模板
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* 项目信息区域 */}
      <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md">
        <div className="text-blue-500">
          <FileText className="h-5 w-5" />
        </div>
        <h3 className="text-base font-medium">正文信息</h3>
      </div>

      {/* 根据生成方式显示不同内容 */}
      {isIntelligentGeneration ? renderIntelligentGenerationMode() : renderOnlineInputMode()}
    </div>
  )
} 