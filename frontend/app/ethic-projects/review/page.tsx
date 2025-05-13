"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, FileText, MoreVertical, Filter, Plus, FileCheck } from "lucide-react"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// 审查项目数据
const reviewProjects = [
  {
    id: "1",
    title: "转基因小鼠模型在神经退行性疾病中的应用",
    status: "审核通过",
    reviewType: "初始审查",
    projectType: "动物",
    leader: "张三",
    department: "神经科学研究院",
    committee: "动物实验伦理委员会",
    reviewNumber: "ETH-A-2024-001",
    submittedAt: "2024-05-18"
  },
  {
    id: "2",
    title: "新型靶向生物药物在晚期肿瘤患者中的临床试验",
    status: "待审核",
    reviewType: "复审",
    projectType: "人体",
    leader: "李四",
    department: "肿瘤医学中心",
    committee: "医学伦理委员会",
    reviewNumber: "受理后自动生成",
    submittedAt: "2024-05-22"
  },
  {
    id: "3",
    title: "高血压患者运动干预效果及安全性评估",
    status: "已退回",
    reviewType: "初始审查",
    projectType: "人体",
    leader: "王五",
    department: "运动医学科学院",
    committee: "医学伦理委员会",
    reviewNumber: "受理后自动生成",
    submittedAt: "2024-05-12"
  },
  {
    id: "4",
    title: "哺乳动物模型在药物代谢研究中的应用",
    status: "审核通过",
    reviewType: "复审",
    projectType: "动物",
    leader: "赵六",
    department: "药学院",
    committee: "动物实验伦理委员会",
    reviewNumber: "ETH-A-2023-056",
    submittedAt: "2024-04-15"
  },
  {
    id: "5",
    title: "免疫治疗对同时患有糖尿病患者生活质量影响",
    status: "待审核",
    reviewType: "初始审查",
    projectType: "人体",
    leader: "钱七",
    department: "肿瘤医学中心",
    committee: "医学伦理委员会",
    reviewNumber: "受理后自动生成",
    submittedAt: "2024-05-28"
  },
  {
    id: "6",
    title: "非人灵长类动物在神经递质研究中的应用",
    status: "审核通过",
    reviewType: "初始审查",
    projectType: "动物",
    leader: "孙七",
    department: "神经科学研究院",
    committee: "动物实验伦理委员会",
    reviewNumber: "ETH-A-2024-006",
    submittedAt: "2024-04-03"
  },
  {
    id: "7",
    title: "针对重度抑郁症患者认知行为治疗有效性研究",
    status: "已退回",
    reviewType: "复审",
    projectType: "人体",
    leader: "周八",
    department: "心理学院",
    committee: "医学伦理委员会",
    reviewNumber: "受理后自动生成",
    submittedAt: "2024-05-16"
  },
  {
    id: "8",
    title: "转基因猪模型在器官移植安全性评估中的应用",
    status: "待审核",
    reviewType: "初始审查",
    projectType: "动物",
    leader: "吴九",
    department: "器官移植研究中心",
    committee: "生物安全委员会",
    reviewNumber: "受理后自动生成",
    submittedAt: "2024-05-30"
  }
];

// 状态对应的样式
const getStatusBadge = (status: string) => {
  const statusStyles = {
    "审核通过": "bg-green-100 text-green-800 hover:bg-green-100",
    "待审核": "bg-amber-100 text-amber-800 hover:bg-amber-100",
    "已退回": "bg-red-100 text-red-800 hover:bg-red-100",
    "审核中": "bg-blue-100 text-blue-800 hover:bg-blue-100"
  } as const;
  
  return <Badge className={statusStyles[status as keyof typeof statusStyles] || "bg-gray-100"}>{status}</Badge>;
};

