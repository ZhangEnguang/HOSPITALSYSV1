"use client"

import React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { X, Search, Filter, ChevronDown, Star, Send, FileUp, Paperclip } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

// 智能体类型定义
type AgentType = "专用型" | "通用型"

// 智能体数据结构
interface Agent {
  id: string
  title: string
  description: string
  icon: string
  type: AgentType
  tags: string[]
  isNew?: boolean
  isFavorite?: boolean
  useFrequency: number
  addedDate: Date
}

// 用户角色类型
type UserRole = "系统管理员" | "业务办理员" | "科研人员" | "学生"

function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [showSpeech, setShowSpeech] = useState(false)
  const [showWelcome, setShowWelcome] = useState(true)
  const [inputValue, setInputValue] = useState("")
  const [messages, setMessages] = useState<{ type: "user" | "bot"; content: string }[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const drawerRef = useRef<HTMLDivElement>(null)
  const robotRef = useRef<HTMLDivElement>(null)
  // 在state部分添加一个新的状态变量来跟踪是否是真正的点击
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [dragStartPosition, setDragStartPosition] = useState({ x: 0, y: 0 })
  const [hasMoved, setHasMoved] = useState(false)
  const [activeTab, setActiveTab] = useState<"chat" | "recommend">("chat")

  // 新增状态
  const [userRole, setUserRole] = useState<UserRole>("科研人员")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [agents, setAgents] = useState<Agent[]>([])
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)

  // 删除原有的常用语状态变���
  const [isRecording, setIsRecording] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 分类列表
  const categories = ["全部", "数据管理", "审批", "申报", "分析", "检索", "提醒"]

  // 文献分析助手的特殊回复
  const handleLiteratureAssistantResponse = useCallback((userMessage: string) => {
    // 检查是否包含问题模板1
    if (
      userMessage.includes("请对比文献中的轻量化网络") ||
      userMessage.includes("轻量化网络") ||
      userMessage.includes("CNN模型的性能差异")
    ) {
      return `📊 轻量化网络与经典CNN对比分析

已收到您的请求。以下是轻量化网络与经典CNN的对比分析：

### 最新研究进展
▸ 混合精度量化技术使轻量化网络在INT8精度下仅损失0.5%准确率，同时提升推理速度2.5倍
▸ 神经架构搜索(NAS)自动优化的MobileNetV3-NAS变体在相同参数量下提升准确率1.2%
▸ 新型硬件感知设计使ShuffleNetV3在边缘AI芯片上能耗降低40%，同时保持性能
▸ 轻量化网络在保持可接受精度（较经典CNN如ResNet-50仅降低0.7-3.1%）的前提下，参数量减少80%-87%
▸ 推理速度提升1.8-2倍，典型代表MobileNetV3以5.4M参数实现75.6% ImageNet精度（58 FPS）

### 应用案例分析
▸ 自动驾驶辅助系统中，轻量化模型实现30fps实时目标检测，延迟降低65%
▸ 移动AR应用中，优化后的MobileNetV3实现单帧处理时间<20ms，满足交互需求
▸ 智能监控系统中，边缘部署的ShuffleNetV2降低带宽需求90%，同时保持检测准确率
▸ 医疗影像分析中，轻量化模型使设备端实时诊断成为可能，无需云端处理

[查看完整技术报告] [导出对比数据]`
    }

    // 检查是否包含问题模板2
    if (userMessage.includes("知识蒸馏") || userMessage.includes("模型压缩")) {
      return `🔍 知识蒸馏技术应用指南

知识蒸馏应用于图像识别模型压缩的方法如下：

### 1. 教师-学生架构设置
<div class="flex items-start gap-2 my-2 ml-4">
  <span class="text-blue-500 mt-1"><Cpu className="h-4 w-4" /></span>
  <span>教师网络：使用预训练的大型模型（如ResNet-152）</span>
</div>
<div class="flex items-start gap-2 my-2 ml-4">
  <span class="text-green-500 mt-1"><Cpu className="h-4 w-4" /></span>
  <span>学生网络：轻量化模型（如MobileNet或自定义小型CNN）</span>
</div>

### 2. 蒸馏损失函数设计
<div class="flex items-start gap-2 my-2 ml-4">
  <span class="text-amber-500 mt-1"><Workflow className="h-4 w-4" /></span>
  <span>软标签损失：KL散度(student_logits/T, teacher_logits/T), T为温度参数（通常2-5）</span>
</div>
<div class="flex items-start gap-2 my-2 ml-4">
  <span class="text-amber-500 mt-1"><Workflow className="h-4 w-4" /></span>
  <span>硬标签损失：交叉熵(student_output, ground_truth)</span>
</div>
<div class="flex items-start gap-2 my-2 ml-4">
  <span class="text-amber-500 mt-1"><Workflow className="h-4 w-4" /></span>
  <span>总损失：α·软标签损失 + (1-α)·硬标签损失，α为平衡系数</span>
</div>

### 3. 特征图蒸馏
<div class="flex items-start gap-2 my-2 ml-4">
  <span class="text-purple-500 mt-1"><Layers className="h-4 w-4" /></span>
  <span>在中间层添加适配器将教师特征映射到学生特征空间</span>
</div>
<div class="flex items-start gap-2 my-2 ml-4">
  <span class="text-purple-500 mt-1"><Layers className="h-4 w-4" /></span>
  <span>最小化教师与学生特征图的L2距离或相关性差异</span>
</div>

### 4. 实验效果
<div class="flex items-start gap-2 my-2 ml-4">
  <span class="text-green-500 mt-1"><TrendingUp className="h-4 w-4" /></span>
  <span>参数量减少75%的情况下，精度损失控制在2-3%以内</span>
</div>
<div class="flex items-start gap-2 my-2 ml-4">
  <span class="text-green-500 mt-1"><TrendingUp className="h-4 w-4" /></span>
  <span>推理速度提升3-4倍，模型大小减少70%以上</span>
</div>

<div class="bg-blue-50 p-3 rounded-md mt-3 border-l-4 border-blue-500">
  <div class="flex items-start gap-2">
    <span class="text-blue-600 mt-1"><Lightbulb className="h-4 w-4" /></span>
    <span>这种方法特别适合部署到移动设备和嵌入式系统中的图像识别应用</span>
  </div>
</div>

[查看代码示例] [获取预训练模型]`
    }

    // 默认回复
    return null
  }, [])

  // 初始化智能体数据
  useEffect(() => {
    // 模拟从API获取数据
    const adminAgents: Agent[] = [
      {
        id: "1",
        title: "权限管理助手",
        description: "快速配置用户权限，批量处理权限申请",
        icon: "🔐",
        type: "专用型",
        tags: ["新用户入职", "权限变更"],
        isFavorite: true,
        useFrequency: 87,
        addedDate: new Date(2023, 10, 15),
      },
      {
        id: "2",
        title: "系统日志分析Agent",
        description: "自动分析系统日志，检测异常行为",
        icon: "📊",
        type: "专用型",
        tags: ["安全审计", "故障排查"],
        useFrequency: 65,
        addedDate: new Date(2023, 11, 20),
      },
      {
        id: "3",
        title: "数据备份机器人",
        description: "定时备份关键数据，确保数据安全",
        icon: "💾",
        type: "专用型",
        tags: ["系统升级前备份", "定期备份"],
        useFrequency: 42,
        addedDate: new Date(2024, 0, 5),
      },
      {
        id: "4",
        title: "语音/文本交互助手",
        description: "支持多模态交互，提供智能回复",
        icon: "🎤",
        type: "通用型",
        tags: ["新手引导", "日常交流"],
        isFavorite: true,
        useFrequency: 120,
        addedDate: new Date(2023, 9, 10),
      },
      {
        id: "5",
        title: "批量操作机器人",
        description: "一键执行批量任务，提高工作效率",
        icon: "🤖",
        type: "通用型",
        tags: ["批量审核", "数据处理"],
        useFrequency: 95,
        addedDate: new Date(23, 8, 25),
      },
    ]

    const businessAgents: Agent[] = [
      {
        id: "6",
        title: "项目申报助手",
        description: "自动校验申报书格式，推荐模板",
        icon: "📝",
        type: "专用型",
        tags: ["项目集中申报期", "材料准备"],
        isFavorite: true,
        useFrequency: 98,
        addedDate: new Date(2023, 10, 5),
      },
      {
        id: "7",
        title: "经费合规校验Agent",
        description: "检查经费使用合规性，提供优化建议",
        icon: "💰",
        type: "专用型",
        tags: ["季度审计", "报销审核"],
        useFrequency: 76,
        addedDate: new Date(2023, 11, 12),
      },
      {
        id: "8",
        title: "数据可视化生成器",
        description: "一键生成专业数据图表，支持多种格式",
        icon: "📊",
        type: "通用型",
        tags: ["汇报材料制作", "数据展示"],
        isFavorite: true,
        useFrequency: 110,
        addedDate: new Date(2023, 9, 20),
      },
      {
        id: "9",
        title: "合同审查助手",
        description: "智能识别合同风险点，提供修改建议",
        icon: "📄",
        type: "专用型",
        tags: ["校企合作签约", "合同管理"],
        useFrequency: 45,
        addedDate: new Date(2024, 0, 15),
        isNew: true,
      },
      {
        id: "10",
        title: "跨模块检索工具",
        description: "一站式搜索多个系统模块的数据",
        icon: "🔍",
        type: "通用型",
        tags: ["跨模块查询", "信息检索"],
        useFrequency: 88,
        addedDate: new Date(2023, 8, 30),
      },
    ]

    const researcherAgents: Agent[] = [
      {
        id: "11",
        title: "文献分析助手",
        description: "智能分析文献关键内容，生成研究摘要",
        icon: "📚",
        type: "专用型",
        tags: ["文献综述", "研究方向分析"],
        isFavorite: true,
        useFrequency: 105,
        addedDate: new Date(2023, 10, 8),
      },
      {
        id: "12",
        title: "实验数据处理Agent",
        description: "自动清洗实验数据，生成分析报告",
        icon: "🧪",
        type: "专用型",
        tags: ["实验结果分析", "数据处理"],
        useFrequency: 92,
        addedDate: new Date(2023, 11, 18),
      },
      {
        id: "13",
        title: "科研项目管理助手",
        description: "跟踪项目进度，智能提醒关键节点",
        icon: "📅",
        type: "专用型",
        tags: ["项目管理", "进度跟踪"],
        isFavorite: true,
        useFrequency: 115,
        addedDate: new Date(2023, 9, 25),
      },
      {
        id: "14",
        title: "论文写作助手",
        description: "智能润色论文语言，检查格式规范",
        icon: "✍️",
        type: "专用型",
        tags: ["论文写作", "格式检查"],
        useFrequency: 88,
        addedDate: new Date(2024, 1, 10),
        isNew: true,
      },
      {
        id: "15",
        title: "学术合作推荐器",
        description: "基于研究方向智能推荐潜在合作伙伴",
        icon: "🤝",
        type: "专用型",
        tags: ["学术合作", "团队组建"],
        useFrequency: 65,
        addedDate: new Date(2024, 0, 20),
        isNew: true,
      },
    ]

    // 根据用户角色选择对应的智能体列表
    let roleAgents: Agent[] = []
    switch (userRole) {
      case "系统管理员":
        roleAgents = adminAgents
        break
      case "业务办理员":
        roleAgents = businessAgents
        break
      case "科研人员":
      default:
        roleAgents = researcherAgents
        break
    }

    setAgents(roleAgents)
  }, [userRole])

  const [robotHover, setRobotHover] = useState(false)

  const handleRobotHover = () => {
    if (!isDragging) {
      setShowSpeech(true)
    }
  }

  const handleRobotLeave = () => {
    setShowSpeech(false)
  }

  // 初始化欢迎消息和气泡
  useEffect(() => {
    if (showWelcome) {
      setMessages([{ type: "bot", content: "张教授您好！智能助手小易已就位，期待与您协同工作" }])
      setShowWelcome(false)

      // 显示欢迎气泡
      setTimeout(() => {
        setShowSpeech(true)

        // 3秒后隐藏消息
        setTimeout(() => {
          setShowSpeech(false)
        }, 3000)
      }, 1000)
    }
  }, [showWelcome])

  // 点击外部关闭抽屉
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  // 自动滚动到最新消息
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // 修改handleMouseDown函数，记录初始点击位置
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault() // Prevent default behavior
    e.stopPropagation() // Prevent triggering click event

    if (robotRef.current) {
      setIsDragging(true)
      setHasMoved(false) // 重置移动标志

      // Get the current position of the robot element
      const rect = robotRef.current.getBoundingClientRect()

      // 记录初始点击位置
      setDragStartPosition({
        x: e.clientX,
        y: e.clientY,
      })

      // Calculate the offset between mouse position and element top-left corner
      setPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }
  }

  // 修改handleMouseMove函数，设置移动标志
  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && robotRef.current) {
      // 设置移动标志，表示已经拖动
      setHasMoved(true)

      // Calculate the new position based on mouse movement
      const newLeft = e.clientX - position.x
      const newTop = e.clientY - position.y

      // Apply constraints to keep the robot within the viewport
      const maxX = window.innerWidth - robotRef.current.offsetWidth
      const maxY = window.innerHeight - robotRef.current.offsetHeight

      const constrainedLeft = Math.max(0, Math.min(newLeft, maxX))
      const constrainedTop = Math.max(0, Math.min(newTop, maxY))

      // Update the robot position
      robotRef.current.style.right = "auto"
      robotRef.current.style.bottom = "auto"
      robotRef.current.style.left = `${constrainedLeft}px`
      robotRef.current.style.top = `${constrainedTop}px`
    }
  }

  // 修改handleMouseUp函数，判断是否为拖动还是点击
  const handleMouseUp = (e: MouseEvent) => {
    // 如果是拖动结束，不触发点击事件
    if (isDragging) {
      setIsDragging(false)
    }
  }

  // Add global mouse event listeners for dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, position])

  // 修改toggleOpen函数，只在真正的点击时触发
  const toggleOpen = (e: React.MouseEvent) => {
    // 只有当不是拖动状态且没有移动时，才视为点击
    if (!isDragging && !hasMoved) {
      setIsOpen(!isOpen)
    }
  }

  // 文献分析助手的特殊处理
  const isLiteratureAssistantActive = useCallback(() => {
    // 检查最近的消息是否包含文献分析助手的启动信息
    const recentMessages = messages.slice(-3)
    return recentMessages.some(
      (msg) =>
        msg.type === "bot" &&
        (msg.content.includes("文献分析助手已启动") ||
          msg.content.includes("请上传您需要分析的文献文件") ||
          msg.content.includes("您可以点击以下问题模板")),
    )
  }, [messages])

  // Modify the launchAgent function to add special handling for the System Log Analysis Agent (ID: "2")
  const launchAgent = (agent: Agent) => {
    setActiveTab("chat")

    // Special handling for Permission Management Assistant
    if (agent.id === "1") {
      setMessages([
        ...messages,
        {
          type: "user",
          content: `启动${agent.title}`,
        },
        {
          type: "bot",
          content: `权限管理助手已启动，我已完成全系统权限拓扑扫描：
✅ 当前权限分布

生效角色模板：12类（含「涉密数据处理员」等4类高危角色）

异常权限：3个账户存在跨项目数据访问冲突

过期权限：47个毕业生账户未冻结

🚀 快捷指令清单
① 【精准赋权】基于角色/项目的权限配置
② 【批量操作】多账户权限同步/回收
③ 【冲突检测】权限重叠自动分析
④ 【紧急熔断】高危权限实时回收
⑤ 【生命周期】权限过期自动提醒`,
        },
      ])
    }
    // Special handling for System Log Analysis Agent
    else if (agent.id === "2") {
      setMessages([
        ...messages,
        {
          type: "user",
          content: `启动${agent.title}`,
        },
        {
          type: "bot",
          content: `系统日志分析Agent已启动，我已完成分布式日志节点的智能基线比对，检测到当前系统覆盖：
23台核心服务器
8组科研数据库集群
142台终端设备

🔍 快捷操作清单：
① 【健康扫描】检查当前科研管理系统日志状态
② 【异常处理】异常登录处理
③ 【紧急预警】紧急事件响应`,
        },
      ])
    } else {
      setMessages([
        ...messages,
        {
          type: "user",
          content: `启动${agent.title}`,
        },
        {
          type: "bot",
          content: `${agent.title}已启动，请问有什么可以帮助您的？`,
        },
      ])
    }
  }

  // Modify the handleSendMessage function to add special responses for System Log Analysis Agent commands
  const handleSendMessage = useCallback(() => {
    // Check if there is text or files to send
    if (inputValue.trim() || uploadedFiles.length > 0) {
      // Build message content
      let messageContent = inputValue.trim()

      // If there are files, add file information to the message
      if (uploadedFiles.length > 0) {
        const fileNames = uploadedFiles.map((file) => file.name).join(", ")
        if (messageContent) {
          messageContent += `\n\n附件: ${fileNames}`
        } else {
          messageContent = `上传文件: ${fileNames}`
        }
      }

      // Send user message
      setMessages([...messages, { type: "user", content: messageContent }])

      // 为每种提示语模板设计固定的虚拟回复
      // 1. 数据统计与报告生成模板
      if (messageContent.includes("请为指定时间段内的") && messageContent.includes("生成一份简要统计报表")) {
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              type: "bot",
              content: `📊 报告已生成

已为您生成2023年1月至2023年12月的科研成果总结报告，主要内容如下：

### 科研产出概览
▸ 发表SCI论文：32篇（较去年增长15%）
▸ 授权专利：8项（较去年增长33%）
▸ 软件著作权：12项
▸ 科研项目：新立项14项，结题9项

### 重点成果
▸ 在Nature子刊发表论文2篇，影响因子均超过15
▸ "人工智能辅助科研决策系统"获省级科技进步二等奖
▸ 量子计算研究团队获批国家重点研发计划项目1项

### 经费使用情况
▸ 总预算执行率：78.5%
▸ 设备购置：1240万元（占比42%）
▸ 材料费：560万元（占比19%）
▸ 测试化验加工费：380万元（占比13%）
▸ 差旅费：210万元（占比7%）
▸ 其他费用：560万元（占比19%）

您可以点击下方链接查看或下载完整报告：

[查看完整报告] [导出Excel数据] [生成演示PPT]`,
            },
          ])
        }, 1500)
      }
      // 2. 快速查询科研人员项目状态模板
      else if (messageContent.includes("请查询科研人员") && messageContent.includes("项目状态")) {
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              type: "bot",
              content: `📋 科研人员项目状态查询结果

已查询到张明教授的项目状态信息：

### 进行中项目（3个）
1. **人工智能辅助科研决策系统**
   ▸ 进度：85%（正常）
   ▸ 经费使用：650万/1000万（65%）
   ▸ 近期里程碑：系统测试阶段（预计下周完成）
   ▸ 团队成员：12人

2. **量子计算关键算法研究**
   ▸ 进度：42%（⚠️ 落后计划15%）
   ▸ 经费使用：280万/800万（35%）
   ▸ 近期里程碑：算法优化（6月30日截止）
   ▸ 团队成员：8人

3. **新型材料计算模拟平台**
   ▸ 进度：60%（正常）
   ▸ 经费使用：420万/500万（⚠️ 超支风险）
   ▸ 近期里程碑：模拟引擎开发（已完成）
   ▸ 团队成员：6人

### 待办事项
▸ "量子计算关键算法研究"项目进度评审会议（明天14:00）
▸ "新型材料计算模拟平台"经费调整申请（本周五截止）

需要为您安排项目组会议或调整项目计划吗？`,
            },
          ])
        }, 1000)
      }
      // 3. 权限批量调整模板
      else if (
        messageContent.includes("将【") &&
        messageContent.includes("】的权限从【") &&
        messageContent.includes("调整为【")
      ) {
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              type: "bot",
              content: `📊 权限变更已执行

▸ 生效时间：2025-03-22
▸ 调整人员：李明（工号1001）、王芳（工号1003）
▸ 权限变更：项目申报员 → 项目审核员
▸ 影响范围：12个项目，3个系统模块

✅ 权限变更详情：
- 新增：项目审批权限、经费调整审核权限
- 移除：项目申报表编辑权限
- 保留：项目查看权限、基础数据访问权限

❗ 请确认上述信息无误，变更将在24小时内同步至所有子系统。
是否需要通知相关人员此次权限变更？`,
            },
          ])
        }, 1000)
      }
      // 4. 逾期任务提醒模板
      else if (
        messageContent.includes("向【") &&
        messageContent.includes("】发送提醒：") &&
        messageContent.includes("逾期将关闭入口")
      ) {
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              type: "bot",
              content: `⏰ 提醒已发送至指定部门

▸ 接收范围：物理系（32人）、生物系（28人）
▸ 提醒内容：请在2024-08-15 17:00前完成国家自然基金申报书提交
▸ 提醒方式：系统站内信+短信
▸ 发送状态：✅ 成功送达：60人 | 失败：0人

📅 当前完成情况：
- 物理系：已提交12份，待提交20份
- 生物系：已提交8份，待提交20份

已设置倒计时看板和自动提醒：
- 截止前3天：未提交人员将收到每日提醒
- 截止前1天：部门负责人将收到汇总提醒

[查看实时提交状态] [修改提醒设置] [导出未提交名单]`,
            },
          ])
        }, 1000)
      }
      // 文献分析助手的特殊处理
      else if (isLiteratureAssistantActive()) {
        // 检查是否是上传文件的情况
        if (uploadedFiles.length > 0) {
          // 文献分析助手对文件上传的特殊回复
          setTimeout(() => {
            setMessages((prev) => [
              ...prev,
              {
                type: "bot",
                content: `📚 文献分析结果
基于您提供的文献内容，以下是核心研究内容与创新点的结构化摘要：

### 摘要
当前基于深度学习的图像识别算法研究聚焦于网络架构优化与计算效率提升两大方向。主要创新包括：

▸ 联合训练与多模型融合：通过受限波尔茨曼机（RBM）与判别子空间准则的联合训练，增强特征判别性；将CNN与字典模型（MLR/CFV）整合，提升场景识别与领域迁移性能。
▸ 轻量化与注意力机制：采用MobileNetV3、ECA-Net等轻量化网络减少参数量（如参数量降低35%），并引入通道注意力模块动态分配特征权重。
▸ 数据增强与正则化技术：通过旋转、缩放、颜色变换等数据增强策略提升泛化能力，结合Dropout和批归一化抑制过拟合。
▸ 模型压缩与迁移学习：利用知识蒸馏将复杂教师网络的知识迁移至轻量学生网络，并基于预训练模型（如ImageNet）加速特定任务收敛。`,
              },
            ])

            // 添加问题模板，在文件分析结果后
            setTimeout(() => {
              setMessages((prev) => [
                ...prev,
                {
                  type: "bot",
                  content: `💡 深入分析选项

您可以点击以下选项获取更详细的分析：

1. 「请对比文献中的轻量化网络（如MobileNetV3、ShuffleNet）与经典CNN模型的性能差异」

2. 「如何将知识蒸馏技术应用于图像识别模型压缩？」`,
                },
              ])
            }, 500)
          }, 1000)
        }
      }
      // 其他情况的通用回复
      else {
        // 模拟AI回复（通用逻辑）
        setTimeout(() => {
          let response = "正在处理您的请求，请稍候..."

          if (uploadedFiles.length > 0) {
            response = `已收到您上传的${uploadedFiles.length}个文件`
            if (inputValue.trim()) {
              response += "和相关说明"
            }
            response += "，正在处理中..."
          } else if (inputValue.includes("项目") || inputValue.includes("申报")) {
            response =
              "您有3个进行中的项目，其中'人工智能辅助科研决策系统'项目进度已达到85%，预计下周完成。需要我为您安排项目组会议吗？"
          } else if (inputValue.includes("经费") || inputValue.includes("预算")) {
            response =
              "您的'人工智能辅助科研决策系统'项目经费使用率为65%，剩余预算25万元。本月有3笔报销待审批，需要我为您展示详细信息吗？"
          } else if (inputValue.includes("待办") || inputValue.includes("任务")) {
            response =
              "您有12条紧急待办，其中3项今日截止。最紧急的是'经费审批'任务，建议您优先处理。需要我为您展示详细列表吗？"
          }

          setMessages((prev) => [...prev, { type: "bot", content: response }])
        }, 1000)
      }

      // Clear input and file list
      setInputValue("")
      setUploadedFiles([])
    }
  }, [inputValue, uploadedFiles, messages, isLiteratureAssistantActive])

  // Modify the formatMessageContent function to make the quick operation list items clickable
  const formatMessageContent = useCallback((content: string) => {
    if (!content) return content

    // 特殊处理文献分析助手的问题模板
    if (content.includes("「请对比文献中的轻量化网络") || content.includes("「如何将知识蒸馏技术")) {
      return content.replace(
        /「([^」]+)」/g,
        "<div class=\"text-blue-600 cursor-pointer hover:text-blue-700 hover:bg-blue-50 p-2 rounded-lg my-1 transition-colors\" onclick=\"document.dispatchEvent(new CustomEvent('clickTemplate', {detail: '$1'}))\">「$1」</div>",
      )
    }

    // Add special handling for Permission Management Assistant quick command list
    if (content.includes("🚀 快捷指令清单")) {
      content = content.replace(
        /①\s*【精准赋权】基于角色\/项目的权限配置/g,
        '<div class="cursor-pointer text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-2 rounded-lg my-1 transition-colors flex items-center gap-2" onclick="document.dispatchEvent(new CustomEvent(\'clickPermissionOption\', {detail: \'为「量子计算组」配置初始权限，要求：可访问QC2024项目数据库、禁止导出实验原始数据、组长拥有审批权限。\'}))"><span class="bg-blue-100 text-blue-600 w-6 h-6 rounded-full flex items-center justify-center text-sm">①</span><span>【精准赋权】基于角色/项目的权限配置</span></div>',
      )
      content = content.replace(
        /②\s*【批量操作】多账户权限同步\/回收/g,
        '<div class="cursor-pointer text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-2 rounded-lg my-1 transition-colors flex items-center gap-2" onclick="document.dispatchEvent(new CustomEvent(\'clickPermissionOption\', {detail: \'批量回收2025届毕业生在项目。\'}))"><span class="bg-blue-100 text-blue-600 w-6 h-6 rounded-full flex items-center justify-center text-sm">②</span><span>【批量操作】多账户权限同步/回收</span></div>',
      )
      content = content.replace(
        /③\s*【冲突检测】权限重叠自动分析/g,
        '<div class="cursor-pointer text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-2 rounded-lg my-1 transition-colors flex items-center gap-2" onclick="document.dispatchEvent(new CustomEvent(\'clickPermissionOption\', {detail: \'检查用户「ChenXia@2025」的权限冲突。\'}))"><span class="bg-blue-100 text-blue-600 w-6 h-6 rounded-full flex items-center justify-center text-sm">③</span><span>【冲突检测】权限重叠自动分析</span></div>',
      )
      content = content.replace(
        /④\s*【紧急熔断】高危权限实时回收/g,
        '<div class="cursor-pointer text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-2 rounded-lg my-1 transition-colors flex items-center gap-2" onclick="document.dispatchEvent(new CustomEvent(\'clickPermissionOption\', {detail: \'立即禁用「ZhangWei」账户的所有高危权限！\'}))"><span class="bg-blue-100 text-blue-600 w-6 h-6 rounded-full flex items-center justify-center text-sm">④</span><span>【紧急熔断】高危权限实时回收</span></div>',
      )
      content = content.replace(
        /⑤\s*【生命周期】权限过期自动提醒/g,
        '<div class="cursor-pointer text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-2 rounded-lg my-1 transition-colors flex items-center gap-2" onclick="document.dispatchEvent(new CustomEvent(\'clickPermissionOption\', {detail: \'检测到即将过期权限\'}))"><span class="bg-blue-100 text-blue-600 w-6 h-6 rounded-full flex items-center justify-center text-sm">⑤</span><span>【生命周期】权限过期自动提醒</span></div>',
      )
    }

    // Add special handling for System Log Analysis Agent quick operation list
    if (content.includes("🔍 快捷操作清单")) {
      content = content.replace(
        /①\s*【健康扫描】检查当前科研管理系统日志状态/g,
        '<div class="cursor-pointer text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-2 rounded-lg my-1 transition-colors flex items-center gap-2" onclick="document.dispatchEvent(new CustomEvent(\'clickSystemLogOption\', {detail: \'检查当前科研管理系统日志状态\'}))"><span class="bg-blue-100 text-blue-600 w-6 h-6 rounded-full flex items-center justify-center text-sm">①</span><span>【健康扫描】检查当前科研管理系统日志状态</span></div>',
      )
      content = content.replace(
        /②\s*【异常处理】异常登录处理/g,
        '<div class="cursor-pointer text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-2 rounded-lg my-1 transition-colors flex items-center gap-2" onclick="document.dispatchEvent(new CustomEvent(\'clickSystemLogOption\', {detail: \'异常登录处理\'}))"><span class="bg-blue-100 text-blue-600 w-6 h-6 rounded-full flex items-center justify-center text-sm">②</span><span>【异常处理】异常登录处理</span></div>',
      )
      content = content.replace(
        /③\s*【紧急预警】紧急事件响应/g,
        '<div class="cursor-pointer text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-2 rounded-lg my-1 transition-colors flex items-center gap-2" onclick="document.dispatchEvent(new CustomEvent(\'clickSystemLogOption\', {detail: \'紧急事件响应\'}))"><span class="bg-blue-100 text-blue-600 w-6 h-6 rounded-full flex items-center justify-center text-sm">③</span><span>【紧急预警】紧急事件响应</span></div>',
      )
    }

    // 移除星号和其他可能影响阅读的标点符号
    content = content.replace(/\*\*([^*]+)\*\*/g, "$1") // 移除加粗语法 **文本**
    content = content.replace(/\*([^*]+)\*/g, "$1") // 移除斜体语法 *文本*
    content = content.replace(/​/g, "") // 移除零宽空格
    content = content.replace(/\s*\|\s*/g, " | ") // 规范化表格分隔符间距

    // 处理标题和图标 - 更现代化的样式
    // 数据分析标题
    content = content.replace(
      /📊\s*([^\n]+)/g,
      '<div class="flex items-center gap-2 font-medium text-base my-3 bg-gradient-to-r from-blue-50 to-transparent p-3 rounded-lg border-l-4 border-blue-500"><span class="text-blue-500 bg-blue-100 p-1.5 rounded-md"><BarChart className="h-4 w-4" /></span><span>$1</span></div>',
    )

    // 文档标题
    content = content.replace(
      /📄\s*([^\n]+)/g,
      '<div class="flex items-center gap-2 font-medium text-base my-3 bg-gradient-to-r from-blue-50 to-transparent p-3 rounded-lg border-l-4 border-blue-500"><span class="text-blue-500 bg-blue-100 p-1.5 rounded-md"><FileText className="h-4 w-4" /></span><span>$1</span></div>',
    )

    // 时间标题
    content = content.replace(
      /⏰\s*([^\n]+)/g,
      '<div class="flex items-center gap-2 font-medium text-base my-3 bg-gradient-to-r from-amber-50 to-transparent p-3 rounded-lg border-l-4 border-amber-500"><span class="text-amber-500 bg-amber-100 p-1.5 rounded-md"><Clock className="h-4 w-4" /></span><span>$1</span></div>',
    )

    // 日期标题
    content = content.replace(
      /📅\s*([^\n]+)/g,
      '<div class="flex items-center gap-2 font-medium text-base my-3 bg-gradient-to-r from-green-50 to-transparent p-3 rounded-lg border-l-4 border-green-500"><span class="text-green-500 bg-green-100 p-1.5 rounded-md"><Calendar className="h-4 w-4" /></span><span>$1</span></div>',
    )

    // 书籍/文献标题
    content = content.replace(
      /📚\s*([^\n]+)/g,
      '<div class="flex items-center gap-2 font-medium text-base my-3 bg-gradient-to-r from-purple-50 to-transparent p-3 rounded-lg border-l-4 border-purple-500"><span class="text-purple-500 bg-purple-100 p-1.5 rounded-md"><BookOpen className="h-4 w-4" /></span><span>$1</span></div>',
    )

    // 灯泡/提示标题
    content = content.replace(
      /💡\s*([^\n]+)/g,
      '<div class="flex items-center gap-2 font-medium text-base my-3 bg-gradient-to-r from-yellow-50 to-transparent p-3 rounded-lg border-l-4 border-yellow-500"><span class="text-yellow-500 bg-yellow-100 p-1.5 rounded-md"><Lightbulb className="h-4 w-4" /></span><span>$1</span></div>',
    )

    // 闪电/快速标题
    content = content.replace(
      /⚡\s*([^\n]+)/g,
      '<div class="flex items-center gap-2 font-medium text-base my-3 bg-gradient-to-r from-orange-50 to-transparent p-3 rounded-lg border-l-4 border-orange-500"><span class="text-orange-500 bg-orange-100 p-1.5 rounded-md"><Zap className="h-4 w-4" /></span><span>$1</span></div>',
    )

    // 处理Markdown标题
    content = content.replace(
      /###\s+([^\n]+)/g,
      '<div class="font-semibold text-base border-l-4 border-blue-500 pl-3 py-2 my-3 bg-blue-50/50 rounded-r-lg">$1</div>',
    )

    // 处理列表项 (▸ 项目) - 更现代化的样式
    content = content.replace(
      /▸\s*([^\n]+)/g,
      '<div class="flex items-start gap-2 ml-2 my-2 p-2 bg-gradient-to-r from-blue-50/50 to-transparent rounded-lg"><span class="text-blue-500 mt-0.5 bg-blue-100 p-1 rounded"><ArrowRight className="h-3.5 w-3.5" /></span><span>$1</span></div>',
    )

    // 处理成功项 (✅ 项目)
    content = content.replace(
      /✅\s*([^\n]+)/g,
      '<div class="flex items-start gap-2 ml-2 my-2 p-2 bg-gradient-to-r from-green-50/50 to-transparent rounded-lg"><span class="text-green-500 mt-0.5 bg-green-100 p-1 rounded"><CheckCircle className="h-3.5 w-3.5" /></span><span>$1</span></div>',
    )

    // 处理警告项 (❗ 项目)
    content = content.replace(
      /❗\s*([^\n]+)/g,
      '<div class="flex items-start gap-2 ml-2 my-2 p-2 bg-gradient-to-r from-amber-50/50 to-transparent rounded-lg"><span class="text-amber-500 mt-0.5 bg-amber-100 p-1 rounded"><AlertCircle className="h-3.5 w-3.5" /></span><span>$1</span></div>',
    )

    // 处理闪光点 (✨ 项目)
    content = content.replace(
      /✨\s*([^\n]+)/g,
      '<div class="flex items-start gap-2 ml-2 my-2 p-2 bg-gradient-to-r from-purple-50/50 to-transparent rounded-lg"><span class="text-purple-500 mt-0.5 bg-purple-100 p-1 rounded"><Sparkles className="h-3.5 w-3.5" /></span><span>$1</span></div>',
    )

    // 处理可操作按钮 ([按钮文字]) - 更现代化的样式
    content = content.replace(
      /\[([^\]]+)\]/g,
      '<button class="inline-flex items-center justify-center rounded-full text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-500 text-white hover:bg-blue-600 h-8 px-4 py-1 mx-1 my-0.5 shadow-sm">$1</button>',
    )

    // 处理外部链接
    content = content.replace(
      /\[([^\]]+)\]\$\$([^)]+)\$\$/g,
      '<a href="$2" class="text-blue-600 hover:text-blue-700 hover:underline inline-flex items-center gap-1 bg-blue-50 px-3 py-1 rounded-full" target="_blank">$1 <ExternalLink className="h-3 w-3" /></a>',
    )

    // 处理表格 - 更现代化的样式
    if (content.includes("|") && (content.includes("\n|") || content.includes("---"))) {
      const lines = content.split("\n")
      let inTable = false
      let tableHTML =
        '<div class="overflow-x-auto my-4 rounded-xl border border-blue-200 shadow-sm"><table class="w-full border-collapse">'
      let isHeader = false
      let hasProcessedHeaderSeparator = false
      let headerCells: string[] = []

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim()

        // 检测表格开始
        if (line.startsWith("|") && line.endsWith("|")) {
          if (!inTable) {
            inTable = true
            isHeader = true
          }

          // 分隔行（包含 ----- 的行）
          if (line.includes("---")) {
            hasProcessedHeaderSeparator = true
            continue
          }

          const cells = line.split("|").filter((cell) => cell.trim() !== "")

          if (isHeader && !hasProcessedHeaderSeparator) {
            headerCells = cells.map((cell) => cell.trim())
            tableHTML += "<thead class='bg-blue-50'><tr>"
            cells.forEach((cell) => {
              tableHTML += `<th class="border-b border-blue-200 px-4 py-3 text-left font-medium text-blue-700">${cell.trim()}</th>`
            })
            tableHTML += "</tr></thead><tbody>"

            // 如果下一行不是分隔符，则认为已经处理完头部
            if (i + 1 < lines.length) {
              const nextLine = lines[i + 1].trim()
              if (!nextLine.includes("---")) {
                isHeader = false
                hasProcessedHeaderSeparator = true
              }
            }
          } else {
            tableHTML += "<tr class='hover:bg-blue-50/50 transition-colors'>"
            cells.forEach((cell, index) => {
              // 确保单元格数量与表头一致
              const cellContent = cell.trim()
              tableHTML += `<td class="border-b border-blue-100 px-4 py-3">${cellContent}</td>`
            })
            tableHTML += "</tr>"
            isHeader = false
          }
        } else if (inTable) {
          // 表格结束
          tableHTML += "</tbody></table></div>"
          inTable = false
          isHeader = false
          hasProcessedHeaderSeparator = false
        }
      }

      if (inTable) {
        tableHTML += "</tbody></table></div>"
      }

      // 替换原始表格文本
      // 使用更精确的正则表达式来匹配表格
      const tableRegex = /(\|[^\n]*\|(\n|$))+/g
      content = content.replace(tableRegex, () => {
        return tableHTML
      })
    }

    // 特殊处理性能对比表
    if (content.includes("性能对比表") || (content.includes("模型类型") && content.includes("参数量"))) {
      // 添加表格前的标题样式
      content = content.replace(
        /(###\s*性能对比表|性能对比表)/g,
        '<div class="font-semibold text-base border-l-4 border-blue-500 pl-3 py-2 my-3 bg-gradient-to-r from-blue-50 to-transparent rounded-r-lg">性能对比表</div>',
      )

      // 为表格添加特殊样式
      content = content.replace(
        /<div class="overflow-x-auto my-4 rounded-xl border border-blue-200 shadow-sm"><table/g,
        '<div class="overflow-x-auto my-4 rounded-xl border border-blue-200 shadow-sm bg-white"><table',
      )
    }

    // 处理分隔线
    content = content.replace(/---+/g, '<hr class="my-4 border-t border-blue-200" />')

    // 处理换行符
    content = content.replace(/\n\n/g, '<div class="h-3"></div>')
    content = content.replace(/\n/g, "<br />")

    return content
  }, [])

  const handlePermissionOptionClick = useCallback(
    (optionText: string) => {
      if (optionText) {
        setInputValue(optionText)
        // Automatically send the message
        setTimeout(() => {
          handleSendMessage()
        }, 100)
      }
    },
    [handleSendMessage, setInputValue],
  )

  const handleSystemLogOptionClick = useCallback(
    (optionText: string) => {
      if (optionText) {
        setInputValue(optionText)
        // Automatically send the message
        setTimeout(() => {
          handleSendMessage()
        }, 100)
      }
    },
    [handleSendMessage, setInputValue],
  )

  // 添加事件监听器处理模板点击
  useEffect(() => {
    const handleTemplateClick = (e: CustomEvent) => {
      const templateText = e.detail
      if (templateText) {
        // 发送用户消息
        setMessages((prev) => [...prev, { type: "user", content: templateText }])

        // 处理特殊回复
        const specialResponse = handleLiteratureAssistantResponse(templateText)
        if (specialResponse) {
          setTimeout(() => {
            setMessages((prev) => [...prev, { type: "bot", content: specialResponse }])
          }, 1000)
        }
      }
    }

    const handlePermissionOptionClickEvent = (e: CustomEvent) => {
      if (e.detail) {
        handlePermissionOptionClick(e.detail)
      }
    }

    const handleSystemLogOptionClickEvent = (e: CustomEvent) => {
      if (e.detail) {
        handleSystemLogOptionClick(e.detail)
      }
    }

    // 添加自定义事件监听器
    document.addEventListener("clickTemplate", handleTemplateClick as EventListener)
    document.addEventListener("clickPermissionOption", handlePermissionOptionClickEvent as EventListener)
    document.addEventListener("clickSystemLogOption", handleSystemLogOptionClickEvent as EventListener)

    // 清理函数
    return () => {
      document.removeEventListener("clickTemplate", handleTemplateClick as EventListener)
      document.removeEventListener("clickPermissionOption", handlePermissionOptionClickEvent as EventListener)
      document.removeEventListener("clickSystemLogOption", handleSystemLogOptionClickEvent as EventListener)
    }
  }, [handleLiteratureAssistantResponse, messages, handlePermissionOptionClick, handleSystemLogOptionClick])

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFiles([...uploadedFiles, ...Array.from(e.target.files)])
    }
  }

  const handleFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
  }

  const toggleFavorite = (agentId: string) => {
    setAgents((prevAgents) =>
      prevAgents.map((agent) => (agent.id === agentId ? { ...agent, isFavorite: !agent.isFavorite } : agent)),
    )
  }

  const filteredAgents = agents.filter((agent) => {
    const searchRegex = new RegExp(searchQuery, "i")
    const categoryMatch = selectedCategory ? agent.tags.includes(selectedCategory) : true
    return searchRegex.test(agent.title) && categoryMatch
  })

  return (
    <>
      {/* 悬浮按钮 - 仅在对话框关闭时显示 */}
      {!isOpen && (
        <div
          ref={robotRef}
          className="fixed right-6 bottom-6 w-[120px] h-[140px] cursor-move"
          style={{
            transition: isDragging ? "none" : "transform 0.3s ease",
            visibility: "visible !important",
            display: "block !important",
            position: "fixed !important",
            zIndex: 99999,
          }}
          onMouseDown={handleMouseDown}
          onMouseEnter={handleRobotHover}
          onMouseLeave={handleRobotLeave}
          onClick={(e) => {
            if (!hasMoved) {
              toggleOpen(e)
            }
            setHasMoved(false)
          }}
        >
          {/* 对话框 */}
          <div
            className="absolute -top-16 right-5 bg-white px-4 py-2 rounded-2xl shadow-md max-w-[200px] pointer-events-none whitespace-nowrap"
            style={{
              opacity: showSpeech ? 1 : 0,
              transition: "opacity 0.3s ease",
              zIndex: 99999,
            }}
          >
            您好！有什么可以帮助您的？
            <div
              className="absolute -bottom-2 right-5"
              style={{
                width: 0,
                height: 0,
                borderLeft: "10px solid transparent",
                borderRight: "10px solid transparent",
                borderTop: "10px solid white",
              }}
            />
          </div>

          {/* 机器人图片 */}
          <div
            className="w-[86px] h-[86px] mx-auto cursor-pointer"
            style={{
              transition: "transform 0.3s ease",
              transform: !isDragging ? (showSpeech ? "translateY(-10px)" : "translateY(0)") : "none",
              zIndex: 99999,
            }}
          >
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/jqr-faqwqpKIapdW35aOsLQx8fQzd01vEM.gif"
              alt="机器人助手"
              className="w-full h-full object-contain"
              style={{
                pointerEvents: "none",
                width: "100%",
                height: "100%",
              }}
            />
          </div>
        </div>
      )}

      {/* 对话框 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={drawerRef}
            className="fixed right-0 top-0 bottom-0 w-[520px] max-w-[100vw] bg-gradient-to-br from-white to-blue-50 shadow-2xl z-40 flex flex-col border-l border-blue-100 rounded-md"
            initial={{ x: 520 }}
            animate={{ x: 0 }}
            exit={{ x: 520 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Header with modern styling */}
            <div className="flex items-center justify-between p-4 border-b border-blue-100 bg-white/70 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-blue-500 flex items-center justify-center">
                  <img
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/jqr-faqwqpKIapdW35aOsLQx8fQzd01vEM.gif"
                    alt="AI助手"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="font-medium text-gray-800">小易</div>
                  <div className="text-xs text-green-600 flex items-center">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></span>
                    在线
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:bg-blue-50"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Tabs with modern styling */}
            <div className="flex border-b border-blue-100 bg-white/50">
              <button
                className={cn(
                  "flex-1 py-3 font-medium text-sm transition-colors relative",
                  activeTab === "chat" ? "text-blue-600" : "text-gray-500 hover:text-gray-700",
                )}
                onClick={() => setActiveTab("chat")}
              >
                对话
                {activeTab === "chat" && (
                  <motion.div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" layoutId="activeTab" />
                )}
              </button>
              <button
                className={cn(
                  "flex-1 py-3 font-medium text-sm transition-colors relative",
                  activeTab === "recommend" ? "text-blue-600" : "text-gray-500 hover:text-gray-700",
                )}
                onClick={() => setActiveTab("recommend")}
              >
                智能体推荐区
                {activeTab === "recommend" && (
                  <motion.div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" layoutId="activeTab" />
                )}
              </button>
            </div>

            {/* Content area with updated styling */}
            {activeTab === "chat" ? (
              <>
                {/* Chat messages with improved styling */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-blue-50/30 to-white/80">
                  {messages.map((message, index) => (
                    <motion.div
                      key={index}
                      className={cn(
                        "flex items-start gap-2",
                        message.type === "user" ? "justify-end" : "justify-start",
                      )}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {message.type === "bot" && (
                        <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden bg-blue-500 shadow-sm">
                          <img
                            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/jqr-faqwqpKIapdW35aOsLQx8fQzd01vEM.gif"
                            alt="AI助手"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div
                        className={cn(
                          "max-w-[85%] rounded-md p-3 shadow-sm",
                          message.type === "user"
                            ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-none"
                            : "bg-white text-gray-800 rounded-bl-none border border-blue-100",
                        )}
                      >
                        <div
                          dangerouslySetInnerHTML={{
                            __html: formatMessageContent(message.content),
                          }}
                          className="message-content"
                        />
                      </div>
                      {message.type === "user" && (
                        <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden bg-blue-100 shadow-sm">
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600 text-white font-medium">
                            张
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input area with modern styling */}
                <div className="p-4 border-t border-blue-100 bg-white">
                  {/* Function buttons with improved styling */}
                  <div className="flex items-center gap-3 mb-3">
                    <button className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-blue-600 px-2 py-1 rounded-full hover:bg-blue-50 transition-colors">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M12 16v-4"></path>
                        <path d="M12 8h.01"></path>
                      </svg>
                      深度思考
                    </button>
                    <button className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-blue-600 px-2 py-1 rounded-full hover:bg-blue-50 transition-colors">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="M21 21-4.3-4.3"></path>
                      </svg>
                      联网搜索
                    </button>
                    <div className="relative group">
                      <button
                        className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-blue-600 px-2 py-1 rounded-full hover:bg-blue-50 transition-colors"
                        onClick={(e) => e.preventDefault()} // 防止按钮点击关闭下拉菜单
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M12 8h.01"></path>
                          <path d="M11 12h1v4h1"></path>
                          <circle cx="12" cy="12" r="10"></circle>
                        </svg>
                        常用提示语
                      </button>
                      {/* 提示语模板下拉菜单 - 改为始终可见的悬浮样式 */}
                      <div className="absolute left-0 bottom-full mb-2 bg-white shadow-lg rounded-xl py-2 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-20 border border-blue-100">
                        <div className="px-3 py-1 text-xs font-medium text-gray-500 border-b border-gray-100">
                          选择提示语模板
                        </div>
                        <button
                          className="w-full text-left px-4 py-2 text-sm hover:bg-blue-50 transition-colors"
                          onClick={() => {
                            setInputValue(`请为指定时间段内的[科研成果/经费使用情况]生成一份简要统计报表，要求如下：
1. 报表类型：[科研成果总结/经费使用概览]
2. 时间范围：从[开始日期]到[结束日期]
3. 内容细节：
   - 若选择科研成果，请包括但不限于以下内容：发表论文数量、专利申请情况、项目完成进度等。
   - 若选择经费使用情况，请详细列出各项费用支出情况，如设备购置费、材料费、差旅费等，并提供总预算对比分析。
4. 输出格式：[PDF/Excel]
5. 额外定制：
   - 是否包含图表或图形化展示数据？[是/否]
   - 是否需要对特定项目或个人进行深入分析？如果是，请提供具体名称或编号。
请确保所有数据准确无误，并以清晰易懂的方式呈现。如果有任何疑问或需要更多信息，请随时告知。`)
                          }}
                        >
                          <div className="font-medium text-blue-600">数据统计与报告生成</div>
                          <div className="text-xs text-gray-500 mt-1">生成指定时间段内的科研成果或经费使用情况报表</div>
                        </button>
                        <button
                          className="w-full text-left px-4 py-2 text-sm hover:bg-blue-50 transition-colors"
                          onClick={() => {
                            setInputValue("请查询科研人员[姓名/ID]的项目状态，包括进度、经费使用情况和近期里程碑。")
                          }}
                        >
                          <div className="font-medium text-blue-600">快速查询科研人员项目状态</div>
                          <div className="text-xs text-gray-500 mt-1">查询特定人员的项目进度、经费和里程碑</div>
                        </button>
                        <button
                          className="w-full text-left px-4 py-2 text-sm hover:bg-blue-50 transition-colors"
                          onClick={() => {
                            setInputValue(
                              "将【李明、王芳】的权限从【项目申报员】调整为【项目审核员】，生效时间【2025-03-22】。",
                            )
                          }}
                        >
                          <div className="font-medium text-blue-600">权限批量调整</div>
                          <div className="text-xs text-gray-500 mt-1">批量修改用户权限级别和生效时间</div>
                        </button>
                        <button
                          className="w-full text-left px-4 py-2 text-sm hover:bg-blue-50 transition-colors"
                          onClick={() => {
                            setInputValue(
                              "向【物理系、生物系】发送提醒：请在【2024-08-15 17:00】前完成【国家自然基金申报书提交】，逾期将关闭入口。",
                            )
                          }}
                        >
                          <div className="font-medium text-blue-600">逾期任务提醒</div>
                          <div className="text-xs text-gray-500 mt-1">向指定部门发送带截止日期的任务提醒</div>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Uploaded files preview - keep existing functionality with improved styling */}
                  {uploadedFiles.length > 0 && (
                    <div className="mb-2 flex flex-wrap gap-2">
                      {uploadedFiles.map((file, index) => (
                        <div
                          key={index}
                          className="bg-blue-50 rounded-full px-3 py-1 text-xs flex items-center gap-1 border border-blue-100"
                        >
                          <Paperclip className="h-3 w-3 text-blue-500" />
                          <span className="truncate max-w-[150px] text-gray-700">{file.name}</span>
                          <button
                            className="text-gray-400 hover:text-gray-600 ml-1"
                            onClick={() => setUploadedFiles((files) => files.filter((_, i) => i !== index))}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Input toolbar with modern styling */}
                  <div className="flex items-center relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2 z-10">
                      {/* Upload button */}
                      <button
                        className="text-gray-400 hover:text-blue-500 transition-colors"
                        onClick={handleFileUpload}
                      >
                        <FileUp className="h-5 w-5" />
                      </button>

                      {/* Voice input */}
                      <button
                        className={`text-gray-400 hover:text-blue-500 transition-colors ${isRecording ? "text-red-500" : ""}`}
                        onClick={toggleRecording}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
                          <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                          <line x1="12" x2="12" y1="19" y2="22"></line>
                        </svg>
                      </button>
                    </div>

                    <textarea
                      placeholder="输入消息..."
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault()
                          handleSendMessage()
                        }
                      }}
                      className="w-full resize-none rounded-full border border-blue-200 bg-blue-50/50 ring-offset-background placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 py-3 px-3 pl-16 pr-12 shadow-sm"
                      style={{
                        height: (() => {
                          // Keep existing height calculation logic
                          const lines = inputValue.split("\n")
                          const lineCount = lines.length
                          const avgCharsPerLine = inputValue.length / lineCount
                          const estimatedLines = lines.reduce((total, line) => {
                            const lineWraps = Math.ceil(line.length / 40)
                            return total + Math.max(1, lineWraps)
                          }, 0)
                          if (estimatedLines > 8) return "200px"
                          return `${Math.max(46, estimatedLines * 22)}px`
                        })(),
                        overflowY: inputValue ? "auto" : "hidden",
                        scrollbarWidth: inputValue ? "thin" : "none",
                      }}
                    />

                    {/* Send button with modern styling */}
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <button
                        onClick={handleSendMessage}
                        className="text-white bg-blue-500 hover:bg-blue-600 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <input type="file" ref={fileInputRef} className="hidden" onChange={onFileChange} multiple />
                </div>
              </>
            ) : (
              /* Agent recommendation area - keep existing functionality with improved styling */
              <div className="flex-1 flex flex-col bg-gradient-to-b from-blue-50/30 to-white/80">
                {/* Role selector with modern styling */}
                <div className="p-4 border-b border-blue-100 bg-white/70">
                  <Tabs defaultValue={userRole} onValueChange={(value) => setUserRole(value as UserRole)}>
                    <TabsList className="grid grid-cols-3 mb-2 bg-blue-50 p-1 rounded-lg">
                      <TabsTrigger
                        value="科研人员"
                        className="rounded-md data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
                      >
                        科研人员
                      </TabsTrigger>
                      <TabsTrigger
                        value="业务办理员"
                        className="rounded-md data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
                      >
                        业务办理员
                      </TabsTrigger>
                      <TabsTrigger
                        value="系统管理员"
                        className="rounded-md data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
                      >
                        系统管理员
                      </TabsTrigger>
                    </TabsList>
                    <p className="text-sm text-gray-500 mt-2">
                      根据您的{userRole}角色，小易已推荐专属工具，点击即可自动化处理高频任务。
                    </p>
                  </Tabs>
                </div>

                {/* Search and filter with modern styling */}
                <div className="px-4 py-3 border-b border-blue-100 bg-white/50 flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="搜索智能体..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 border-blue-200 bg-white rounded-md focus-visible:ring-blue-400"
                    />
                  </div>
                  <div className="relative">
                    <Button
                      variant="outline"
                      className="flex items-center gap-1 rounded-md border-blue-200 bg-white hover:bg-blue-50 hover:text-blue-600"
                      onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                    >
                      <Filter className="h-4 w-4" />
                      {selectedCategory || "分类"}
                      <ChevronDown className="h-4 w-4" />
                    </Button>

                    {showCategoryDropdown && (
                      <div className="absolute top-full right-0 mt-1 bg-white border border-blue-100 rounded-xl shadow-lg z-10 w-40">
                        {categories.map((category) => (
                          <button
                            key={category}
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-blue-50 first:rounded-t-xl last:rounded-b-xl"
                            onClick={() => {
                              setSelectedCategory(category === "全部" ? null : category)
                              setShowCategoryDropdown(false)
                            }}
                          >
                            {category}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Agent list with modern styling */}
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-3">
                    {filteredAgents.length > 0 ? (
                      filteredAgents.map((agent) => (
                        <div
                          key={agent.id}
                          className={`bg-white rounded-md p-4 border border-blue-100 shadow-sm hover:shadow-md transition-shadow ${agent.id === "11" ? "cursor-pointer hover:border-blue-300" : ""}`}
                          onClick={() => {
                            if (agent.id === "11") {
                              // 启动文献分析助手并显示特殊对话
                              setActiveTab("chat")
                              setMessages([
                                ...messages,
                                {
                                  type: "user",
                                  content: `启动${agent.title}`,
                                },
                                {
                                  type: "bot",
                                  content: `${agent.title}已启动，请上传您需要分析的文献文件。`,
                                },
                              ])
                            } else {
                              launchAgent(agent)
                            }
                          }}
                        >
                          <div className="flex items-start">
                            <div className="text-2xl mr-3 bg-blue-50 w-10 h-10 rounded-full flex items-center justify-center">
                              {agent.icon}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center">
                                <h4 className="font-medium text-gray-800">{agent.title}</h4>
                                {agent.isNew && (
                                  <Badge className="ml-2 bg-green-500 hover:bg-green-600 text-white">新上线</Badge>
                                )}
                                <Badge variant="outline" className="ml-2 text-xs border-blue-200 text-blue-600">
                                  {agent.type}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{agent.description}</p>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {agent.tags.map((tag, idx) => (
                                  <Badge
                                    key={idx}
                                    variant="secondary"
                                    className="text-xs bg-blue-50 text-blue-700 hover:bg-blue-100"
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  toggleFavorite(agent.id)
                                }}
                                className={
                                  agent.isFavorite
                                    ? "text-yellow-500 hover:bg-yellow-50"
                                    : "text-gray-400 hover:bg-gray-50"
                                }
                              >
                                {agent.isFavorite ? (
                                  <Star className="h-4 w-4 fill-yellow-500" />
                                ) : (
                                  <Star className="h-4 w-4" />
                                )}
                              </Button>
                              <Button
                                size="sm"
                                className="rounded-full bg-blue-500 hover:bg-blue-600 text-white"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  if (agent.id === "11") {
                                    // 启动文献分析助手并显示特殊对话
                                    setActiveTab("chat")
                                    setMessages([
                                      ...messages,
                                      {
                                        type: "user",
                                        content: `启动${agent.title}`,
                                      },
                                      {
                                        type: "bot",
                                        content: `${agent.title}已启动，请上传您需要分析的文献文件。`,
                                      },
                                    ])
                                  } else {
                                    launchAgent(agent)
                                  }
                                }}
                              >
                                立即使用
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500 bg-white rounded-xl p-6 border border-blue-100">
                        没有找到匹配的智能体
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default React.memo(AIAssistant)

