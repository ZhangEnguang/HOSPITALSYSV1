"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { use } from "react" 
import {
  ArrowLeft,
  Calendar,
  User,
  Edit2,
  Save,
  X,
  GitBranch,
  DollarSign,
  Award,
  AlertTriangle,
  FileIcon,
  Trash2,
  ClipboardList,
  PenSquare,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { todoItems } from "../data/mock-data"
import { toast } from "@/hooks/use-toast"

// 
import OverviewTab from "./components/overview-tab"
import ReportsTab from "./components/reports-tab"
import ProcessTab from "./components/process-tab"
import FundsTab from "./components/funds-tab"
import AchievementsTab from "./components/achievements-tab"
import RisksTab from "./components/risks-tab"
import ReviewSidebar from "./components/review-sidebar"
import AuditStepsDropdown from "./components/audit-steps-dropdown"

// 
import { completedItems } from "../data/mock-data"

export default function TodoDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  // 
  const unwrappedParams = use(params)
  const id = Number.parseInt(unwrappedParams.id)
  const [todo, setTodo] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState("")
  const [activeTab, setActiveTab] = useState("overview")
  const [showReviewSidebar, setShowReviewSidebar] = useState(true) // 
  // 
  const [todoStatus, setTodoStatus] = useState<string>("")
  // 
  const [reviewStatusLabel, setReviewStatusLabel] = useState<string>("")

  // 
  const editContainerRef = useRef<HTMLDivElement>(null)

  // 
  useEffect(() => {
    try {
      // 
      let foundTodo = todoItems.find((item) => item.id === id)

      // 
      if (!foundTodo) {
        foundTodo = completedItems.find((item) => item.id === id)
      }

      if (foundTodo) {
        setTodo(foundTodo)
        setEditedTitle(foundTodo.title)
        setTodoStatus(foundTodo.status || "")

        // 
        if (foundTodo.status === "已通过") {
          setReviewStatusLabel("管理员审核通过")
        } else if (foundTodo.status === "已退回") {
          setReviewStatusLabel("管理员审核退回")
        } else {
          setReviewStatusLabel("科研院退回")
        }
      }
    } catch (error) {
      console.error("Error fetching todo:", error)
    } finally {
      setIsLoading(false)
    }
  }, [id])

  // 
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (editContainerRef.current && !editContainerRef.current.contains(event.target as Node) && isEditing) {
        cancelEditing()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isEditing])

  // 
  useEffect(() => {
    const handleRouteChange = () => {
      setActiveTab("overview");
    };

    window.addEventListener('popstate', handleRouteChange);
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  useEffect(() => {
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
      const tabId = button.getAttribute('data-tab-id');
      if (tabId === activeTab) {
        button.classList.add('active-tab');
      } else {
        button.classList.remove('active-tab');
      }
    });
  }, [activeTab]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (editContainerRef.current && !editContainerRef.current.contains(event.target as Node) && isEditing) {
        cancelEditing()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isEditing])

  // 
  useEffect(() => {
    const handleSwitchToOverviewTab = () => {
      setActiveTab("overview")
    }

    window.addEventListener("switchToOverviewTab", handleSwitchToOverviewTab)
    return () => {
      window.removeEventListener("switchToOverviewTab", handleSwitchToOverviewTab)
    }
  }, [])

  // 
  useEffect(() => {
    const handleUpdateProjectStatus = (event: any) => {
      const { status, label } = event.detail
      if (status) {
        setTodoStatus(status)
      }
      if (label) {
        setReviewStatusLabel(label)
      }
    }

    window.addEventListener("updateProjectStatus", handleUpdateProjectStatus as EventListener)
    return () => {
      window.removeEventListener("updateProjectStatus", handleUpdateProjectStatus as EventListener)
    }
  }, [])

  // 
  useEffect(() => {
    // 
    const urlParams = new URLSearchParams(window.location.search)
    const fromCompleted = urlParams.get("from") === "completed"

    if (fromCompleted) {
      // 
      setActiveTab("overview")
    }
  }, [])

  // 
  useEffect(() => {
    // 
    setActiveTab("overview")

    // 
    const handleRouteChange = () => {
      setActiveTab("overview")
    }

    // 
    window.addEventListener('popstate', handleRouteChange)
    window.addEventListener('pushstate', handleRouteChange)

    // 
    return () => {
      window.removeEventListener('popstate', handleRouteChange)
      window.removeEventListener('pushstate', handleRouteChange)
    }
  }, [id]) // 

  // 
  const handleBack = () => {
    router.back()
  }

  // 
  const startEditing = () => {
    setIsEditing(true)
  }

  const cancelEditing = () => {
    setIsEditing(false)
    setEditedTitle(todo?.title || "")
  }

  const saveTitle = () => {
    if (todo && editedTitle.trim()) {
      setTodo({ ...todo, title: editedTitle })
      setIsEditing(false)
      // 
    }
  }

  // 
  const handleEditProject = () => {
    toast({
      title: "",
      description: "",
      duration: 3000,
    })
  }

  // 
  const getStatusColor = (status: string) => {
    switch (status) {
      case "":
        return "bg-amber-50 text-amber-700 border-amber-200"
      case "已通过":
        return "bg-green-50 text-green-700 border-green-200"
      case "已退回":
        return "bg-red-50 text-red-700 border-red-200"
      case "已完结":
        return "bg-slate-50 text-slate-700 border-slate-200"
      case "进行中":
        return "bg-green-50 text-green-700 border-green-200"
      default:
        return "bg-slate-50 text-slate-700 border-slate-200"
    }
  }

  // 
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "":
        return "bg-red-500 text-white"
      case "":
        return "bg-amber-50 text-amber-700"
      case "":
        return "bg-green-50 text-green-700"
      case "":
        return "bg-black text-white"
      default:
        return "bg-slate-50 text-slate-700"
    }
  }

  // 
  const toggleReviewSidebar = () => {
    setShowReviewSidebar(!showReviewSidebar)
  }

  // 
  const handleStatusChange = (newStatus: string) => {
    setTodoStatus(newStatus)

    // 
    if (newStatus === "已通过") {
      setReviewStatusLabel("管理员审核通过")
    } else if (newStatus === "已退回") {
      setReviewStatusLabel("管理员审核退回")
    }

    if (todo) {
      // 
      const updatedTodo = { ...todo, status: newStatus }
      setTodo(updatedTodo)

      // 
      if (newStatus === "已通过" || newStatus === "已退回") {
        // 
        console.log(``)

        // 
        setTimeout(() => {
          // 
          setTodoStatus((prev) => (prev === newStatus ? prev : newStatus))
        }, 0)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center items-center min-h-[60vh]">
        <div className="text-sm text-muted-foreground"></div>
      </div>
    )
  }

  if (!todo) {
    return (
      <div className="p-8">
        <Button variant="ghost" size="sm" onClick={handleBack} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          
        </Button>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2"></h2>
          <p className="text-muted-foreground"></p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* */}
      <div className={`flex-1 overflow-auto pb-8 ${showReviewSidebar ? "pr-[370px]" : "pr-8"}`}>
        {/* */}
        <div className="flex flex-col md:flex-row md:items-start justify-between mb-2">
          <div className="flex flex-col">
            <div className="flex items-center gap-4">
              {/* */}
              <button
                onClick={handleBack}
                className="h-8 w-8 flex items-center justify-center bg-white border rounded-md text-gray-500 hover:text-primary transition-colors duration-200"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>

              {isEditing ? (
                <div className="flex items-center gap-2" ref={editContainerRef}>
                  <Input
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    className="text-2xl font-bold py-2 h-auto"
                    autoFocus
                  />
                  <Button size="sm" variant="ghost" onClick={saveTitle}>
                    <Save className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={cancelEditing}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold flex items-center gap-2">
                    {todo.title}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={startEditing}
                      className="h-8 w-8 p-0 transition-colors duration-200"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </h1>
                  {/* */}
                  <Badge className={getStatusColor(todoStatus || "")}>{todoStatus || ""}</Badge>

                  {/* */}
                  <AuditStepsDropdown currentStepLabel={reviewStatusLabel} />
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 mt-4 md:mt-0">
            {/* 编辑按钮 */}
            <Button variant="outline" className="gap-2 transition-colors duration-200" onClick={handleEditProject}>
              <PenSquare className="h-4 w-4" />
              编辑
            </Button>
            <Button variant="destructive" className="gap-2 transition-colors duration-200">
              <Trash2 className="h-4 w-4" />
              删除
            </Button>
          </div>
        </div>

        {/* */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-6 ml-12">
          <div className="flex items-center text-sm text-muted-foreground">
            <User className="h-4 w-4 mr-2" />
            <span className="font-medium mr-1"></span> {todo.applicant}
          </div>

          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2" />
            <span className="font-medium mr-1"></span> 2024-01-01 
          </div>
        </div>

        {/* */}
        <div className="flex overflow-x-auto pb-2 mb-4 border-b gap-2.5 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 scrollbar-thumb-rounded-full">
          <Button
            key={`tab-overview-${activeTab === "overview"}`}
            variant={activeTab === "overview" ? "default" : "ghost"}
            size="sm"
            className={`shrink-0 transition-colors duration-200 ${activeTab !== "overview" ? "hover:bg-white" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            <FileIcon className="h-4 w-4 mr-2" />
            项目概览
          </Button>
          <Button
            key={`tab-process-${activeTab === "process"}`}
            variant={activeTab === "process" ? "default" : "ghost"}
            size="sm"
            className={`shrink-0 transition-colors duration-200 ${activeTab !== "process" ? "hover:bg-white" : ""}`}
            onClick={() => setActiveTab("process")}
          >
            <GitBranch className="h-4 w-4 mr-2" />
            执行过程
          </Button>
          <Button
            key={`tab-funds-${activeTab === "funds"}`}
            variant={activeTab === "funds" ? "default" : "ghost"}
            size="sm"
            className={`shrink-0 transition-colors duration-200 ${activeTab !== "funds" ? "hover:bg-white" : ""}`}
            onClick={() => setActiveTab("funds")}
          >
            <DollarSign className="h-4 w-4 mr-2" />
            经费管理
          </Button>
          <Button
            key={`tab-achievements-${activeTab === "achievements"}`}
            variant={activeTab === "achievements" ? "default" : "ghost"}
            size="sm"
            className={`shrink-0 transition-colors duration-200 ${activeTab !== "achievements" ? "hover:bg-white" : ""}`}
            onClick={() => setActiveTab("achievements")}
          >
            <Award className="h-4 w-4 mr-2" />
            成果管理
          </Button>
          <Button
            key={`tab-risks-${activeTab === "risks"}`}
            variant={activeTab === "risks" ? "default" : "ghost"}
            size="sm"
            className={`shrink-0 transition-colors duration-200 ${activeTab !== "risks" ? "hover:bg-white" : ""}`}
            onClick={() => setActiveTab("risks")}
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            风险与问题
          </Button>
          <Button
            key={`tab-reports-${activeTab === "reports"}`}
            variant={activeTab === "reports" ? "default" : "ghost"}
            size="sm"
            className={`shrink-0 transition-colors duration-200 ${activeTab !== "reports" ? "hover:bg-white" : ""}`}
            onClick={() => setActiveTab("reports")}
          >
            <ClipboardList className="h-4 w-4 mr-2" />
            项目报告
          </Button>
        </div>

        {/* */}
        {activeTab === "overview" && (
          <OverviewTab todo={{ ...todo, status: todoStatus }} getPriorityColor={getPriorityColor} />
        )}
        {activeTab === "process" && <ProcessTab />}
        {activeTab === "funds" && <FundsTab />}
        {activeTab === "achievements" && <AchievementsTab />}
        {activeTab === "risks" && <RisksTab />}
        {activeTab === "reports" && <ReportsTab />}
      </div>

      {/* */}
      {showReviewSidebar && (
        <ReviewSidebar
          status={todoStatus}
          getStatusColor={getStatusColor}
          projectId={id.toString()}
          projectTitle={todo.title}
        />
      )}
    </div>
  )
}
