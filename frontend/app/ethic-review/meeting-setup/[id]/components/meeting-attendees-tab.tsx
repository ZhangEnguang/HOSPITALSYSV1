"use client"

import { useState } from "react"
import {
  Users,
  UserPlus,
  UserMinus,
  Mail,
  Phone,
  Building,
  Crown,
  Shield,
  User,
  MoreVertical,
  Search,
  Filter,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

interface MeetingAttendeesTabProps {
  meeting: any
}

// 模拟参会人员数据
const mockAttendees = [
  {
    id: "1",
    name: "张三",
    avatar: "/avatars/01.png",
    email: "zhangsan@example.com",
    phone: "138-0000-0001",
    department: "医学伦理委员会",
    title: "主任委员",
    role: "主持人",
    status: "已确认",
    expertise: ["医学伦理", "临床研究"],
  },
  {
    id: "2",
    name: "李四",
    avatar: "/avatars/02.png",
    email: "lisi@example.com",
    phone: "138-0000-0002",
    department: "动物实验伦理委员会",
    title: "副主任委员",
    role: "委员",
    status: "已确认",
    expertise: ["动物伦理", "实验设计"],
  },
  {
    id: "3",
    name: "王五",
    avatar: "/avatars/03.png",
    email: "wangwu@example.com",
    phone: "138-0000-0003",
    department: "生物安全委员会",
    title: "委员",
    role: "委员",
    status: "待确认",
    expertise: ["生物安全", "风险评估"],
  },
  {
    id: "4",
    name: "赵六",
    avatar: "/avatars/04.png",
    email: "zhaoliu@example.com",
    phone: "138-0000-0004",
    department: "法学院",
    title: "教授",
    role: "法律顾问",
    status: "已确认",
    expertise: ["法律事务", "合规审查"],
  },
  {
    id: "5",
    name: "钱七",
    avatar: "/avatars/05.png",
    email: "qianqi@example.com",
    phone: "138-0000-0005",
    department: "统计学院",
    title: "副教授",
    role: "统计顾问",
    status: "已拒绝",
    expertise: ["统计分析", "数据科学"],
  },
]

export default function MeetingAttendeesTab({ meeting }: MeetingAttendeesTabProps) {
  const [attendees, setAttendees] = useState(mockAttendees)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "主持人":
        return <Crown className="h-4 w-4 text-yellow-500" />
      case "法律顾问":
        return <Shield className="h-4 w-4 text-blue-500" />
      default:
        return <User className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "已确认":
        return "bg-green-50 text-green-600 border-green-200"
      case "待确认":
        return "bg-amber-50 text-amber-600 border-amber-200"
      case "已拒绝":
        return "bg-rose-50 text-rose-600 border-rose-200"
      default:
        return "bg-gray-50 text-gray-600 border-gray-200"
    }
  }

  const filteredAttendees = attendees.filter(attendee => {
    const matchesSearch = attendee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         attendee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         attendee.role.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === "all" || attendee.status === filterStatus
    
    return matchesSearch && matchesStatus
  })

  const handleRemoveAttendee = (attendeeId: string) => {
    setAttendees(attendees.filter(a => a.id !== attendeeId))
    toast({
      title: "参会者已移除",
      description: "该参会者已从会议中移除",
    })
  }

  const handleResendInvitation = (attendee: any) => {
    toast({
      title: "邀请已重新发送",
      description: `已向 ${attendee.name} 重新发送会议邀请`,
    })
  }

  const statusStats = {
    total: attendees.length,
    confirmed: attendees.filter(a => a.status === "已确认").length,
    pending: attendees.filter(a => a.status === "待确认").length,
    declined: attendees.filter(a => a.status === "已拒绝").length,
  }

  return (
    <div className="space-y-6">
      {/* 顶部统计和操作 */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{statusStats.total}</div>
            <div className="text-sm text-muted-foreground">总人数</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{statusStats.confirmed}</div>
            <div className="text-sm text-muted-foreground">已确认</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-600">{statusStats.pending}</div>
            <div className="text-sm text-muted-foreground">待确认</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-rose-600">{statusStats.declined}</div>
            <div className="text-sm text-muted-foreground">已拒绝</div>
          </div>
        </div>
        
        <Button className="gap-2">
          <UserPlus className="h-4 w-4" />
          添加参会者
        </Button>
      </div>

      {/* 搜索和筛选 */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索参会者姓名、部门或角色..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              状态筛选
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setFilterStatus("all")}>
              全部状态
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterStatus("已确认")}>
              已确认
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterStatus("待确认")}>
              待确认
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterStatus("已拒绝")}>
              已拒绝
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* 参会者列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAttendees.map((attendee) => (
          <Card key={attendee.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={attendee.avatar} alt={attendee.name} />
                    <AvatarFallback>{attendee.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">{attendee.name}</div>
                    <div className="text-sm text-muted-foreground">{attendee.title}</div>
                  </div>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleResendInvitation(attendee)}>
                      <Mail className="h-4 w-4 mr-2" />
                      重新发送邀请
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleRemoveAttendee(attendee.id)}
                      className="text-destructive"
                    >
                      <UserMinus className="h-4 w-4 mr-2" />
                      移除参会者
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getRoleIcon(attendee.role)}
                  <span className="text-sm font-medium">{attendee.role}</span>
                </div>
                <Badge variant="outline" className={cn("px-2 py-0.5 border", getStatusColor(attendee.status))}>
                  {attendee.status}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span>{attendee.department}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{attendee.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{attendee.phone}</span>
                </div>
              </div>
              
              {attendee.expertise && attendee.expertise.length > 0 && (
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">专业领域</div>
                  <div className="flex flex-wrap gap-1">
                    {attendee.expertise.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAttendees.length === 0 && (
        <div className="text-center py-8">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <div className="text-lg font-semibold mb-2">暂无参会者</div>
          <div className="text-muted-foreground">
            {searchTerm || filterStatus !== "all" ? "没有找到符合条件的参会者" : "还没有添加任何参会者"}
          </div>
        </div>
      )}
    </div>
  )
} 