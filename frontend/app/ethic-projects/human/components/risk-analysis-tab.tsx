"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  BarChart3,
  ChevronRight,
  Thermometer,
  Shield,
  FileText,
  ListChecks,
  PieChart,
  ArrowRight,
  Stethoscope,
  HeartPulse,
  ShieldAlert,
  Pill,
  Brain,
  UserRound,
  Clock,
  Loader2,
  FileWarning,
  CircleAlert,
  Info,
  BadgeCheck,
  BadgeAlert,
  ThumbsUp,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// 人体伦理项目风险分析组件
export default function RiskAnalysisTab({ todo }: { todo?: any }) {
  const [activeTab, setActiveTab] = useState("risk")
  const [activeRisk, setActiveRisk] = useState("all")
  
  // 风险评估和控制数据
  const riskData = [
    {
      id: 1,
      category: "安全风险",
      icon: <ShieldAlert className="h-4 w-4 text-red-500" />,
      risks: [
        {
          name: "药物不良反应",
          level: "中等",
          probability: "低",
          impact: "高",
          controlMeasures: [
            "严格按照受试者纳入排除标准筛选",
            "设立不良反应监测与报告机制",
            "制定紧急处理预案与流程"
          ],
          status: "受控"
        },
        {
          name: "饮食不耐受",
          level: "低",
          probability: "中",
          impact: "低",
          controlMeasures: [
            "提前评估受试者饮食习惯与可能的不耐受",
            "设计灵活的饮食方案，允许适当调整",
            "定期随访了解受试者适应情况"
          ],
          status: "受控"
        }
      ]
    },
    {
      id: 2,
      category: "伦理风险",
      icon: <UserRound className="h-4 w-4 text-blue-500" />,
      risks: [
        {
          name: "知情同意不充分",
          level: "中等",
          probability: "低",
          impact: "高",
          controlMeasures: [
            "使用通俗易懂的语言设计知情同意书",
            "设置知情同意评估问卷确保受试者理解",
            "保留受试者随时退出的权利"
          ],
          status: "受控"
        },
        {
          name: "隐私数据泄露",
          level: "中等",
          probability: "低",
          impact: "高",
          controlMeasures: [
            "采用去标识化管理患者数据",
            "严格控制数据访问权限",
            "签署数据保密协议"
          ],
          status: "受控"
        }
      ]
    },
    {
      id: 3,
      category: "科研风险",
      icon: <Brain className="h-4 w-4 text-purple-500" />,
      risks: [
        {
          name: "样本量不足",
          level: "中等",
          probability: "中",
          impact: "高",
          controlMeasures: [
            "预留更多的招募时间",
            "扩大招募渠道",
            "建立受试者激励机制"
          ],
          status: "监测中"
        },
        {
          name: "依从性不佳",
          level: "中等",
          probability: "高",
          impact: "高",
          controlMeasures: [
            "设计简化的饮食记录方式",
            "定期提醒与随访",
            "提供专业指导与支持"
          ],
          status: "需要加强"
        }
      ]
    }
  ]
  
  // 不良事件报告数据
  const adverseEventData = [
    {
      id: 1,
      name: "轻度消化不适",
      level: "轻微",
      date: "2024-02-15",
      relatedToStudy: "可能相关",
      description: "3名受试者报告在饮食干预初期出现轻度消化不适，主要表现为腹胀",
      action: "建议少量多餐，调整饮食结构",
      outcome: "症状已缓解"
    },
    {
      id: 2,
      name: "头晕不适",
      level: "轻微",
      date: "2024-03-05",
      relatedToStudy: "不太可能相关",
      description: "1名受试者报告间歇性头晕，经检查为低血压所致，与基础疾病相关",
      action: "调整原有降压药物剂量，继续参与研究",
      outcome: "症状改善"
    },
    {
      id: 3,
      name: "皮疹",
      level: "中度",
      date: "2024-03-12",
      relatedToStudy: "不相关",
      description: "1名受试者出现皮疹，经皮肤科会诊确认为季节性过敏",
      action: "给予抗过敏治疗，不影响研究参与",
      outcome: "完全恢复"
    }
  ]
  
  // 风险监测指标数据
  const monitoringData = [
    {
      id: 1,
      name: "受试者退出率",
      current: "3.8%",
      threshold: "10%",
      status: "正常",
      trend: "稳定"
    },
    {
      id: 2,
      name: "严重不良事件发生率",
      current: "0%",
      threshold: "3%",
      status: "正常",
      trend: "稳定"
    },
    {
      id: 3,
      name: "方案依从性",
      current: "68%",
      threshold: "65%",
      status: "正常",
      trend: "波动"
    },
    {
      id: 4,
      name: "随访完成率",
      current: "92%",
      threshold: "85%",
      status: "优秀",
      trend: "上升"
    },
    {
      id: 5,
      name: "数据质量评分",
      current: "92分",
      threshold: "85分",
      status: "优秀",
      trend: "上升"
    }
  ]

  // 获取风险等级样式
  const getRiskLevelStyle = (level: string) => {
    switch (level.toLowerCase()) {
      case "高":
        return "bg-red-100 text-red-800 border border-red-200"
      case "中等":
        return "bg-amber-100 text-amber-800 border border-amber-200"
      case "低":
        return "bg-green-100 text-green-800 border border-green-200"
      default:
        return "bg-slate-100 text-slate-800 border border-slate-200"
    }
  }
  
  // 获取不良事件等级样式
  const getEventLevelStyle = (level: string) => {
    switch (level.toLowerCase()) {
      case "严重":
        return "bg-red-100 text-red-800 border border-red-200"
      case "中度":
        return "bg-amber-100 text-amber-800 border border-amber-200"
      case "轻微":
        return "bg-blue-100 text-blue-800 border border-blue-200"
      default:
        return "bg-slate-100 text-slate-800 border border-slate-200"
    }
  }
  
  // 获取监测指标状态样式
  const getMonitoringStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "优秀":
        return "bg-green-100 text-green-800 border border-green-200"
      case "正常":
        return "bg-blue-100 text-blue-800 border border-blue-200"
      case "警告":
        return "bg-amber-100 text-amber-800 border border-amber-200"
      case "危险":
        return "bg-red-100 text-red-800 border border-red-200"
      default:
        return "bg-slate-100 text-slate-800 border border-slate-200"
    }
  }
  
  // 获取趋势图标
  const getTrendIcon = (trend: string) => {
    switch (trend.toLowerCase()) {
      case "上升":
        return <ArrowRight className="h-3.5 w-3.5 rotate-[-45deg] text-green-600" />
      case "下降":
        return <ArrowRight className="h-3.5 w-3.5 rotate-45deg text-red-600" />
      case "波动":
        return <ArrowRight className="h-3.5 w-3.5 rotate-90deg text-amber-600" />
      case "稳定":
      default:
        return <ArrowRight className="h-3.5 w-3.5 text-blue-600" />
    }
  }

  // 获取优先级样式
  const getPriorityStyle = (priority: string) => {
    const styles = {
      high: {
        badge: "bg-red-100 text-red-700 border-red-200",
        progress: "bg-red-500",
        icon: <AlertTriangle className="h-4 w-4 text-red-600" />,
      },
      medium: {
        badge: "bg-amber-100 text-amber-700 border-amber-200",
        progress: "bg-amber-500",
        icon: <AlertCircle className="h-4 w-4 text-amber-600" />,
      },
      low: {
        badge: "bg-green-100 text-green-700 border-green-200",
        progress: "bg-green-500",
        icon: <CheckCircle className="h-4 w-4 text-green-600" />,
      },
    };
    
    switch (priority.toLowerCase()) {
      case "高":
        return styles.high;
      case "中":
        return styles.medium;
      case "低":
        return styles.low;
      default:
        return styles.medium;
    }
  };
  
  // 模拟风险数据
  const riskDataSimulated = [
    {
      id: "1",
      category: "伦理合规风险",
      name: "知情同意流程不完善",
      description: "部分患者可能未充分理解研究的潜在风险和收益",
      priority: "高",
      status: "已缓解",
      mitigationPlan: "改进知情同意表格，增加视觉辅助材料，引入理解度测试",
      responsiblePerson: "李助理",
      lastUpdate: "2024-02-15"
    },
    {
      id: "2",
      category: "患者安全风险",
      name: "饮食干预不良反应",
      description: "饮食干预可能导致部分参与者出现不适或过敏反应",
      priority: "中",
      status: "监控中",
      mitigationPlan: "详细筛查患者过敏史，建立不良反应快速响应流程",
      responsiblePerson: "张医生",
      lastUpdate: "2024-02-20"
    },
    {
      id: "3",
      category: "数据安全风险",
      name: "患者隐私数据泄露",
      description: "研究过程中收集的敏感健康数据可能面临泄露风险",
      priority: "高",
      status: "已缓解",
      mitigationPlan: "实施数据脱敏处理，强化数据访问权限管理，定期安全审计",
      responsiblePerson: "周工程师",
      lastUpdate: "2024-01-30"
    },
    {
      id: "4",
      category: "研究质量风险",
      name: "高退出率影响研究有效性",
      description: "长周期干预研究可能面临较高的参与者退出率",
      priority: "中",
      status: "监控中",
      mitigationPlan: "优化参与者体验，提供合理补贴，增加随访提醒",
      responsiblePerson: "王教授",
      lastUpdate: "2024-02-25"
    },
    {
      id: "5",
      category: "伦理合规风险",
      name: "弱势群体保护不足",
      description: "研究中可能包含老年人等需要特殊保护的弱势群体",
      priority: "中",
      status: "已解决",
      mitigationPlan: "制定弱势群体特殊保护方案，指定专人负责",
      responsiblePerson: "刘营养师",
      lastUpdate: "2024-01-20"
    }
  ];
  
  // 按优先级分组的风险数量
  const riskByPriority = {
    high: riskDataSimulated.filter(risk => risk.priority === "高").length,
    medium: riskDataSimulated.filter(risk => risk.priority === "中").length,
    low: riskDataSimulated.filter(risk => risk.priority === "低").length
  };
  
  // 按状态分组的风险数量
  const riskByStatus = {
    mitigated: riskDataSimulated.filter(risk => risk.status === "已缓解" || risk.status === "已解决").length,
    monitoring: riskDataSimulated.filter(risk => risk.status === "监控中").length,
    unresolved: riskDataSimulated.filter(risk => risk.status === "未解决").length
  };
  
  // 按类别分组
  const riskCategories = [...new Set(riskDataSimulated.map(risk => risk.category))];
  const riskByCategory = riskCategories.map(category => ({
    name: category,
    count: riskDataSimulated.filter(risk => risk.category === category).length
  }));
  
  // 根据当前激活的风险过滤器过滤风险
  const filteredRisks = activeRisk === "all" 
    ? riskDataSimulated 
    : riskDataSimulated.filter(risk => {
        if (activeRisk === "high") return risk.priority === "高";
        if (activeRisk === "medium") return risk.priority === "中";
        if (activeRisk === "low") return risk.priority === "低";
        if (activeRisk === "mitigated") return risk.status === "已缓解" || risk.status === "已解决";
        if (activeRisk === "monitoring") return risk.status === "监控中";
        if (activeRisk === "unresolved") return risk.status === "未解决";
        return false;
      });
  
  // 获取状态样式
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "已缓解":
      case "已解决":
        return "bg-green-100 text-green-700 border-green-200";
      case "监控中":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "未解决":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* 风险概览卡片 */}
      <Card className="border-slate-200 shadow-sm">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            风险分析与缓解
          </CardTitle>
          <CardDescription>
            人体伦理项目风险评估、监控与缓解措施
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 按风险优先级分组卡片 */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="py-3">
                <CardTitle className="text-sm flex items-center gap-2 text-slate-700">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  按风险优先级
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                      <span className="text-sm text-slate-600">高风险</span>
                    </div>
                    <span className="text-sm font-medium">{riskByPriority.high}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-red-500 rounded-full" 
                      style={{width: `${(riskByPriority.high / riskDataSimulated.length) * 100}%`}}
                    ></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-amber-500 mr-2"></div>
                      <span className="text-sm text-slate-600">中风险</span>
                    </div>
                    <span className="text-sm font-medium">{riskByPriority.medium}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-amber-500 rounded-full" 
                      style={{width: `${(riskByPriority.medium / riskDataSimulated.length) * 100}%`}}
                    ></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-sm text-slate-600">低风险</span>
                    </div>
                    <span className="text-sm font-medium">{riskByPriority.low}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 rounded-full" 
                      style={{width: `${(riskByPriority.low / riskDataSimulated.length) * 100}%`}}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* 按风险状态分组卡片 */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="py-3">
                <CardTitle className="text-sm flex items-center gap-2 text-slate-700">
                  <Shield className="h-4 w-4 text-green-500" />
                  按风险状态
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-sm text-slate-600">已缓解</span>
                    </div>
                    <span className="text-sm font-medium">{riskByStatus.mitigated}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 rounded-full" 
                      style={{width: `${(riskByStatus.mitigated / riskDataSimulated.length) * 100}%`}}
                    ></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                      <span className="text-sm text-slate-600">监控中</span>
                    </div>
                    <span className="text-sm font-medium">{riskByStatus.monitoring}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full" 
                      style={{width: `${(riskByStatus.monitoring / riskDataSimulated.length) * 100}%`}}
                    ></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                      <span className="text-sm text-slate-600">未解决</span>
                    </div>
                    <span className="text-sm font-medium">{riskByStatus.unresolved}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-red-500 rounded-full" 
                      style={{width: `${(riskByStatus.unresolved / riskDataSimulated.length) * 100}%`}}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* 按风险类别分组卡片 */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="py-3">
                <CardTitle className="text-sm flex items-center gap-2 text-slate-700">
                  <Loader2 className="h-4 w-4 text-blue-500" />
                  按风险类别
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 pb-3">
                <div className="space-y-4">
                  {riskByCategory.map((category, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">{category.name}</span>
                        <span className="text-sm font-medium">{category.count}</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-purple-500 rounded-full" 
                          style={{width: `${(category.count / riskDataSimulated.length) * 100}%`}}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
      
      {/* 风险列表与过滤器 */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle className="text-lg">风险项目清单</CardTitle>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant={activeRisk === "all" ? "secondary" : "outline"} 
                size="sm"
                onClick={() => setActiveRisk("all")}
                className="h-8"
              >
                全部
              </Button>
              <Button 
                variant={activeRisk === "high" ? "secondary" : "outline"} 
                size="sm"
                onClick={() => setActiveRisk("high")}
                className="h-8"
              >
                高风险
              </Button>
              <Button 
                variant={activeRisk === "mitigated" ? "secondary" : "outline"} 
                size="sm"
                onClick={() => setActiveRisk("mitigated")}
                className="h-8"
              >
                已缓解
              </Button>
              <Button 
                variant={activeRisk === "monitoring" ? "secondary" : "outline"} 
                size="sm"
                onClick={() => setActiveRisk("monitoring")}
                className="h-8"
              >
                监控中
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead>风险名称</TableHead>
                <TableHead>类别</TableHead>
                <TableHead>优先级</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>负责人</TableHead>
                <TableHead>更新日期</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRisks.map((risk) => {
                const priorityStyle = getPriorityStyle(risk.priority);
                return (
                  <TableRow key={risk.id}>
                    <TableCell className="font-medium">
                      <div>
                        {risk.name}
                        <p className="text-xs text-slate-500 mt-1">{risk.description}</p>
                      </div>
                    </TableCell>
                    <TableCell>{risk.category}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={priorityStyle.badge}
                      >
                        {priorityStyle.icon}
                        <span className="ml-1">{risk.priority}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={getStatusStyle(risk.status)}
                      >
                        {risk.status === "已缓解" || risk.status === "已解决" ? 
                          <CheckCircle className="h-3 w-3 mr-1" /> : 
                          risk.status === "监控中" ? 
                            <Clock className="h-3 w-3 mr-1" /> : 
                            <AlertCircle className="h-3 w-3 mr-1" />
                        }
                        {risk.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{risk.responsiblePerson}</TableCell>
                    <TableCell>{risk.lastUpdate}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          
          {filteredRisks.length === 0 && (
            <div className="py-8 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 mb-4">
                <ShieldAlert className="h-6 w-6 text-slate-400" />
              </div>
              <p className="text-sm text-slate-500">没有找到符合条件的风险项目</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* 风险缓解措施 */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-500" />
            风险缓解与防控措施
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredRisks.map((risk) => (
              <div key={risk.id} className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex-none">
                    {getPriorityStyle(risk.priority).icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">{risk.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{risk.category}</p>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`ml-auto ${getStatusStyle(risk.status)}`}
                  >
                    {risk.status}
                  </Badge>
                </div>
                <div className="space-y-3 ml-8">
                  <Separator />
                  <div>
                    <h4 className="text-xs font-medium text-slate-700 mb-1">缓解措施</h4>
                    <p className="text-sm text-slate-600">{risk.mitigationPlan}</p>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">负责人: {risk.responsiblePerson}</span>
                    <span className="text-slate-500">最后更新: {risk.lastUpdate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 