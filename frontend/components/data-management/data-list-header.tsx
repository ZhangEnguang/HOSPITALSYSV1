"use client"

import type React from "react"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Plus, Settings, ChevronDown, ArrowRight, Brain, ChevronRight } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"

interface Tab {
  id: string
  label: string
  count?: number
}

interface DataListHeaderProps {
  title: string
  tabs?: Tab[]
  activeTab?: string
  onTabChange?: (value: string) => void
  onAddNew?: () => void
  onOpenSettings?: () => void
  onAIAssist?: () => void
  onCreateProject?: (type: string) => void
  projectTypes?: { id: string; label: string; color: string }[]
  addButtonLabel?: string
  settingsButtonLabel?: string
  customActions?: React.ReactNode
  className?: string
  showButtons?: boolean
  addButtonDropdownItems?: {
    label: string
    icon?: React.ReactNode
    onClick: () => void
    type?: "header"
    showArrow?: boolean
  }[]
}

export default function DataListHeader({
  title,
  tabs,
  activeTab,
  onTabChange,
  onAddNew,
  onCreateProject,
  projectTypes = [
    { id: "vertical", label: "新建纵向项目", color: "bg-blue-500" },
    { id: "horizontal", label: "新建横向项目", color: "bg-green-500" },
    { id: "school", label: "新建校级项目", color: "bg-amber-500" },
  ],
  onOpenSettings,
  onAIAssist,
  addButtonLabel = "新建",
  settingsButtonLabel = "模板库",
  customActions,
  className,
  showButtons = true,
  addButtonDropdownItems,
}: DataListHeaderProps) {
  const router = useRouter()
  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-semibold">{title}</h1>

        {/* {tabs && tabs.length > 0 && (
          <Tabs value={activeTab} onValueChange={onTabChange} className="w-[400px]">
            <TabsList>
              {tabs.map((tab) => (
                <TabsTrigger key={tab.id} value={tab.id} className="flex-1">
                  {tab.label} {tab.count !== undefined && `(${tab.count})`}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        )} */}
      </div>

      {showButtons && (
        <div className="flex gap-2">
          {onOpenSettings && settingsButtonLabel && (
            <Button variant="outline" className="gap-2" onClick={onOpenSettings}>
              <Settings className="h-4 w-4" />
              {settingsButtonLabel}
            </Button>
          )}
          
          {customActions}

          {onAIAssist && (
            <Button variant="outline" className="gap-2 relative overflow-hidden group" onClick={onAIAssist}>
              <style jsx global>{`
                @keyframes glow {
                  0% {
                    left: -100%;
                    opacity: 0;
                  }
                  50% {
                    opacity: 0.5;
                  }
                  100% {
                    left: 200%;
                    opacity: 0;
                  }
                }
                .ai-glow::before {
                  content: '';
                  position: absolute;
                  top: 0;
                  left: -100%;
                  width: 50%;
                  height: 100%;
                  background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.3), rgba(168, 85, 247, 0.3), transparent);
                  animation: glow 3s infinite;
                  z-index: 1;
                }
              `}</style>
              <span className="ai-glow"></span>
              <Brain
                className="h-4 w-4"
                style={{
                  stroke: "url(#ai-gradient)",
                }}
              />
              <span className="font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500">
                AI智能填报
              </span>

              <svg width="0" height="0" className="absolute">
                <defs>
                  <linearGradient id="ai-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="50%" stopColor="#6366F1" />
                    <stop offset="100%" stopColor="#A855F7" />
                  </linearGradient>
                </defs>
              </svg>
            </Button>
          )}

          {addButtonLabel && (
            <>
              {addButtonDropdownItems && addButtonDropdownItems.length > 0 ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="gap-1">
                      <Plus className="h-4 w-4" />
                      {addButtonLabel || "新建"}
                      <ChevronDown className="h-4 w-4 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 p-0">
                    {addButtonDropdownItems.map((item, index) =>
                      item.type === "header" ? (
                        <DropdownMenuLabel
                          key={index}
                          className="text-sm font-medium text-muted-foreground px-3 py-2 border-b"
                        >
                          {item.label}
                        </DropdownMenuLabel>
                      ) : (
                        <DropdownMenuItem
                          key={index}
                          onClick={item.onClick}
                          className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-muted"
                        >
                          <div className="flex items-center gap-2">
                            {item.icon}
                            <span>{item.label}</span>
                          </div>
                          {item.showArrow && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                        </DropdownMenuItem>
                      ),
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : onAddNew ? (
                <Button className="gap-2" onClick={onAddNew}>
                  <Plus className="h-4 w-4" />
                  {addButtonLabel}
                </Button>
              ) : onCreateProject ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="gap-2">
                      <Plus className="h-4 w-4" />
                      {addButtonLabel}
                      <ChevronDown className="h-4 w-4 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[200px]">
                    {projectTypes?.map((type) => (
                      <DropdownMenuItem
                        key={type.id}
                        className="cursor-pointer flex items-center py-2"
                        onClick={() => onCreateProject(type.id)}
                      >
                        <div className={`w-2 h-2 rounded-full ${type.color} mr-2`}></div>
                        <span>{type.label}</span>
                        <ArrowRight className="h-3.5 w-3.5 ml-auto text-muted-foreground" />
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : null}
            </>
          )}
        </div>
      )}
    </div>
  )
}