export default function ReviewsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [reviewTypeFilter, setReviewTypeFilter] = useState("all");
  const [projectTypeFilter, setProjectTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // 处理详情查看
  const handleViewDetails = (id: string) => {
    console.log(`正在跳转到详情页，ID: ${id}`);
    // 获取对应项目的详细信息
    const project = reviewProjects.find(p => p.id === id);
    if (project) {
      // 使用reviewNumber作为路由参数，跳转到正确的路径
      router.push(`/ethic-review/initial-review/${project.reviewNumber}`);
    } else {
      console.error(`未找到ID为${id}的项目`);
    }
  };

  // 过滤数据
  const filteredProjects = reviewProjects.filter(project => {
    return (
      (searchTerm === "" || 
       project.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
       project.leader.toLowerCase().includes(searchTerm.toLowerCase()) || 
       project.department.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (reviewTypeFilter === "all" || project.reviewType === reviewTypeFilter) &&
      (projectTypeFilter === "all" || project.projectType === projectTypeFilter) &&
      (statusFilter === "all" || project.status === statusFilter)
    );
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">初始审查</h1>
        <Button onClick={() => {}}>
          <Plus className="h-4 w-4 mr-2" />
          新建审查
        </Button>
      </div>

      {/* 筛选和搜索 */}
      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-[200px]">
          <Input 
            placeholder="搜索项目标题、负责人、院系..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <Select value={reviewTypeFilter} onValueChange={setReviewTypeFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="审查类型" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部审查类型</SelectItem>
            <SelectItem value="初始审查">初始审查</SelectItem>
            <SelectItem value="复审">复审</SelectItem>
          </SelectContent>
        </Select>
        <Select value={projectTypeFilter} onValueChange={setProjectTypeFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="项目类型" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部项目类型</SelectItem>
            <SelectItem value="动物">动物</SelectItem>
            <SelectItem value="人体">人体</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="审核状态" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部状态</SelectItem>
            <SelectItem value="审核通过">审核通过</SelectItem>
            <SelectItem value="待审核">待审核</SelectItem>
            <SelectItem value="已退回">已退回</SelectItem>
            <SelectItem value="审核中">审核中</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={() => {}}>
          <Filter className="h-4 w-4 mr-2" />
          高级筛选
        </Button>
        <Button variant="outline" onClick={() => {}}>
          排序
        </Button>
        <Button variant="outline" onClick={() => {}}>
          视图设置
        </Button>
      </div>

      {/* 项目列表 */}
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[5%]">
                <div className="flex items-center justify-center">
                  <input type="checkbox" className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="w-[15%]">受理号</TableHead>
              <TableHead className="w-[10%]">审查类型</TableHead>
              <TableHead className="w-[10%]">项目类型</TableHead>
              <TableHead className="w-[20%]">项目名称</TableHead>
              <TableHead className="w-[10%]">项目负责人</TableHead>
              <TableHead className="w-[10%]">所属院系</TableHead>
              <TableHead className="w-[10%]">伦理委员会</TableHead>
              <TableHead className="w-[10%]">审核状态</TableHead>
              <TableHead className="w-[10%] text-center">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProjects.map((project) => (
              <TableRow key={project.id}>
                <TableCell>
                  <div className="flex items-center justify-center">
                    <input type="checkbox" className="h-4 w-4" />
                  </div>
                </TableCell>
                <TableCell>{project.reviewNumber}</TableCell>
                <TableCell>{project.reviewType}</TableCell>
                <TableCell>{project.projectType}</TableCell>
                <TableCell className="font-medium">{project.title}</TableCell>
                <TableCell>{project.leader}</TableCell>
                <TableCell>{project.department}</TableCell>
                <TableCell>{project.committee}</TableCell>
                <TableCell>{getStatusBadge(project.status)}</TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 mr-2"
                      onClick={() => handleViewDetails(project.id)}
                    >
                      <Eye className="h-3.5 w-3.5 mr-1" />
                      查看详情
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewDetails(project.id)}>
                          <Eye className="h-4 w-4 mr-2" />
                          查看详情
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <FileText className="h-4 w-4 mr-2" />
                          编辑项目
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <FileCheck className="h-4 w-4 mr-2" />
                          接受审查
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 