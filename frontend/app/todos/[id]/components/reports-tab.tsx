import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Download,
  FileText,
  Calendar,
  DollarSign,
  Award,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Users,
  Printer,
  Share2,
  ChevronRight,
  BookOpen,
  Microscope,
} from "lucide-react"

export default function ReportsTab() {
  // 模拟报告生成日期
  const reportDate = new Date().toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="w-full bg-white border rounded-lg shadow-sm">
      {/* 报告头部 - 背景改为白色 */}
      <div className="p-8 border-b bg-white">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">量子计算在密码学中的应用研究项目报告</h1>
            <p className="text-slate-500 mt-2">本报告基于项目概览、研究进展、经费使用、成果产出和风险分析生成</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-1">
              <Printer className="h-4 w-4" />
              打印
            </Button>
            <Button variant="outline" size="sm" className="gap-1">
              <Share2 className="h-4 w-4" />
              分享
            </Button>
            <Button variant="outline" size="sm" className="gap-1">
              <Download className="h-4 w-4" />
              下载PDF
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            报告编号: RPT-2024-0042
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            生成日期: {reportDate}
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            项目负责人: 张教授
          </div>
          <Badge className="bg-green-50 text-green-700 border-green-200">研究中</Badge>
        </div>
      </div>

      {/* 目录 - 背景改为白色 */}
      <div className="p-6 border-b bg-white">
        <h2 className="text-sm font-medium text-slate-500 mb-3">目录</h2>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary hover:underline cursor-pointer">
            <ChevronRight className="h-4 w-4" />
            <span>1. 项目综合摘要</span>
          </div>
          <div className="flex items-center gap-2 text-primary hover:underline cursor-pointer">
            <ChevronRight className="h-4 w-4" />
            <span>2. 研究进展情况</span>
          </div>
          <div className="flex items-center gap-2 text-primary hover:underline cursor-pointer">
            <ChevronRight className="h-4 w-4" />
            <span>3. 经费使用情况</span>
          </div>
          <div className="flex items-center gap-2 text-primary hover:underline cursor-pointer">
            <ChevronRight className="h-4 w-4" />
            <span>4. 科研成果统计</span>
          </div>
          <div className="flex items-center gap-2 text-primary hover:underline cursor-pointer">
            <ChevronRight className="h-4 w-4" />
            <span>5. 风险分析</span>
          </div>
        </div>
      </div>

      {/* 报告内容 */}
      <div className="p-8 space-y-10">
        {/* 1. 报告摘要 */}
        <section id="summary" className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold text-slate-900">1. 项目综合摘要</h2>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg">
            <h3 className="font-medium mb-2 text-slate-900">项目概述</h3>
            <p className="text-slate-600 leading-relaxed">
              本项目旨在研究量子计算技术在现代密码学中的应用，特别关注量子算法对现有加密体系的威胁以及后量子密码学的发展。
              研究内容包括Shor算法对RSA加密的影响分析、量子密钥分发技术的实验验证以及抗量子计算的新型密码算法设计。
              目前项目处于研究中期，总体进度为65%，预计按计划于2024年12月完成。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium mb-2 flex items-center gap-2 text-slate-900">
                <Clock className="h-4 w-4 text-blue-500" />
                研究进度
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">总体完成度</span>
                  <span className="font-medium text-slate-900">65%</span>
                </div>
                <Progress value={65} className="h-2" />
                <p className="text-xs text-slate-500 mt-2">已完成文献调研、理论分析和初步实验，正在进行算法优化和实验验证。</p>
              </div>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-medium mb-2 flex items-center gap-2 text-slate-900">
                <DollarSign className="h-4 w-4 text-green-500" />
                经费使用
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">预算使用率</span>
                  <span className="font-medium text-slate-900">58%</span>
                </div>
                <Progress value={58} className="h-2" />
                <p className="text-xs text-slate-500 mt-2">总预算100万元，已使用58万元，经费使用进度略低于研究进度。</p>
              </div>
            </div>

            <div className="p-4 bg-amber-50 rounded-lg">
              <h3 className="font-medium mb-2 flex items-center gap-2 text-slate-900">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                风险状况
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">风险处理率</span>
                  <span className="font-medium text-slate-900">75%</span>
                </div>
                <Progress value={75} className="h-2" />
                <p className="text-xs text-slate-500 mt-2">已识别12个风险点，9个已解决，3个正在处理中，无紧急风险。</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-lg">
              <h3 className="font-medium mb-2 text-slate-900">关键成果</h3>
              <ul className="text-slate-600 space-y-1 list-disc pl-5 leading-relaxed">
                <li>发表SCI论文2篇，其中1篇被《IEEE Transactions on Information Theory》收录</li>
                <li>完成量子密钥分发实验原型系统搭建</li>
                <li>提出一种新型抗量子计算的格密码算法</li>
                <li>申请国家发明专利1项</li>
              </ul>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg">
              <h3 className="font-medium mb-2 text-slate-900">下一阶段计划</h3>
              <ul className="text-slate-600 space-y-1 list-disc pl-5 leading-relaxed">
                <li>完成格密码算法的安全性分析和性能优化</li>
                <li>扩大量子密钥分发实验规模，进行多节点测试</li>
                <li>撰写高水平学术论文2-3篇</li>
                <li>准备中期检查报告和相关材料</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 2. 研究进展 - 优化布局和用户体验 */}
        <section id="progress" className="space-y-4 pt-4 border-t">
          <div className="flex items-center gap-2 mb-4">
            <Microscope className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold text-slate-900">2. 研究进展情况</h2>
          </div>

          {/* 进度概览 - 简化为一行 */}
          <div className="bg-slate-50 p-5 rounded-lg mb-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-4">
              <div className="flex items-center gap-3 mb-4 md:mb-0">
                <div className="bg-white p-3 rounded-md shadow-sm">
                  <h3 className="text-xs font-medium text-slate-500 mb-1">总体完成度</h3>
                  <p className="text-2xl font-bold text-primary">65%</p>
                </div>
                <div className="text-slate-600">
                  <p className="font-medium">预计完成日期</p>
                  <p>2024年12月31日</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="text-center px-4 py-2 bg-white rounded-md shadow-sm">
                  <p className="text-2xl font-bold text-green-600">3</p>
                  <p className="text-xs text-slate-500">已完成阶段</p>
                </div>
                <div className="text-center px-4 py-2 bg-white rounded-md shadow-sm">
                  <p className="text-2xl font-bold text-blue-600">1</p>
                  <p className="text-xs text-slate-500">进行中阶段</p>
                </div>
                <div className="text-center px-4 py-2 bg-white rounded-md shadow-sm">
                  <p className="text-2xl font-bold text-slate-600">2</p>
                  <p className="text-xs text-slate-500">未开始阶段</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-md">
              <p className="text-slate-600 mb-3">
                项目总体进度符合预期，目前处于研究中期，已完成文献调研、理论分析和初步实验，正在进行算法优化和实验验证。
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-green-50 text-green-700 border-green-200">进度正常</Badge>
                <Badge className="bg-blue-50 text-blue-700 border-blue-200">理论分析已完成</Badge>
                <Badge className="bg-amber-50 text-amber-700 border-amber-200">实验验证进行中</Badge>
              </div>
            </div>
          </div>

          {/* 阶段完成情况 - 更清晰的布局 */}
          <div className="bg-white border rounded-lg overflow-hidden mb-6">
            <div className="bg-slate-50 px-4 py-3 border-b">
              <h3 className="font-medium text-slate-900">研究阶段完成情况</h3>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-1/4 pr-4 font-medium text-slate-900">项目立项</div>
                  <div className="w-2/4">
                    <Progress value={100} className="h-2" />
                  </div>
                  <div className="w-1/4 pl-4 text-right">
                    <Badge className="bg-green-50 text-green-700 border-green-200">100%</Badge>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-1/4 pr-4 font-medium text-slate-900">文献调研</div>
                  <div className="w-2/4">
                    <Progress value={100} className="h-2" />
                  </div>
                  <div className="w-1/4 pl-4 text-right">
                    <Badge className="bg-green-50 text-green-700 border-green-200">100%</Badge>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-1/4 pr-4 font-medium text-slate-900">理论分析</div>
                  <div className="w-2/4">
                    <Progress value={100} className="h-2" />
                  </div>
                  <div className="w-1/4 pl-4 text-right">
                    <Badge className="bg-green-50 text-green-700 border-green-200">100%</Badge>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-1/4 pr-4 font-medium text-slate-900">算法设计与实验</div>
                  <div className="w-2/4">
                    <Progress value={65} className="h-2" />
                  </div>
                  <div className="w-1/4 pl-4 text-right">
                    <Badge className="bg-blue-50 text-blue-700 border-blue-200">65%</Badge>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-1/4 pr-4 font-medium text-slate-900">成果总结</div>
                  <div className="w-2/4">
                    <Progress value={0} className="h-2" />
                  </div>
                  <div className="w-1/4 pl-4 text-right">
                    <Badge className="bg-slate-50 text-slate-700 border-slate-200">0%</Badge>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-1/4 pr-4 font-medium text-slate-900">结题验收</div>
                  <div className="w-2/4">
                    <Progress value={0} className="h-2" />
                  </div>
                  <div className="w-1/4 pl-4 text-right">
                    <Badge className="bg-slate-50 text-slate-700 border-slate-200">0%</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 关键里程碑 - 更简洁的时间线 */}
          <div className="bg-white border rounded-lg overflow-hidden">
            <div className="bg-slate-50 px-4 py-3 border-b">
              <h3 className="font-medium text-slate-900">关键研究里程碑</h3>
            </div>
            <div className="p-4">
              <div className="relative pl-8 border-l-2 border-slate-200 space-y-6">
                <div className="relative">
                  <div className="absolute -left-[41px] bg-green-500 p-1 rounded-full border-4 border-white">
                    <CheckCircle2 className="h-4 w-4 text-white" />
                  </div>
                  <div className="mb-1 flex justify-between">
                    <h4 className="font-medium text-slate-900">项目立项获批</h4>
                    <span className="text-sm text-slate-500">2023-01-15</span>
                  </div>
                  <p className="text-sm text-slate-600">国家自然科学基金项目正式获批立项，经费100万元</p>
                </div>
                
                <div className="relative">
                  <div className="absolute -left-[41px] bg-green-500 p-1 rounded-full border-4 border-white">
                    <CheckCircle2 className="h-4 w-4 text-white" />
                  </div>
                  <div className="mb-1 flex justify-between">
                    <h4 className="font-medium text-slate-900">文献综述完成</h4>
                    <span className="text-sm text-slate-500">2023-04-20</span>
                  </div>
                  <p className="text-sm text-slate-600">完成量子计算与密码学领域的文献调研，形成综述报告</p>
                </div>
                
                <div className="relative">
                  <div className="absolute -left-[41px] bg-green-500 p-1 rounded-full border-4 border-white">
                    <CheckCircle2 className="h-4 w-4 text-white" />
                  </div>
                  <div className="mb-1 flex justify-between">
                    <h4 className="font-medium text-slate-900">首篇论文发表</h4>
                    <span className="text-sm text-slate-500">2023-08-15</span>
                  </div>
                  <p className="text-sm text-slate-600">研究论文《量子计算对RSA加密的影响分析》被SCI期刊接收</p>
                </div>
                
                <div className="relative">
                  <div className="absolute -left-[41px] bg-green-500 p-1 rounded-full border-4 border-white">
                    <CheckCircle2 className="h-4 w-4 text-white" />
                  </div>
                  <div className="mb-1 flex justify-between">
                    <h4 className="font-medium text-slate-900">实验平台搭建</h4>
                    <span className="text-sm text-slate-500">2023-11-30</span>
                  </div>
                  <p className="text-sm text-slate-600">完成量子密钥分发实验平台搭建，开始初步实验</p>
                </div>
                
                <div className="relative">
                  <div className="absolute -left-[41px] bg-blue-500 p-1 rounded-full border-4 border-white">
                    <Clock className="h-4 w-4 text-white" />
                  </div>
                  <div className="mb-1 flex justify-between">
                    <h4 className="font-medium text-slate-900">算法优化与验证</h4>
                    <span className="text-sm text-slate-500">进行中</span>
                  </div>
                  <p className="text-sm text-slate-600">正在进行格密码算法优化和量子密钥分发多节点实验</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. 经费使用 */}
        <section id="finance" className="space-y-4 pt-4 border-t">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold text-slate-900">3. 经费使用情况</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="text-sm font-medium text-slate-500">总预算</h3>
              <p className="text-2xl font-bold text-green-700">¥1,000,000</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="text-sm font-medium text-slate-500">已使用</h3>
              <p className="text-2xl font-bold text-blue-700">¥580,000</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="text-sm font-medium text-slate-500">剩余预算</h3>
              <p className="text-2xl font-bold text-purple-700">¥420,000</p>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg">
            <h3 className="font-medium mb-3 text-slate-900">经费使用分布</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span className="text-slate-600">设备费</span>
                  <span className="font-medium text-slate-900">¥280,000 (48%)</span>
                </div>
                <Progress value={48} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span className="text-slate-600">材料费</span>
                  <span className="font-medium text-slate-900">¥120,000 (21%)</span>
                </div>
                <Progress value={21} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span className="text-slate-600">测试化验加工费</span>
                  <span className="font-medium text-slate-900">¥80,000 (14%)</span>
                </div>
                <Progress value={14} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span className="text-slate-600">差旅费</span>
                  <span className="font-medium text-slate-900">¥50,000 (9%)</span>
                </div>
                <Progress value={9} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span className="text-slate-600">会议费</span>
                  <span className="font-medium text-slate-900">¥30,000 (5%)</span>
                </div>
                <Progress value={5} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span className="text-slate-600">劳务费</span>
                  <span className="font-medium text-slate-900">¥20,000 (3%)</span>
                </div>
                <Progress value={3} className="h-2" />
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg">
            <h3 className="font-medium mb-3 text-slate-900">经费使用分析</h3>
            <p className="text-slate-600 mb-3 leading-relaxed">
              项目经费使用进度略低于研究进度，总体使用率为58%，而项目进度为65%。
              主要原因是部分实验设备采购延迟，以及国际学术会议参与计划因疫情调整。
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle2 className="h-4 w-4" />
                <span>设备费和材料费使用符合预期</span>
              </div>
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle2 className="h-4 w-4" />
                <span>测试化验加工费节省了约10%</span>
              </div>
              <div className="flex items-center gap-2 text-amber-700">
                <AlertTriangle className="h-4 w-4" />
                <span>差旅费和会议费使用不足，需调整计划</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg">
            <h3 className="font-medium mb-3 text-slate-900">经费使用预测</h3>
            <p className="text-slate-600 mb-3 leading-relaxed">
              根据当前使用情况和研究计划，预计项目总体经费使用将控制在预算范围内，可能会有约5%的结余。
            </p>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span className="text-slate-600">下半年设备采购计划</span>
                  <span className="font-medium text-slate-900">¥150,000</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span className="text-slate-600">国际会议参与费用</span>
                  <span className="font-medium text-slate-900">¥120,000</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span className="text-slate-600">实验材料追加费用</span>
                  <span className="font-medium text-slate-900">¥100,000</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span className="text-slate-600">预计结余</span>
                  <span className="font-medium text-slate-900">¥50,000 (5%)</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. 成果统计 */}
        <section id="achievements" className="space-y-4 pt-4 border-t">
          <div className="flex items-center gap-2 mb-2">
            <Award className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold text-slate-900">4. 科研成果统计</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="text-sm font-medium text-slate-500">论文发表</h3>
              <p className="text-2xl font-bold text-green-700">2</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="text-sm font-medium text-slate-500">专利申请</h3>
              <p className="text-2xl font-bold text-blue-700">1</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="text-sm font-medium text-slate-500">软件著作权</h3>
              <p className="text-2xl font-bold text-purple-700">0</p>
            </div>
            <div className="p-4 bg-amber-50 rounded-lg">
              <h3 className="text-sm font-medium text-slate-500">学术报告</h3>
              <p className="text-2xl font-bold text-amber-700">3</p>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg">
            <h3 className="font-medium mb-3 text-slate-900">成果详情</h3>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded-md">
                <h4 className="font-medium text-slate-900 mb-2">论文发表</h4>
                <ul className="text-slate-600 space-y-2">
                  <li className="flex justify-between">
                    <span>《量子计算对RSA加密的影响分析》(IEEE Transactions on Information Theory)</span>
                    <Badge className="bg-green-50 text-green-700 border-green-200">已发表</Badge>
                  </li>
                  <li className="flex justify-between">
                    <span>《基于格密码的抗量子计算加密算法研究》(Journal of Cryptology)</span>
                    <Badge className="bg-green-50 text-green-700 border-green-200">已发表</Badge>
                  </li>
                </ul>
              </div>

              <div className="bg-white p-3 rounded-md">
                <h4 className="font-medium text-slate-900 mb-2">专利申请</h4>
                <ul className="text-slate-600 space-y-2">
                  <li className="flex justify-between">
                    <span>《一种基于量子密钥分发的安全通信方法》</span>
                    <Badge className="bg-blue-50 text-blue-700 border-blue-200">申请中</Badge>
                  </li>
                </ul>
              </div>

              <div className="bg-white p-3 rounded-md">
                <h4 className="font-medium text-slate-900 mb-2">学术报告</h4>
                <ul className="text-slate-600 space-y-2">
                  <li className="flex justify-between">
                    <span>《后量子密码学研究进展》(全国密码学学术会议)</span>
                    <Badge className="bg-green-50 text-green-700 border-green-200">已完成</Badge>
                  </li>
                  <li className="flex justify-between">
                    <span>《量子计算对现代密码体系的挑战》(国际信息安全研讨会)</span>
                    <Badge className="bg-green-50 text-green-700 border-green-200">已完成</Badge>
                  </li>
                  <li className="flex justify-between">
                    <span>《格密码在后量子时代的应用前景》(高校学术论坛)</span>
                    <Badge className="bg-green-50 text-green-700 border-green-200">已完成</Badge>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg">
            <h3 className="font-medium mb-3 text-slate-900">成果分析</h3>
            <p className="text-slate-600 mb-3 leading-relaxed">
              项目已产出2篇高水平SCI论文、1项专利申请和3次学术报告，成果产出符合项目进度。
              预计在项目完成后，将申请1-2项软件著作权，并发表2-3篇高水平学术论文。
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle2 className="h-4 w-4" />
                <span>论文发表数量和质量符合预期</span>
              </div>
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle2 className="h-4 w-4" />
                <span>专利申请进展顺利</span>
              </div>
              <div className="flex items-center gap-2 text-amber-700">
                <AlertTriangle className="h-4 w-4" />
                <span>软件著作权申请将在算法实现完成后进行</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg">
            <h3 className="font-medium mb-3 text-slate-900">成果影响力</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span className="text-slate-600">论文引用次数</span>
                  <span className="font-medium text-slate-900">24</span>
                </div>
                <Progress value={40} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span className="text-slate-600">学术报告受众人数</span>
                  <span className="font-medium text-slate-900">约450人</span>
                </div>
                <Progress value={60} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span className="text-slate-600">研究成果关注度</span>
                  <span className="font-medium text-slate-900">高</span>
                </div>
                <Progress value={80} className="h-2" />
              </div>
            </div>
          </div>
        </section>

        {/* 5. 风险分析 */}
        <section id="risks" className="space-y-4 pt-4 border-t">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold text-slate-900">5. 风险分析</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-50 rounded-lg">
              <h3 className="text-sm font-medium text-slate-500">风险总数</h3>
              <p className="text-2xl font-bold text-slate-700">12</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="text-sm font-medium text-slate-500">已解决</h3>
              <p className="text-2xl font-bold text-green-700">9</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="text-sm font-medium text-slate-500">处理中</h3>
              <p className="text-2xl font-bold text-blue-700">3</p>
            </div>
            <div className="p-4 bg-red-50 rounded-lg">
              <h3 className="text-sm font-medium text-slate-500">紧急风险</h3>
              <p className="text-2xl font-bold text-red-700">0</p>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg">
            <h3 className="font-medium mb-3 text-slate-900">风险分布</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span className="text-slate-600">技术风险</span>
                  <span className="font-medium text-slate-900">5 (42%)</span>
                </div>
                <Progress value={42} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span className="text-slate-600">实验风险</span>
                  <span className="font-medium text-slate-900">3 (25%)</span>
                </div>
                <Progress value={25} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span className="text-slate-600">人员风险</span>
                  <span className="font-medium text-slate-900">2 (17%)</span>
                </div>
                <Progress value={17} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span className="text-slate-600">经费风险</span>
                  <span className="font-medium text-slate-900">1 (8%)</span>
                </div>
                <Progress value={8} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span className="text-slate-600">外部环境风险</span>
                  <span className="font-medium text-slate-900">1 (8%)</span>
                </div>
                <Progress value={8} className="h-2" />
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg">
            <h3 className="font-medium mb-3 text-slate-900">主要风险及处理情况</h3>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded-md">
                <div className="flex justify-between">
                  <h4 className="font-medium text-slate-900">量子模拟器性能不足</h4>
                  <Badge className="bg-green-50 text-green-700 border-green-200">已解决</Badge>
                </div>
                <p className="text-slate-600 mt-1 text-sm">
                  通过优化算法和升级计算设备，解决了量子模拟器性能不足的问题。
                </p>
              </div>

              <div className="bg-white p-3 rounded-md">
                <div className="flex justify-between">
                  <h4 className="font-medium text-slate-900">格密码算法安全性验证</h4>
                  <Badge className="bg-blue-50 text-blue-700 border-blue-200">处理中</Badge>
                </div>
                <p className="text-slate-600 mt-1 text-sm">
                  正在进行格密码算法的安全性分析和验证，已邀请密码学专家进行评审。
                </p>
              </div>

              <div className="bg-white p-3 rounded-md">
                <div className="flex justify-between">
                  <h4 className="font-medium text-slate-900">研究生流动性大</h4>
                  <Badge className="bg-green-50 text-green-700 border-green-200">已解决</Badge>
                </div>
                <p className="text-slate-600 mt-1 text-sm">
                  通过调整研究生培养计划和增加科研奖励，稳定了研究团队。
                </p>
              </div>

              <div className="bg-white p-3 rounded-md">
                <div className="flex justify-between">
                  <h4 className="font-medium text-slate-900">实验设备采购延迟</h4>
                  <Badge className="bg-blue-50 text-blue-700 border-blue-200">处理中</Badge>
                </div>
                <p className="text-slate-600 mt-1 text-sm">
                  正在与供应商协调，加快设备采购流程，同时调整研究计划以减少影响。
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg">
            <h3 className="font-medium mb-3 text-slate-900">风险趋势分析</h3>
            <p className="text-slate-600 mb-3 leading-relaxed">
              项目风险总体呈下降趋势，已解决的风险数量持续增加，新增风险数量减少。
              目前没有紧急风险，处理中的风险均在可控范围内。
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle2 className="h-4 w-4" />
                <span>技术风险处理效果良好</span>
              </div>
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle2 className="h-4 w-4" />
                <span>人员风险得到有效控制</span>
              </div>
              <div className="flex items-center gap-2 text-amber-700">
                <AlertTriangle className="h-4 w-4" />
                <span>实验设备采购风险需持续关注</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* 报告页脚 */}
      <div className="p-6 border-t bg-slate-50 text-center">
        <p className="text-xs text-slate-500">
          本报告由系统自动生成，数据截至 {reportDate}。如有疑问，请联系科研管理办公室。
        </p>
        <div className="flex justify-center gap-4 mt-4">
          <Button variant="outline" size="sm" className="gap-1">
            <Printer className="h-4 w-4" />
            打印报告
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <Download className="h-4 w-4" />
            下载PDF
          </Button>
        </div>
      </div>
    </div>
  )
}
