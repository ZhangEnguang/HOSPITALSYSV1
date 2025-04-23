"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Upload } from "lucide-react"
import { FileUploader, UploadStatus } from "./components/file-uploader"
import { AnalysisProgress } from "./components/analysis-progress"
import { BrainCircuit, Edit, HelpCircle, Lightbulb, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
// 在import部分添加Tabs组件
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VoiceInputPanel } from "./components/voice-input-panel"
import { Mic } from "lucide-react" // 添加图标
import { toast } from "sonner"

// 修改分析步骤，在"文本提取与分析"步骤中添加 projectType 字段
const analysisSteps = [
  { name: "文档预处理", fields: [] },
  { name: "文本提取与分析", fields: ["项目名称", "项目类型", "项目分类", "项目级别"] },
  { name: "关键信息识别", fields: ["项目描述", "优先级", "开始日期", "结束日期", "预算金额"] },
  { name: "字段映射与结构化", fields: ["项目目标", "预期成果", "所属部门", "资金来源"] },
  {
    name: "表单数据生成",
    fields: ["合作单位", "关键词", "项目背景", "研究方法", "时间规划", "风险评估", "评价指标"],
  },
]

// 模拟分析结果数据 - 使用中文字段
const mockAnalysisResult = {
  项目名称: "基于深度学习的复杂场景下目标检测与跟踪关键技术研究",
  项目描述: "本项目旨在研究复杂场景下目标检测与跟踪的关键技术，提高检测精度和跟踪稳定性。",
  项目类型: "纵向",
  项目分类: "自然科学",
  项目级别: "国家级",
  优先级: "高",
  开始日期: "2024-05-01",
  结束日期: "2025-04-30",
  预算金额: "850000",
  负责人: "张三",
  团队成员: ["李四", "王五", "赵六"],
  项目目标: "1. 研究复杂场景下目标检测算法\n2. 提高目标跟踪的稳定性和精度\n3. 开发适用于实际应用的系统原型",
  预期成果: "1. 发表高水平学术论文3-5篇\n2. 申请发明专利2-3项\n3. 开发系统原型1套",
  所属部门: "计算机科学与技术学院",
  资金来源: "国家自然科学基金",
  合作单位: "清华大学、华为技术有限公司",
  关键词: "深度学习、目标检测、目标跟踪、计算机视觉",
  项目背景: "随着人工智能技术的快速发展，深度学习在计算机视觉领域取得了显著成果...",
  研究方法: "本项目将采用深度神经网络结构，结合注意力机制和多尺度特征融合...",
  时间规划: "2024年5月-7月：文献调研和算法设计\n2024年8月-12月：算法实现与优化...",
  风险评估: "算法在复杂场景下可能存在鲁棒性不足的问题\n计算资源需求较高...",
  评价指标: "通过COCO、VOC等公开数据集进行评估\n在实际应用场景中进行测试验证...",
}

