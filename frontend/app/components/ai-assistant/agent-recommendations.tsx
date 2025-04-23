"use client"

import type React from "react"
import { useState } from "react"
import { Search, Filter, ChevronDown, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Agent, UserRole } from "@/app/types/ai-assistant-types"

interface AgentRecommendationsProps {
  userRole: UserRole
  setUserRole: React.Dispatch<React.SetStateAction<UserRole>>
  agents: Agent[]
  setAgents: React.Dispatch<React.SetStateAction<Agent[]>>
  launchAgent: (agent: Agent) => void
  setActiveTab: React.Dispatch<React.SetStateAction<"chat" | "recommend">>
  messages: Array<{ type: "user" | "bot"; content: string }>
  setMessages: React.Dispatch<React.SetStateAction<Array<{ type: "user" | "bot"; content: string }>>>
}

const AgentRecommendations: React.FC<AgentRecommendationsProps> = ({
  userRole,
  setUserRole,
  agents,
  setAgents,
  launchAgent,
  setActiveTab,
  messages,
  setMessages,
}) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)

  // 分类列表
  const categories = ["全部", "数据管理", "审批", "申报", "分析", "检索", "提醒"]

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
            className="pl-10 border-blue-200 bg-white rounded-full focus-visible:ring-blue-400"
          />
        </div>
        <div className="relative">
          <Button
            variant="outline"
            className="flex items-center gap-1 rounded-full border-blue-200 bg-white hover:bg-blue-50 hover:text-blue-600"
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
                className={`bg-white rounded-xl p-4 border border-blue-100 shadow-sm hover:shadow-md transition-shadow ${agent.id === "11" ? "cursor-pointer hover:border-blue-300" : ""}`}
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
                      {agent.isNew && <Badge className="ml-2 bg-green-500 hover:bg-green-600 text-white">新上线</Badge>}
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
                        agent.isFavorite ? "text-yellow-500 hover:bg-yellow-50" : "text-gray-400 hover:bg-gray-50"
                      }
                    >
                      {agent.isFavorite ? <Star className="h-4 w-4 fill-yellow-500" /> : <Star className="h-4 w-4" />}
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
  )
}

export default AgentRecommendations

