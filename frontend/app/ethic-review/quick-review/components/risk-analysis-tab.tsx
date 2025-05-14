"use client"

import {
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Shield,
  MessageCircle,
  LightbulbIcon,
  Brain,
  Activity,
  BarChart3,
  RotateCw,
  Timer,
  BrainCircuit,
  Calculator
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { useState } from "react"

// 风险等级组件
function RiskLevelBadge({ level }: { level: string }) {
  const getColorClass = () => {
    switch (level) {
      case "低":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "中":
        return "bg-amber-100 text-amber-800 hover:bg-amber-100"
      case "中高":
      case "高":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      default:
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
    }
  }

  const getIcon = () => {
    switch (level) {
      case "低":
        return <CheckCircle2 className="h-4 w-4 mr-1" />
      case "中":
        return <AlertCircle className="h-4 w-4 mr-1" />
      case "中高":
      case "高":
        return <AlertTriangle className="h-4 w-4 mr-1" />
      default:
        return <AlertCircle className="h-4 w-4 mr-1" />
    }
  }

  return (
    <Badge className={cn("flex items-center", getColorClass())}>
      {getIcon()}
      <span>{level}风险</span>
    </Badge>
  )
}

// 风险分析标签页组件
export default function RiskAnalysisTab({
  project
}: { 
  project: any 
}) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastAnalyzed, setLastAnalyzed] = useState("2024-05-25 10:30");

  // 获取风险信息
  const riskInfo = project.risk || {
    level: "中",
    analysis: "暂无风险分析信息",
    suggestions: ["暂无风险建议"],
    aiConfidence: 92
  }

  // 处理刷新AI分析
  const handleRefreshAnalysis = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastAnalyzed(new Date().toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }).replace(/\//g, '-'));
    }, 2000);
  }

  return (
    <div className="space-y-6">
      {/* 风险分析卡片 */}
      <Card className="border-t-4 border-t-blue-500 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CardTitle className="text-lg font-semibold">风险评估</CardTitle>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                <BrainCircuit className="h-3 w-3 mr-1" />
                <span>AI辅助分析</span>
              </Badge>
            </div>
            <RiskLevelBadge level={riskInfo.level} />
          </div>
          <CardDescription className="flex items-center justify-between mt-2">
            <span>项目整体风险评估及控制建议</span>
            <span className="text-xs text-gray-500 flex items-center">
              <Timer className="h-3 w-3 mr-1" />
              最近分析: {lastAnalyzed}
            </span>
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* AI置信度指示器 */}
          <div className="bg-white p-4 rounded-md border border-blue-100 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="bg-blue-50 p-1.5 rounded-md">
                  <Brain className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-slate-700">AI分析置信度</span>
              </div>
              <Badge className="bg-blue-50 text-blue-700 border-blue-200 px-2">
                {riskInfo.aiConfidence || 95}%
              </Badge>
            </div>
            
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${riskInfo.aiConfidence || 95}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between mt-3 text-xs text-slate-500">
              <div className="flex items-center">
                <BrainCircuit className="h-3 w-3 text-blue-500 mr-1" />
                <span>基于EthicGPT 2024 v3.1模型</span>
              </div>
              <div className="flex items-center">
                <Calculator className="h-3 w-3 text-blue-500 mr-1" />
                <span>基于85个特征点</span>
              </div>
            </div>
          </div>

          {/* 风险分析 */}
          <div>
            <h3 className="text-sm font-medium flex items-center text-gray-700 mb-3">
              <AlertTriangle className="h-4 w-4 text-amber-500 mr-2" />
              风险分析
            </h3>
            <div className="pl-6 text-sm text-gray-600 leading-relaxed bg-white p-4 rounded-md border border-blue-100 shadow-sm">
              {riskInfo.analysis}
            </div>
          </div>

          <Separator />

          {/* 风险缓解措施 */}
          <div>
            <h3 className="text-sm font-medium flex items-center text-gray-700 mb-3">
              <Shield className="h-4 w-4 text-blue-500 mr-2" />
              风险缓解建议
            </h3>
            <div className="pl-0">
              <ul className="space-y-3">
                {riskInfo.suggestions.map((suggestion: string, index: number) => (
                  <li key={index} className="flex items-start bg-white p-3 rounded-md border border-blue-100 shadow-sm hover:shadow-md transition-all duration-200">
                    <div className="bg-amber-50 p-1 rounded-full mr-3 mt-0.5 flex-shrink-0">
                      <LightbulbIcon className="h-3.5 w-3.5 text-amber-500" />
                    </div>
                    <span className="text-sm text-gray-700">{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 动物实验特殊风险分析，仅在动物项目中显示 */}
          {project.projectType === "动物" && (
            <>
              <Separator />
              <div>
                <h3 className="text-sm font-medium flex items-center text-gray-700 mb-3">
                  <MessageCircle className="h-4 w-4 text-blue-500 mr-2" />
                  动物福利评估
                </h3>
                <div className="pl-6 text-sm text-gray-600 leading-relaxed bg-white p-4 rounded-md border border-blue-100 shadow-sm">
                  <p className="font-medium text-gray-700 mb-2">该项目在动物福利保障方面制定了完整措施：</p>
                  <ul className="space-y-2">
                    {[
                      "实验前对动物进行适应性饲养和健康检查",
                      "实验过程中采用适当的麻醉和镇痛方案",
                      "提供丰容环境和舒适饲养条件",
                      "严格规范安乐死程序及执行标准",
                      "设立明确的人道终点标准"
                    ].map((item, index) => (
                      <li key={index} className="flex items-start">
                        <div className="bg-green-50 p-1 rounded-full flex-shrink-0 mr-2">
                          <CheckCircle2 className="h-3 w-3 text-green-500" />
                        </div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          )}

          {/* 人体实验特殊风险分析，仅在人体项目中显示 */}
          {project.projectType === "人体" && (
            <>
              <Separator />
              <div>
                <h3 className="text-sm font-medium flex items-center text-gray-700 mb-3">
                  <MessageCircle className="h-4 w-4 text-blue-500 mr-2" />
                  受试者权益保障评估
                </h3>
                <div className="pl-6 text-sm text-gray-600 leading-relaxed bg-white p-4 rounded-md border border-blue-100 shadow-sm">
                  <p className="font-medium text-gray-700 mb-2">该项目在受试者权益保障方面采取了以下措施：</p>
                  <ul className="space-y-2">
                    {[
                      "全面详细的知情同意过程",
                      "明确的风险与获益解释",
                      "完善的个人隐私和数据保护方案",
                      "充分的医疗支持和不良事件处理流程",
                      "明确的受试者退出机制"
                    ].map((item, index) => (
                      <li key={index} className="flex items-start">
                        <div className="bg-green-50 p-1 rounded-full flex-shrink-0 mr-2">
                          <CheckCircle2 className="h-3 w-3 text-green-500" />
                        </div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          )}
        </CardContent>

        <CardFooter className="flex justify-end pt-0">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs" 
            onClick={handleRefreshAnalysis}
            disabled={isRefreshing}
          >
            {isRefreshing ? (
              <>
                <RotateCw className="h-3 w-3 mr-1 animate-spin" />
                更新分析中...
              </>
            ) : (
              <>
                <BarChart3 className="h-3 w-3 mr-1" />
                刷新风险分析
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {/* 风险防控举措 */}
      <Card className="border-t-4 border-t-green-500 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">风险防控举措</CardTitle>
          <CardDescription>
            项目实施过程中的风险防控措施
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 根据项目类型显示不同的风险防控举措 */}
            {project.projectType === "动物" ? (
              <>
                <div className="space-y-2 p-4 bg-white rounded-md border border-green-100 shadow-sm hover:shadow transition-all duration-200">
                  <h3 className="text-sm font-medium text-gray-700 flex items-center">
                    <div className="bg-green-50 p-1 rounded-md mr-2">
                      <Activity className="h-4 w-4 text-green-600" />
                    </div>
                    实验设计优化
                  </h3>
                  <p className="text-sm text-gray-600">采用科学的实验设计，最大程度减少使用动物数量，通过预实验和统计学方法确定最小必要样本量。</p>
                </div>
                <div className="space-y-2 p-4 bg-white rounded-md border border-green-100 shadow-sm hover:shadow transition-all duration-200">
                  <h3 className="text-sm font-medium text-gray-700 flex items-center">
                    <div className="bg-green-50 p-1 rounded-md mr-2">
                      <Brain className="h-4 w-4 text-green-600" />
                    </div>
                    人员资质保障
                  </h3>
                  <p className="text-sm text-gray-600">确保参与实验的人员具备相应资质和技能，接受过必要的动物实验伦理培训。</p>
                </div>
                <div className="space-y-2 p-4 bg-white rounded-md border border-green-100 shadow-sm hover:shadow transition-all duration-200">
                  <h3 className="text-sm font-medium text-gray-700 flex items-center">
                    <div className="bg-green-50 p-1 rounded-md mr-2">
                      <Shield className="h-4 w-4 text-green-600" />
                    </div>
                    动物福利保障
                  </h3>
                  <p className="text-sm text-gray-600">提供符合标准的饲养环境和丰容措施，减轻动物应激反应，定期监测动物健康状况。</p>
                </div>
                <div className="space-y-2 p-4 bg-white rounded-md border border-green-100 shadow-sm hover:shadow transition-all duration-200">
                  <h3 className="text-sm font-medium text-gray-700 flex items-center">
                    <div className="bg-green-50 p-1 rounded-md mr-2">
                      <AlertCircle className="h-4 w-4 text-green-600" />
                    </div>
                    痛苦控制措施
                  </h3>
                  <p className="text-sm text-gray-600">采用适当的麻醉和镇痛方案，建立明确的人道终点标准，确保动物不受不必要的痛苦。</p>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2 p-4 bg-white rounded-md border border-green-100 shadow-sm hover:shadow transition-all duration-200">
                  <h3 className="text-sm font-medium text-gray-700 flex items-center">
                    <div className="bg-green-50 p-1 rounded-md mr-2">
                      <MessageCircle className="h-4 w-4 text-green-600" />
                    </div>
                    知情同意优化
                  </h3>
                  <p className="text-sm text-gray-600">确保知情同意书语言通俗易懂，充分解释研究风险与获益，给予受试者充分的考虑时间。</p>
                </div>
                <div className="space-y-2 p-4 bg-white rounded-md border border-green-100 shadow-sm hover:shadow transition-all duration-200">
                  <h3 className="text-sm font-medium text-gray-700 flex items-center">
                    <div className="bg-green-50 p-1 rounded-md mr-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    </div>
                    受试者筛选
                  </h3>
                  <p className="text-sm text-gray-600">严格执行纳入排除标准，避免高风险人群参与研究，确保受试者安全。</p>
                </div>
                <div className="space-y-2 p-4 bg-white rounded-md border border-green-100 shadow-sm hover:shadow transition-all duration-200">
                  <h3 className="text-sm font-medium text-gray-700 flex items-center">
                    <div className="bg-green-50 p-1 rounded-md mr-2">
                      <Activity className="h-4 w-4 text-green-600" />
                    </div>
                    安全监测方案
                  </h3>
                  <p className="text-sm text-gray-600">建立完善的安全监测方案，定期评估受试者状况，及时发现并处理不良事件。</p>
                </div>
                <div className="space-y-2 p-4 bg-white rounded-md border border-green-100 shadow-sm hover:shadow transition-all duration-200">
                  <h3 className="text-sm font-medium text-gray-700 flex items-center">
                    <div className="bg-green-50 p-1 rounded-md mr-2">
                      <Shield className="h-4 w-4 text-green-600" />
                    </div>
                    数据隐私保护
                  </h3>
                  <p className="text-sm text-gray-600">采取严格的数据保密措施，确保受试者个人信息安全，遵循相关法规要求。</p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 