export default function AIFormPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>(UploadStatus.IDLE)
  const [fileName, setFileName] = useState<string>("")
  const [progress, setProgress] = useState<number>(0)
  const [analysisProgress, setAnalysisProgress] = useState<number>(0)
  const [error, setError] = useState<string>("")
  const [analyzedFields, setAnalyzedFields] = useState<string[]>([])
  const [currentAnalysisStep, setCurrentAnalysisStep] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  // 在AIFormPage组件中添加状态
  const [activeTab, setActiveTab] = useState<string>("upload")
  const [isFillingAll, setIsFillingAll] = useState(false)
  const [currentFillingIndex, setCurrentFillingIndex] = useState(-1)

  // 监听分析进度，更新已分析字段
  useEffect(() => {
    if (uploadStatus === UploadStatus.ANALYZING) {
      // 确定当前处于哪个分析步骤
      const stepIndex = Math.min(Math.floor(analysisProgress / 20), analysisSteps.length - 1)

      if (stepIndex !== currentAnalysisStep) {
        setCurrentAnalysisStep(stepIndex)

        // 如果进入新步骤，添加该步骤的字段到已分析字段列表
        if (stepIndex > 0) {
          const previousStepFields = analysisSteps[stepIndex - 1].fields
          if (previousStepFields.length > 0) {
            // 每隔一小段时间添加一个字段，产生滚动效果
            let fieldIndex = 0
            const addFieldInterval = setInterval(() => {
              if (fieldIndex < previousStepFields.length) {
                setAnalyzedFields((prev) => [...prev, previousStepFields[fieldIndex]])
                fieldIndex++
              } else {
                clearInterval(addFieldInterval)
              }
            }, 300)
          }
        }
      }
    }
  }, [analysisProgress, uploadStatus, currentAnalysisStep])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    setUploadStatus(UploadStatus.UPLOADING)
    setProgress(0)
    setError("")
    setAnalyzedFields([])
    setCurrentAnalysisStep(0)

    // Simulate file upload progress
    const uploadInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(uploadInterval)
          setUploadStatus(UploadStatus.ANALYZING)
          simulateAnalysis()
          return 100
        }
        return prev + 5
      })
    }, 100)
  }

  const simulateAnalysis = () => {
    setAnalysisProgress(0)

    // Simulate analysis progress
    const analysisInterval = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev >= 100) {
          clearInterval(analysisInterval)
          setUploadStatus(UploadStatus.COMPLETED)

          // 分析完成后，跳转到结果页面
          setTimeout(() => {
            // 将分析结果存储到localStorage，以便在结果页面获取
            localStorage.setItem("analysisResult", JSON.stringify(mockAnalysisResult))
            // 跳转到结果页面
            router.push("/projects/ai-form/result")
          }, 1000)

          return 100
        }
        return prev + 2
      })
    }, 100)
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleCancel = () => {
    setUploadStatus(UploadStatus.IDLE)
    setFileName("")
    setProgress(0)
    setAnalysisProgress(0)
    setError("")
    setAnalyzedFields([])
    setCurrentAnalysisStep(0)
  }

  // 渲染分析中的字段滚动列表
  const renderAnalyzedFieldsList = () => {
    return null // 不显示已识别字段列表
  }

  // 添加处理填充所有字段的函数
  const handleFillAll = () => {
    setIsFillingAll(true)

    // 模拟逐个填充字段的过程
    const fields = Object.keys(mockAnalysisResult)
    let index = 0

    const fillInterval = setInterval(() => {
      if (index < fields.length) {
        setCurrentFillingIndex(index)

        // 延迟一点时间再标记为已填充，模拟填充过程
        setTimeout(() => {
          // 这里只是模拟填充过程，实际应用中需要真正填充表单
        }, 300)

        index++
      } else {
        clearInterval(fillInterval)
        setIsFillingAll(false)
        setCurrentFillingIndex(-1)

        toast({
          title: "填充完成",
          description: "所有识别的字段已成功填充",
          duration: 3000,
        })

        // 模拟填充完成后跳转到结果页面
        setTimeout(() => {
          localStorage.setItem("analysisResult", JSON.stringify(mockAnalysisResult))
          router.push("/projects/ai-form/result")
        }, 1000)
      }
    }, 600)
  }

  return (
    <div
      className="flex-1 overflow-auto p-4 md:p-6"
      style={{
        backgroundImage:
          'url("https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%E6%9C%AA%E6%A0%87%E9%A2%98-2-QhJkJ1usJohAB3x4LPVLv5qN3KVabl.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="w-full max-w-full 2xl:max-w-[1440px] 2xl:mx-auto">
        {/* 页面标题 */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-full flex justify-between items-center mb-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-red-600">
                AI智能填充
              </h1>
              <Badge variant="outline" className="ml-3 bg-primary/10 hover:bg-primary/20 transition-colors">
                AI辅助
              </Badge>
            </div>
            <div className="w-10"></div> {/* 占位元素，保持标题居中 */}
          </div>
        </div>

        {/* 左右两栏布局 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 左侧栏 - 占据2/3宽度 */}
          <div className="md:col-span-2 space-y-6">
            {/* 左侧 - 上传界面 */}
            <Card className="border-muted/50 overflow-hidden relative bg-white/90 dark:bg-black/80">
              <CardHeader className="pb-3 relative">
                <CardTitle className="flex items-center">
                  <Upload className="h-5 w-5 mr-2 text-primary" />
                  AI智能填充
                </CardTitle>
                <CardDescription>选择合适的方式，AI将自动提取关键信息</CardDescription>
              </CardHeader>
              <CardContent className="pt-4 relative">
                <Tabs defaultValue="upload" value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid grid-cols-2 mb-6">
                    <TabsTrigger value="upload" className="flex items-center gap-1.5">
                      <Upload className="h-4 w-4" />
                      <span>文件上传</span>
                    </TabsTrigger>
                    <TabsTrigger value="voice" className="flex items-center gap-1.5">
                      <Mic className="h-4 w-4" />
                      <span>语音录入</span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="upload" className="mt-0">
                    <div
                      className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg transition-all duration-300 ${
                        isHovering
                          ? "border-primary/50 bg-primary/5 shadow-md"
                          : "border-muted-foreground/20 bg-muted/5 hover:bg-muted/10"
                      }`}
                      onMouseEnter={() => setIsHovering(true)}
                      onMouseLeave={() => setIsHovering(false)}
                      onClick={handleUploadClick}
                    >
                      {uploadStatus === UploadStatus.IDLE ? (
                        <>
                          <motion.div
                            className="mb-4 p-4 rounded-full bg-primary/10"
                            animate={{
                              y: [0, -8, 0],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Number.POSITIVE_INFINITY,
                              ease: "easeInOut",
                            }}
                          >
                            <Upload className="h-8 w-8 text-primary" />
                          </motion.div>
                          <h3 className="text-lg font-medium mb-2">选择或拖放文件</h3>
                          <p className="text-sm text-muted-foreground text-center mb-4">
                            支持PDF、Word和文本文件，大小不超过20MB
                          </p>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf,.doc,.docx,.txt"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                          <Button
                            onClick={(e) => {
                              e.stopPropagation() // 防止触发外层div的点击事件
                              handleUploadClick()
                            }}
                            className="bg-primary hover:bg-primary/90"
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            选择文件
                          </Button>
                        </>
                      ) : (
                        <FileUploader
                          uploadStatus={uploadStatus}
                          fileName={fileName}
                          progress={progress}
                          error={error}
                          onFileChange={handleFileChange}
                          onCancel={handleCancel}
                          onUploadClick={handleUploadClick}
                        />
                      )}
                    </div>

                    {uploadStatus === UploadStatus.ANALYZING && (
                      <AnalysisProgress
                        analysisProgress={analysisProgress}
                        currentAnalysisStep={currentAnalysisStep}
                        analysisSteps={analysisSteps}
                        renderAnalyzedFieldsList={renderAnalyzedFieldsList}
                      />
                    )}
                  </TabsContent>

                  <TabsContent value="voice" className="mt-0">
                    <div className="min-h-[400px] flex items-center justify-center">
                      <VoiceInputPanel handleFillAll={handleFillAll} />
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* 添加使用流程简要说明 */}
            <motion.div
              className="flex flex-col space-y-4 p-4 border rounded-lg border-muted/50 bg-white/90 dark:bg-black/80"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="font-medium text-lg flex items-center text-primary">
                <BrainCircuit className="h-5 w-5 mr-2" />
                智能填充流程
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-muted-foreground">
                <div className="flex items-start">
                  <div className="flex items-center justify-center shrink-0 w-7 h-7 rounded-full border border-muted bg-muted/30 mr-2 text-primary">
                    1
                  </div>
                  <p>
                    {activeTab === "upload"
                      ? "上传项目文档，系统会自动解析文件内容"
                      : "使用语音描述项目信息，AI会实时转录并分析"}
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="flex items-center justify-center shrink-0 w-7 h-7 rounded-full border border-muted bg-muted/30 mr-2 text-primary">
                    2
                  </div>
                  <p>AI会分析提取关键信息并填充到表单字段</p>
                </div>
                <div className="flex items-start">
                  <div className="flex items-center justify-center shrink-0 w-7 h-7 rounded-full border border-muted bg-muted/30 mr-2 text-primary">
                    3
                  </div>
                  <p>您可以审核并修改AI提取的信息</p>
                </div>
                <div className="flex items-start">
                  <div className="flex items-center justify-center shrink-0 w-7 h-7 rounded-full border border-muted bg-muted/30 mr-2 text-primary">
                    4
                  </div>
                  <p>确认无误后提交项目信息完成填报</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* 右侧栏 - 占据1/3宽度 */}
          <div className="md:col-span-1 space-y-6">
            {/* 右侧 - 说明内容 */}
            <Card className="border-muted/50 bg-white/90 dark:bg-black/80">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center">
                  <HelpCircle className="h-5 w-5 mr-2 text-primary" />
                  使用说明
                </CardTitle>
                <CardDescription>了解如何使用AI辅助填报功能</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* 小贴士 - 移到顶部并改为橙色 */}
                <motion.div
                  className="w-full bg-gradient-to-r from-orange-100 to-orange-50 dark:from-orange-900/30 dark:to-orange-800/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800/30"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="font-medium mb-2 flex items-center text-orange-600 dark:text-orange-400">
                    <Lightbulb className="h-4 w-4 mr-2" />
                    小贴士
                  </h3>
                  <p className="text-sm text-orange-700/80 dark:text-orange-300/80">
                    {activeTab === "upload"
                      ? "上传结构化的文档（如项目申报书、任务书）可以提高AI识别的准确率。"
                      : "语音录入时，请清晰地描述项目信息，可以按照项目名称、类型、描述等顺序进行。"}
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <h3 className="font-medium mb-3 flex items-center text-primary/90">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    注意事项
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground pl-2">
                    {activeTab === "upload" ? (
                      <>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary/70 mr-2 mt-1.5"></div>
                          <span>文件大小不超过20MB</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary/70 mr-2 mt-1.5"></div>
                          <span>支持PDF、Word和文本文件格式</span>
                        </li>
                      </>
                    ) : (
                      <>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary/70 mr-2 mt-1.5"></div>
                          <span>请在安静的环境中进行录音</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary/70 mr-2 mt-1.5"></div>
                          <span>语音录入需要浏览器麦克风权限</span>
                        </li>
                      </>
                    )}
                    <li className="flex items-start">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/70 mr-2 mt-1.5"></div>
                      <span>AI提取的信息可能需要人工审核和修改</span>
                    </li>
                  </ul>
                </motion.div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4 pt-0 pb-4">
                <Button variant="outline" className="w-full" onClick={() => router.push("/projects/manual-form")}>
                  <Edit className="h-4 w-4 mr-2" />
                  切换到手动填报
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

