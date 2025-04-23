"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Message, UserRole } from "@/app/types/ai-assistant-types"
import { handleLiteratureAssistantResponse, isLiteratureAssistantActive } from "@/app/utils/message-formatter"
import { getAgentsByRole } from "@/app/services/agent-service"
import FloatingRobot from "./floating-robot"
import ChatInterface from "./chat-interface"
import AgentRecommendations from "./agent-recommendations"
import Image from "next/image"

function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [showSpeech, setShowSpeech] = useState(false)
  const [showWelcome, setShowWelcome] = useState(true)
  const [inputValue, setInputValue] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const drawerRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [activeTab, setActiveTab] = useState<"chat" | "recommend">("chat")

  // 新增状态
  const [userRole, setUserRole] = useState<UserRole>("科研人员")
  const [agents, setAgents] = useState<any[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])

  // 声明 robotRef
  const robotRef = useRef<HTMLDivElement>(null)

  // 初始化智能体数据
  useEffect(() => {
    const roleAgents = getAgentsByRole(userRole)
    setAgents(roleAgents)
  }, [userRole])

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

  // 添加全局鼠标事件监听器
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && robotRef.current) {
        // 设置新位置
        robotRef.current.style.right = "auto"
        robotRef.current.style.bottom = "auto"
        robotRef.current.style.left = `${e.clientX - position.x}px`
        robotRef.current.style.top = `${e.clientY - position.y}px`
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, position])

  const toggleOpen = (e: React.MouseEvent) => {
    if (!isDragging) {
      setIsOpen(!isOpen)
    }
  }

  // 启动智能体
  const launchAgent = (agent: any) => {
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

  // 处理发送消息
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

      // Check for Permission Management Assistant specific commands
      if (messageContent.includes("为「量子计算组」配置初始权限") || messageContent.includes("基于角色/项目的权限配置")) {
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              type: "bot",
              content: `📌 正在应用「科研项目组-标准模板」...
✅ 已完成：

成员继承「基础研究人员」权限包

组长叠加「三级审批权」

设置数据导出拦截规则（GB/T 39335-2020）
⚠️ 检测到2名成员已有跨组权限，是否启动冲突审查？`,
            },
          ])
        }, 1000)
      } else if (messageContent.includes("批量回收2025届毕业生在项目") || messageContent.includes("多账户权限同步/回收")) {
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              type: "bot",
              content: `🔍 筛选到匹配账户：89个（含3个活跃账户）
📋 操作预览：

移除「XRD数据分析模块」访问权

保留论文成果库只读权限（依校规第7.2条）
🔒 安全建议：
① 立即执行（生成操作日志）
② 添加离职缓冲期（7天后生效）`,
            },
          ])
        }, 1000)
      } else if (messageContent.includes("检查用户「ChenXia@2025」的权限冲突") || messageContent.includes("权限重叠自动分析")) {
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              type: "bot",
              content: `⚠️ 检测到三重权限叠加冲突：

【项目角色】量子计算组-数据编辑员

【设备权限】冷冻电镜管理员（L3级）

【全局权限】跨项目审计组成员
📊 风险评级：B级（可能违反「最小权限原则」）
🔧 推荐解决方案：
① 剥离跨项目审计组权限
② 添加设备操作双人授权限制`,
            },
          ])
        }, 1000)
      } else if (messageContent.includes("立即禁用「ZhangWei」账户的所有高危权限") || messageContent.includes("高危权限实时回收")) {
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              type: "bot",
              content: `🚨 执行熔断操作（安全模式E-3）：

已终止2个活跃数据库会话

撤回「生物样本库」管理权限

冻结智能设备操作证书
📩 自动生成：
① 强制操作审计报告
② 人事部门通知模板
③ 权限恢复验证流程工单`,
            },
          ])
        }, 1000)
      } else if (messageContent.includes("检测到即将过期权限") || messageContent.includes("权限过期自动提醒")) {
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              type: "bot",
              content: `⏳ 检测到即将过期权限：

「激光实验室-访客权限」15小时后失效（涉及8人）

「国家项目申报系统」临时权限到期（3个项目组）
🔄 推荐操作：
① 批量延期（上传审批文件）
② 转换为长期权限（需合规审查）
③ 自动回收并发送通知`,
            },
          ])
        }, 1000)
      } else if (messageContent.includes("检查当前科研管理系统日志状态") || messageContent.includes("健康扫描")) {
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              type: "bot",
              content: `正在扫描近24小时日志...检测到327条常规操作记录，系统响应时间平均为0.8秒。发现2项异常：

凌晨03:15检测到非常规IP(192.168.23.45)尝试访问敏感数据接口

用户ID: RD2024_Zhang 在1小时内触发3次身份验证失败
建议：立即进行异常行为深度分析？`,
            },
          ])
        }, 1000)
      } else if (messageContent.includes("异常登录处理") || messageContent.includes("异常处理")) {
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              type: "bot",
              content: `正在检测异常登录行为...检测到RD2024_Zhang的异常用户
09:00 正常登录（设备指纹匹配）

14:30 异常登录（新设备/MAC地址未登记）

15:45 异常登录（境外IP地址）
安全评分已降至C级，建议：①强制二次认证 ②临时封禁该账户？`,
            },
          ])
        }, 1000)
      } else if (messageContent.includes("紧急事件响应") || messageContent.includes("紧急预警")) {
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              type: "bot",
              content: `正在检测紧急事件响应...检测到大规模异常行为：

3台服务器CPU占用率持续>95%

数据库连接数超限额120%

检测到加密数据包外传(目标IP: 45.76.xxx.xx)
建议立即执行：①启动系统隔离协议 ②启用取证模式 ③通知网络安全组`,
            },
          ])
        }, 1000)
      } else if (isLiteratureAssistantActive(messages)) {
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
            }, 1500)
          }, 1000)
        }
      } else if (
        messageContent.includes("将【") &&
        messageContent.includes("】的权限从【") &&
        messageContent.includes("调整为【")
      ) {
        // 处理权限批量调整
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              type: "bot",
              content: `📊 权限变更已执行
▸ 生效时间：2025-03-22
▸ 调整人员：李明（工号1001）、王芳（工号1003）
▸ 权限变更记录：[查看详情]
❗ 请确认上述信息无误，变更将在24小时内同步至所有子系统。`,
            },
          ])
        }, 1000)
      } else if (
        messageContent.includes("向【") &&
        messageContent.includes("】发送提醒：") &&
        messageContent.includes("逾期将关闭入口")
      ) {
        // 处理逾期任务提醒
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              type: "bot",
              content: `⏰ 提醒已发送至指定部门
▸ 接收范围：物理系（32人）、生物系（28人）
▸ 提醒方式：系统站内信+短信
✅ 成功送达：60人 | 失败：0人
📅 已设置倒计时看板：[查看实时提交状态]`,
            },
          ])
        }, 1000)
      } else {
        // 模拟AI回复（原有逻辑）
        setTimeout(() => {
          let response = "正在处理您的请求，请稍候..."

          if (messageContent.includes("请为指定时间段内的") && messageContent.includes("生成一份简要统计报表")) {
            // 模拟报告生成响应
            setTimeout(() => {
              setMessages((prev) => [
                ...prev,
                {
                  type: "bot",
                  content:
                    "📊 报告已生成\n\n您可以点击下方链接查看或下载：\n\n[2023年1月至2023年12月科研成果总结.pdf](https://example.com/report.pdf)",
                },
              ])
            }, 1500)
            return
          }

          if (uploadedFiles.length > 0) {
            response = `已收到您上传的${uploadedFiles.length}个文件`
            if (messageContent.trim()) {
              response += "和相关说明"
            }
            response += "，正在处理中..."
          } else if (messageContent.includes("项目") || messageContent.includes("申报")) {
            response =
              "您有3个进行中的项目，其中'人工智能辅助科研决策系统'项目进度已达到85%，预计下周完成。需要我为您安排项目组会议吗？"
          } else if (messageContent.includes("经费") || messageContent.includes("预算")) {
            response =
              "您的'人工智能辅助科研决策系统'项目经费使用率为65%，剩余预算25万元。本月有3笔报销待审批，需要我为您展示详细信息吗？"
          } else if (messageContent.includes("待办") || messageContent.includes("任务")) {
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
  }, [inputValue, uploadedFiles, messages])

  // 添加事件监听器处理权限管理助手快速命令列表点击
  useEffect(() => {
    const handlePermissionOptionClick = (e: CustomEvent) => {
      const optionText = e.detail
      if (optionText) {
        setInputValue(optionText)
        // Automatically send the message
        setTimeout(() => {
          handleSendMessage()
        }, 100)
      }
    }

    // Add custom event listener
    document.addEventListener("clickPermissionOption", handlePermissionOptionClick as EventListener)

    // Cleanup function
    return () => {
      document.removeEventListener("clickPermissionOption", handlePermissionOptionClick as EventListener)
    }
  }, [handleSendMessage, inputValue]) // Dependencies to ensure the latest state

  // 添加事件监听器处理系统日志分析Agent快速操作列表点击
  useEffect(() => {
    const handleSystemLogOptionClick = (e: CustomEvent) => {\
      const optionText = e.detail
      if (optionText) {
        setInputValue(optionText)
        // Automatically nd the message
        setTimeout(() => {
          handleSendMessage()
        }, 100)
      }
    }

    // Add custom event listener
    document.addEventListener("clickSystemLogOption", handleSystemLogOptionClick as EventListener)

    // Cleanup function
    return () => {
      document.removeEventListener("clickSystemLogOption", handleSystemLogOptionClick as EventListener)
    }
  }, [handleSendMessage, inputValue]) // Dependencies to ensure the latest state

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

    // 添加自定义事件监听器
    document.addEventListener("clickTemplate", handleTemplateClick as EventListener)

    // 清理函数
    return () => {
      document.removeEventListener("clickTemplate", handleTemplateClick as EventListener)
    }
  }, [handleLiteratureAssistantResponse, messages]) // 依赖于messages以确保每次更新都能获取最新状态

  const toggleRecording = () => {
    setIsRecording(!isRecording)
  }

  return (
    <>
      {/* 悬浮按钮 - 仅在对话框关闭时显示 */}
      {!isOpen && (
        <FloatingRobot
          isOpen={isOpen}
          toggleOpen={toggleOpen}
          showSpeech={showSpeech}
          setShowSpeech={setShowSpeech}
          isDragging={isDragging}
          setIsDragging={setIsDragging}
          position={position}
          setPosition={setPosition}
          robotRef={robotRef}
        />
      )}

      {/* 对话框 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={drawerRef}
            className="fixed right-0 top-0 bottom-0 w-[420px] max-w-[100vw] bg-gradient-to-br from-white to-blue-50 shadow-2xl z-40 flex flex-col border-l border-blue-100"
            initial={{ x: 420 }}
            animate={{ x: 0 }}
            exit={{ x: 420 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Header with modern styling */}
            <div className="flex items-center justify-between p-4 border-b border-blue-100 bg-white/70 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-blue-500 flex items-center justify-center relative">
                  <Image
                    src="/ai-robot-avatar.gif"
                    alt="AI助手"
                    fill
                    className="object-cover"
                    priority
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
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-gray-500 hover:bg-blue-50">
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Tabs with modern styling */}
            <div className="flex border-b border-blue-100 bg-white/50">
              <button
                className={cn(
                  "flex-1 py-3 font-medium text-sm transition-colors relative",
                  activeTab === "chat"
                    ? "text-blue-600"
                    : "text-gray-500 hover:text-gray-700",
                )}
                onClick={() => setActiveTab("chat")}
              >
                对话
                {activeTab === "chat" && (
                  <motion.div 
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" 
                    layoutId="activeTab"
                  />
                )}
              </button>
              <button
                className={cn(
                  "flex-1 py-3 font-medium text-sm transition-colors relative",
                  activeTab === "recommend"
                    ? "text-blue-600"
                    : "text-gray-500 hover:text-gray-700",
                )}
                onClick={() => setActiveTab("recommend")}
              >
                智能体推荐区
                {activeTab === "recommend" && (
                  <motion.div 
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" 
                    layoutId="activeTab"
                  />
                )}
              </button>
            </div>

            {/* Content area with updated styling */}
            {activeTab === "chat" ? (
              <ChatInterface
                messages={messages}
                setMessages={setMessages}
                inputValue={inputValue}
                setInputValue={setInputValue}
                handleSendMessage={handleSendMessage}
                uploadedFiles={uploadedFiles}
                setUploadedFiles={setUploadedFiles}
                isRecording={isRecording}
                toggleRecording={toggleRecording}
              />
            ) : (
              <AgentRecommendations
                userRole={userRole}
                setUserRole={setUserRole}
                agents={agents}
                setAgents={setAgents}
                launchAgent={launchAgent}
                setActiveTab={setActiveTab}
                messages={messages}
                setMessages={setMessages}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default React.memo(AIAssistant);

