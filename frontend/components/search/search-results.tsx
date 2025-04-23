"use client"

import { useEffect, useState } from "react"
import { Folder, DollarSign, Award, Users, Search, Sparkles, LayoutGrid, FileText, CircleDot } from "lucide-react"
import type { SearchResultsProps, SearchResultItem, SearchResultCategoryProps } from "./search-types"

// 搜索结果分类组件
function SearchResultCategory({
  title,
  icon,
  items,
  selectedResultIndex,
  startIndex,
  onSelectResult,
  onHoverResult,
}: SearchResultCategoryProps) {
  if (items.length === 0) return null

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      </div>
      <div className="space-y-1">
        {items.map((item, index) => {
          const resultIndex = startIndex + index
          const isSelected = selectedResultIndex === resultIndex

          return (
            <div
              key={item.id}
              data-result-index={resultIndex}
              className={`px-3 py-2 rounded-md cursor-pointer border border-transparent ${
                isSelected ? "bg-blue-50 text-blue-600 border-blue-100" : "hover:bg-gray-50"
              }`}
              onClick={() => onSelectResult(item)}
              onMouseEnter={() => onHoverResult(resultIndex)}
            >
              <div className="text-sm font-medium">{item.text}</div>
              {item.description && <div className="text-xs text-gray-500 mt-0.5">{item.description}</div>}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// 获取搜索结果
function getSearchResults(query: string): SearchResultItem[] {
  if (!query.trim()) return []

  // 项目相关结果
  const projectResults: SearchResultItem[] = [
    {
      id: "p1",
      text: "国家自然科学基金项目申报指南",
      description: "2023年度申报要求与流程",
      category: "项目",
      url: "/projects/nsfc-guide",
    },
    {
      id: "p2",
      text: "省级重点研发计划项目管理办法",
      description: "项目申报、执行与验收规范",
      category: "项目",
      url: "/projects/provincial-rd",
    },
    {
      id: "p3",
      text: "横向科研项目合同模板",
      description: "企业合作项目合同标准文本",
      category: "项目",
      url: "/projects/contract-template",
    },
    {
      id: "p4",
      text: "国际合作项目申请流程",
      description: "国际科研合作项目申报指南",
      category: "项目",
      url: "/projects/international",
    },
    {
      id: "p5",
      text: "青年科学基金项目申报材料",
      description: "青年科研人员基金申请指南",
      category: "项目",
      url: "/projects/youth-fund",
    },
    {
      id: "p6",
      text: "重大科研项目立项评审标准",
      description: "重大项目评审要点与流程",
      category: "项目",
      url: "/projects/major-review",
    },
    {
      id: "p7",
      text: "产学研合作项目管理规定",
      description: "校企合作科研项目管理办法",
      category: "项目",
      url: "/projects/industry-academy",
    },
    {
      id: "p8",
      text: "科技创新平台建设项目指南",
      description: "重点实验室与研究中心建设",
      category: "项目",
      url: "/projects/platform",
    },
    {
      id: "p9",
      text: "人文社科类项目申报要点",
      description: "人文社会科学研究项目指南",
      category: "项目",
      url: "/projects/humanities",
    },
    {
      id: "p10",
      text: "科研项目结题验收标准",
      description: "项目结题报告与成果要求",
      category: "项目",
      url: "/projects/completion",
    },
  ]

  // 经费相关结果
  const fundingResults: SearchResultItem[] = [
    {
      id: "f1",
      text: "科研经费使用管理规定",
      description: "最新经费管理与报销制度",
      category: "经费",
      url: "/funding/regulations",
    },
    {
      id: "f2",
      text: "间接费用分配方案",
      description: "项目间接费用分配比例与使用",
      category: "经费",
      url: "/funding/indirect-costs",
    },
    {
      id: "f3",
      text: "设备费用报销流程",
      description: "大型设备采购与报销指南",
      category: "经费",
      url: "/funding/equipment",
    },
    {
      id: "f4",
      text: "差旅费报销标准",
      description: "国内外差旅费用标准与流程",
      category: "经费",
      url: "/funding/travel",
    },
    {
      id: "f5",
      text: "会议费用管理办法",
      description: "学术会议组织与费用报销",
      category: "经费",
      url: "/funding/conference",
    },
    {
      id: "f6",
      text: "劳务费发放规定",
      description: "项目人员劳务费标准与发放",
      category: "经费",
      url: "/funding/labor",
    },
    {
      id: "f7",
      text: "科研经费预算调整申请",
      description: "预算调整流程与审批",
      category: "经费",
      url: "/funding/budget-adjustment",
    },
    {
      id: "f8",
      text: "国际合作项目经费管理",
      description: "国际项目经费使用特殊规定",
      category: "经费",
      url: "/funding/international",
    },
    {
      id: "f9",
      text: "科研经费结余使用规定",
      description: "项目结题后经费结余处理",
      category: "经费",
      url: "/funding/surplus",
    },
    {
      id: "f10",
      text: "横向项目经费管理办法",
      description: "企业合作项目经费使用灵活性",
      category: "经费",
      url: "/funding/horizontal",
    },
  ]

  // 成果相关结果
  const achievementResults: SearchResultItem[] = [
    {
      id: "a1",
      text: "科研论文发表奖励标准",
      description: "各级别期刊论文奖励政策",
      category: "成果",
      url: "/achievements/paper-rewards",
    },
    {
      id: "a2",
      text: "专利申请与转化流程",
      description: "发明专利申请与技术转化",
      category: "成果",
      url: "/achievements/patents",
    },
    {
      id: "a3",
      text: "学术专著出版资助",
      description: "专著出版补贴与流程",
      category: "成果",
      url: "/achievements/books",
    },
    {
      id: "a4",
      text: "科技成果转化收益分配",
      description: "成果转化收益分配比例",
      category: "成果",
      url: "/achievements/transformation",
    },
    {
      id: "a5",
      text: "年度科研成果统计系统",
      description: "成果数据填报与统计",
      category: "成果",
      url: "/achievements/statistics",
    },
    {
      id: "a6",
      text: "高水平期刊目录",
      description: "各学科高水平期刊分类目录",
      category: "成果",
      url: "/achievements/journals",
    },
    {
      id: "a7",
      text: "科研成果奖励申报指南",
      description: "各级科技奖项申报流程",
      category: "成果",
      url: "/achievements/awards",
    },
    {
      id: "a8",
      text: "软件著作权登记流程",
      description: "计算机软件著作权申请指南",
      category: "成果",
      url: "/achievements/software",
    },
    {
      id: "a9",
      text: "科研成果展示平台",
      description: "成果展示与宣传渠道",
      category: "成果",
      url: "/achievements/showcase",
    },
    {
      id: "a10",
      text: "学术不端行为处理办法",
      description: "学术规范与不端行为处理",
      category: "成果",
      url: "/achievements/misconduct",
    },
  ]

  // 人员相关结果
  const personnelResults: SearchResultItem[] = [
    {
      id: "h1",
      text: "张明",
      description: "研究员 | 信息科学与技术学院",
      category: "人员",
      url: "/personnel/zhangming",
      avatar: "/avatars/zhangming.jpg",
      extraInfo: "材料科学与工程 | 引用量: 2341",
      age: 42
    },
    {
      id: "h2",
      text: "李华",
      description: "副教授 | 物理学院",
      category: "人员",
      url: "/personnel/lihua",
      avatar: "/avatars/lihua.jpg",
      extraInfo: "量子物理 | 引用量: 1892",
      age: 38
    },
    {
      id: "h3",
      text: "王芳",
      description: "教授 | 生命科学学院",
      category: "人员",
      url: "/personnel/wangfang",
      avatar: "/avatars/wangfang.jpg", 
      extraInfo: "分子生物学 | 引用量: 3104",
      age: 45
    },
    {
      id: "h4",
      text: "刘志强",
      description: "研究员 | 化学与分子工程学院",
      category: "人员",
      url: "/personnel/liuzhiqiang",
      avatar: "/avatars/liuzhiqiang.jpg",
      extraInfo: "有机化学 | 引用量: 1756",
      age: 47
    },
    {
      id: "h5",
      text: "陈雪",
      description: "副教授 | 环境科学与工程学院",
      category: "人员",
      url: "/personnel/chenxue",
      avatar: "/avatars/chenxue.jpg",
      extraInfo: "环境工程 | 引用量: 986",
      age: 35
    },
    {
      id: "h6",
      text: "赵明",
      description: "讲师 | 地球与空间科学学院",
      category: "人员",
      url: "/personnel/zhaoming",
      avatar: "/avatars/zhaoming.jpg",
      extraInfo: "地质学 | 引用量: 765",
      age: 32
    },
    {
      id: "h7",
      text: "黄伟",
      description: "教授 | 数学科学学院",
      category: "人员",
      url: "/personnel/huangwei",
      avatar: "/avatars/huangwei.jpg",
      extraInfo: "应用数学 | 引用量: 1432",
      age: 51
    },
    {
      id: "h8",
      text: "周琳",
      description: "研究员 | 计算机科学与技术学院",
      category: "人员",
      url: "/personnel/zhoulin",
      avatar: "/avatars/zhoulin.jpg",
      extraInfo: "人工智能 | 引用量: 2873",
      age: 36
    },
    {
      id: "h9",
      text: "孙博",
      description: "副教授 | 医学院",
      category: "人员",
      url: "/personnel/sunbo",
      avatar: "/avatars/sunbo.jpg",
      extraInfo: "神经科学 | 引用量: 1278",
      age: 40
    },
    {
      id: "h10",
      text: "吴佳",
      description: "教授 | 工程学院",
      category: "人员",
      url: "/personnel/wujia",
      avatar: "/avatars/wujia.jpg",
      extraInfo: "机械工程 | 引用量: 1645",
      age: 49
    },
  ]

  // 服务相关结果
  const serviceResults: SearchResultItem[] = [
    {
      id: "s1",
      text: "科研设备共享平台申请",
      description: "大型仪器设备预约与使用",
      category: "服务",
      url: "/services/equipment-sharing",
    },
    {
      id: "s2",
      text: "实验室安全培训报名",
      description: "实验室安全知识培训课程",
      category: "服务",
      url: "/services/lab-safety",
    },
    {
      id: "s3",
      text: "学术资源访问申请",
      description: "图书馆数据库与期刊访问权限",
      category: "服务",
      url: "/services/academic-resources",
    },
    {
      id: "s4",
      text: "科研成果展示申请",
      description: "成果展示与宣传服务",
      category: "服务",
      url: "/services/achievement-display",
    },
    {
      id: "s5",
      text: "国际合作交流服务",
      description: "国际学术交流与合作项目对接",
      category: "服务",
      url: "/services/international",
    },
  ]

  // 待办相关结果
  const todoResults: SearchResultItem[] = [
    {
      id: "t1",
      text: "项目进度月报填写",
      description: "截止日期: 本月25日",
      category: "待办",
      url: "/todo/monthly-report",
    },
    {
      id: "t2",
      text: "经费使用计划提交",
      description: "截止日期: 2024-6-30",
      category: "待办",
      url: "/todo/funding-plan",
    },
    {
      id: "t3",
      text: "科研成果数据更新",
      description: "截止日期: 2024-7-15",
      category: "待办",
      url: "/todo/achievement-update",
    },
    {
      id: "t4",
      text: "期中检查材料准备",
      description: "截止日期: 2024-7-20",
      category: "待办",
      url: "/todo/mid-term-check",
    },
  ]

  // 计算匹配度的函数
  const calculateRelevance = (item: SearchResultItem, searchQuery: string): number => {
    const lowerQuery = searchQuery.toLowerCase()
    const lowerText = item.text.toLowerCase()
    const lowerDesc = item.description?.toLowerCase() || ""
    const lowerCategory = item.category?.toLowerCase() || ""

    let score = 0

    // 完全匹配
    if (lowerText === lowerQuery) {
      score += 100
    }

    // 开头匹配
    if (lowerText.startsWith(lowerQuery)) {
      score += 50
    }

    // 包含匹配 - 标题
    if (lowerText.includes(lowerQuery)) {
      score += 30
    }

    // 包含匹配 - 描述
    if (lowerDesc.includes(lowerQuery)) {
      score += 20
    }

    // 类别匹配
    if (lowerCategory.includes(lowerQuery)) {
      score += 15
    }

    // 关键词匹配
    const keywords = lowerQuery.split(/\s+/)
    keywords.forEach((keyword) => {
      if (keyword.length > 1) {
        if (lowerText.includes(keyword)) score += 10
        if (lowerDesc.includes(keyword)) score += 5
      }
    })

    // 匹配字符数量
    let matchCount = 0
    for (let i = 0; i < lowerQuery.length; i++) {
      if (lowerText.includes(lowerQuery[i])) {
        matchCount++
      }
    }
    score += (matchCount / lowerQuery.length) * 10

    return score
  }

  // 为所有结果计算匹配度并排序
  const allResults = [
    ...projectResults, 
    ...fundingResults, 
    ...achievementResults, 
    ...personnelResults,
    ...serviceResults,
    ...todoResults
  ]

  return allResults
    .map((item) => ({
      ...item,
      relevance: calculateRelevance(item, query),
    }))
    .filter((item) => item.relevance > 0)
    .sort((a, b) => (b as any).relevance - (a as any).relevance)
    .map(({ relevance, ...item }) => item)
}

// 获取推荐搜索
function getRecommendedSearches(): SearchResultItem[] {
  return [
    { id: "rec1", text: "国家自然科学基金申请", category: "推荐", url: "/search?q=国家自然科学基金申请" },
    { id: "rec2", text: "SCI论文发表流程", category: "推荐", url: "/search?q=SCI论文发表流程" },
    { id: "rec3", text: "科研经费报销指南", category: "推荐", url: "/search?q=科研经费报销指南" },
    { id: "rec4", text: "专利申请与保护", category: "推荐", url: "/search?q=专利申请与保护" },
    { id: "rec5", text: "横向项目合同模板", category: "推荐", url: "/search?q=横向项目合同模板" },
    { id: "rec6", text: "科研团队建设", category: "推荐", url: "/search?q=科研团队建设" },
    { id: "rec7", text: "学术会议组织流程", category: "推荐", url: "/search?q=学术会议组织流程" },
    { id: "rec8", text: "科技成果转化政策", category: "推荐", url: "/search?q=科技成果转化政策" },
    { id: "rec9", text: "研究生科研训练", category: "推荐", url: "/search?q=研究生科研训练" },
    { id: "rec10", text: "国际合作项目申请", category: "推荐", url: "/search?q=国际合作项目申请" },
    { id: "rec11", text: "科研绩效考核标准", category: "推荐", url: "/search?q=科研绩效考核标准" },
    { id: "rec12", text: "学术论文写作指南", category: "推荐", url: "/search?q=学术论文写作指南" },
    { id: "rec13", text: "科研项目结题验收", category: "推荐", url: "/search?q=科研项目结题验收" },
    { id: "rec14", text: "实验室安全管理", category: "推荐", url: "/search?q=实验室安全管理" },
    { id: "rec15", text: "科研数据管理规范", category: "推荐", url: "/search?q=科研数据管理规范" },
  ]
}

// 获取AI建议问题
function getAISuggestion(query: string): string {
  if (!query.trim()) {
    return "如何提高科研项目申报成功率?"
  }

  // 根据搜索词生成相关的AI建议问题
  const suggestions: Record<string, string> = {
    项目: `如何优化"${query}"相关的科研项目申报?`,
    申报: `"${query}"申报材料应该如何准备才能提高通过率?`,
    经费: `"${query}"经费使用有哪些注意事项?`,
    报销: `"${query}"相关费用报销流程及注意事项?`,
    论文: `如何提高"${query}"相关论文的发表质量?`,
    专利: `"${query}"相关专利申请的关键步骤有哪些?`,
    成果: `如何提高"${query}"科研成果的转化效率?`,
    团队: `如何建设高效的"${query}"科研团队?`,
  }

  // 查找匹配的建议
  for (const key in suggestions) {
    if (query.includes(key)) {
      return suggestions[key]
    }
  }

  // 默认建议
  return `如何优化"${query}"相关的科研项目申报?`
}

export default function SearchResults({
  query,
  selectedResultIndex,
  onSelectResult,
  onHoverResult,
  resultsRef,
  flatResultsRef,
}: SearchResultsProps) {
  const [results, setResults] = useState<SearchResultItem[]>([])
  const [activeCategory, setActiveCategory] = useState<string>("全部")

  // 根据搜索词获取结果
  useEffect(() => {
    if (query.trim()) {
      const searchResults = getSearchResults(query)
      setResults(searchResults)
    } else {
      setResults([])
    }
  }, [query])
  
  // 更新扁平化的结果列表引用 - 单独的副作用
  useEffect(() => {
    // 使用可变对象模式避免直接赋值给.current
    if (flatResultsRef && 'current' in flatResultsRef && flatResultsRef.current !== null) {
      // 清空当前数组
      if (Array.isArray(flatResultsRef.current)) {
        flatResultsRef.current.length = 0;
        
        // 添加新元素
        if (query.trim()) {
          // 添加搜索结果
          results.forEach(item => {
            if (flatResultsRef.current) {
              flatResultsRef.current.push(item);
            }
          });
        } else {
          // 添加推荐搜索
          const recommendedSearches = getRecommendedSearches();
          recommendedSearches.forEach(item => {
            if (flatResultsRef.current) {
              flatResultsRef.current.push(item);
            }
          });
        }
      }
    }
  }, [query, results, flatResultsRef])

  // AI建议问题
  const aiSuggestion = getAISuggestion(query)

  // 获取分类后的结果
  const getCategorizedResults = () => {
    if (!results.length) return { 
      projectResults: [], 
      fundingResults: [], 
      achievementResults: [], 
      personnelResults: [],
      serviceResults: [],
      todoResults: []
    };
    
    const projectResults = results.filter((item) => item.category === "项目");
    const fundingResults = results.filter((item) => item.category === "经费");
    const achievementResults = results.filter((item) => item.category === "成果");
    const personnelResults = results.filter((item) => item.category === "人员");
    const serviceResults = results.filter((item) => item.category === "服务");
    const todoResults = results.filter((item) => item.category === "待办");
    
    return { 
      projectResults, 
      fundingResults, 
      achievementResults, 
      personnelResults,
      serviceResults,
      todoResults
    };
  };
  
  // 按分类筛选结果
  const getFilteredResults = () => {
    const { 
      projectResults, 
      fundingResults, 
      achievementResults, 
      personnelResults,
      serviceResults,
      todoResults
    } = getCategorizedResults();
    
    switch (activeCategory) {
      case "项目":
        return projectResults;
      case "经费":
        return fundingResults;
      case "成果":
        return achievementResults;
      case "人员":
        return personnelResults;
      case "服务":
        return serviceResults;
      case "待办":
        return todoResults;
      default:
        return results;
    }
  };
  
  // 计算每个分类的数量
  const { 
    projectResults, 
    fundingResults, 
    achievementResults, 
    personnelResults,
    serviceResults,
    todoResults
  } = getCategorizedResults();
  const filteredResults = getFilteredResults();

  // 获取服务图标
  const getServiceIcon = (serviceName: string) => {
    if (serviceName.includes("设备") || serviceName.includes("仪器")) {
      return <CircleDot className="h-3.5 w-3.5 text-teal-500 mr-2.5" />;
    } else if (serviceName.includes("安全")) {
      return <FileText className="h-3.5 w-3.5 text-red-500 mr-2.5" />;
    } else if (serviceName.includes("资源") || serviceName.includes("数据库")) {
      return <FileText className="h-3.5 w-3.5 text-blue-500 mr-2.5" />;
    } else if (serviceName.includes("成果") || serviceName.includes("展示")) {
      return <Award className="h-3.5 w-3.5 text-amber-500 mr-2.5" />;
    } else if (serviceName.includes("国际") || serviceName.includes("合作")) {
      return <Users className="h-3.5 w-3.5 text-purple-500 mr-2.5" />;
    } else {
      return <CircleDot className="h-3.5 w-3.5 text-teal-500 mr-2.5" />;
    }
  };

  // 获取待办图标
  const getTodoIcon = (todoName: string) => {
    if (todoName.includes("月报") || todoName.includes("填写")) {
      return <FileText className="h-3.5 w-3.5 text-blue-500 mr-2.5" />;
    } else if (todoName.includes("经费") || todoName.includes("计划")) {
      return <DollarSign className="h-3.5 w-3.5 text-green-500 mr-2.5" />;
    } else if (todoName.includes("成果") || todoName.includes("数据")) {
      return <Award className="h-3.5 w-3.5 text-amber-500 mr-2.5" />;
    } else if (todoName.includes("检查") || todoName.includes("材料")) {
      return <FileText className="h-3.5 w-3.5 text-orange-500 mr-2.5" />;
    } else {
      return <FileText className="h-3.5 w-3.5 text-gray-500 mr-2.5" />;
    }
  };

  // 渲染分类标签
  const renderCategoryTabs = () => {
    if (!query.trim() || !results.length) return null;
    
    const categories = [
      { id: "all", name: "全部", count: results.length },
      { id: "project", name: "项目", count: projectResults.length },
      { id: "funding", name: "经费", count: fundingResults.length },
      { id: "achievement", name: "成果", count: achievementResults.length },
      { id: "personnel", name: "人员", count: personnelResults.length },
      { id: "service", name: "服务", count: serviceResults.length },
      { id: "todo", name: "待办", count: todoResults.length }
    ].filter(category => category.count > 0);

  return (
      <div className="border-b border-gray-200">
        <div className="flex items-center gap-6 overflow-x-auto scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`relative pb-2 text-sm font-medium transition-colors ${
                activeCategory === category.name
                  ? "text-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              onClick={() => setActiveCategory(category.name)}
            >
              <div className="flex items-center">
                {category.name}
                <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
                  activeCategory === category.name 
                    ? "bg-blue-100 text-blue-700" 
                    : "bg-gray-100 text-gray-500"
                }`}>
                  {category.count}
                </span>
        </div>
              {activeCategory === category.name && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-500"></div>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div ref={resultsRef} className="max-h-[400px] overflow-y-auto pr-1.5">
      {/* AI建议区域 - 背景只覆盖内容部分 */}
      <div className="mb-6">
        <div className="flex items-center py-2 px-3 mb-2">
          <Sparkles className="h-4 w-4 text-orange-500 mr-2" />
          <h3 className="text-sm font-medium text-gray-700">AI建议猜你想问</h3>
        </div>
        
        <div 
          className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-indigo-100 overflow-hidden py-3 px-4 text-sm text-indigo-900 cursor-pointer hover:bg-indigo-100 transition-all duration-200 hover:shadow-sm hover:border-indigo-200"
          onClick={() => {
            // 创建一个虚拟搜索结果项
            const aiQuestion: SearchResultItem = {
              id: 'ai-suggestion',
              text: aiSuggestion,
              category: 'AI建议',
              url: `/search?q=${encodeURIComponent(aiSuggestion)}`
            };
            // 处理点击AI建议
            onSelectResult(aiQuestion);
          }}
        >
          {aiSuggestion}
        </div>
      </div>

      {/* 搜索结果或推荐搜索 */}
      {!query.trim() ? (
        // 推荐搜索
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Search className="h-4 w-4 text-gray-500" />
            <h3 className="text-sm font-medium text-gray-500">推荐搜索</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {getRecommendedSearches().map((item, index) => {
              const isSelected = selectedResultIndex === index

              return (
                <div
                  key={item.id}
                  data-result-index={index}
                  className={`px-4 py-3 cursor-pointer ${
                    isSelected ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"
                  }`}
                  onClick={() => onSelectResult(item)}
                  onMouseEnter={() => onHoverResult(index)}
                >
                  <div className="text-sm">{item.text}</div>
                </div>
              )
            })}
          </div>
          {/* 底部加载完成提示 */}
          <div className="py-4 text-center">
            <div className="text-xs text-gray-400 flex items-center justify-center">
              <span className="inline-block w-16 h-px bg-gray-200 mr-3"></span>
              已加载全部内容
              <span className="inline-block w-16 h-px bg-gray-200 ml-3"></span>
            </div>
          </div>
        </div>
      ) : results.length > 0 ? (
        // 搜索结果 - 改为Tab切换式
        <div>
          {/* 分类标签 */}
          {renderCategoryTabs()}
          
          {/* 搜索结果列表 */}
          {activeCategory !== "全部" ? (
            <div className="divide-y divide-gray-100 pt-0">
              {filteredResults.map((item, index) => {
                const resultIndex = index;
                const isSelected = selectedResultIndex === resultIndex;
                const isPersonnel = item.category === "人员";

            return (
                  <div
                    key={item.id}
                    data-result-index={resultIndex}
                    className={`px-4 py-3 cursor-pointer ${
                      isSelected ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"
                    }`}
                    onClick={() => onSelectResult(item)}
                    onMouseEnter={() => onHoverResult(resultIndex)}
                  >
                    {isPersonnel ? (
                      <div className="flex items-start py-1">
                        <div className="flex-shrink-0 mr-4">
                          <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 font-medium">
                            {item.text.charAt(0)}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center">
                              <div className="text-sm font-medium">{item.text}</div>
                              {item.age && <div className="text-xs text-gray-500 ml-2">{item.age}岁</div>}
                            </div>
                          </div>
                          {item.description && (
                            <div className="text-xs text-gray-600 mb-1.5">{item.description}</div>
                          )}
                          {item.extraInfo && (
                            <div className="text-xs text-gray-500">{item.extraInfo}</div>
                          )}
                        </div>
                      </div>
                    ) : (
                      // 其他结果正常展示
                      <div>
                        <div className="flex items-center justify-between py-1">
                          <div className="flex items-center">
                            {item.category === "服务" && getServiceIcon(item.text)}
                            {item.category === "待办" && getTodoIcon(item.text)}
                            <div className="text-sm font-medium">{item.text}</div>
                          </div>
                        </div>
                        {item.description && (
                          <div className="text-xs text-gray-500 mt-1 ml-0.5">{item.description}</div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            // 全部视图 - 确保服务项有合适的图标
            <div>
              {/* 项目分类 */}
                {projectResults.length > 0 && (
                <div className="mb-3">
                  <div className="text-xs text-gray-400 font-medium mt-3 mb-1">项目</div>
                  <div className="divide-y divide-gray-100">
                    {projectResults.map((item, index) => {
                      const resultIndex = results.findIndex(r => r.id === item.id);
                      const isSelected = selectedResultIndex === resultIndex;
                      
                      return (
                        <div
                          key={item.id}
                          data-result-index={resultIndex}
                          className={`px-4 py-3 cursor-pointer ${
                            isSelected ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"
                          }`}
                          onClick={() => onSelectResult(item)}
                          onMouseEnter={() => onHoverResult(resultIndex)}
                        >
                          <div className="flex items-center justify-between py-1">
                            <div className="flex items-center">
                              <div className="text-sm font-medium">{item.text}</div>
                            </div>
                          </div>
                          {item.description && (
                            <div className="text-xs text-gray-500 mt-1 ml-0.5">{item.description}</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 经费分类 */}
                {fundingResults.length > 0 && (
                <div className="mb-3">
                  <div className="text-xs text-gray-400 font-medium mt-3 mb-1">经费</div>
                  <div className="divide-y divide-gray-100">
                    {fundingResults.map((item, index) => {
                      const resultIndex = results.findIndex(r => r.id === item.id);
                      const isSelected = selectedResultIndex === resultIndex;
                      
                      return (
                        <div
                          key={item.id}
                          data-result-index={resultIndex}
                          className={`px-4 py-3 cursor-pointer ${
                            isSelected ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"
                          }`}
                          onClick={() => onSelectResult(item)}
                          onMouseEnter={() => onHoverResult(resultIndex)}
                        >
                          <div className="flex items-center justify-between py-1">
                            <div className="flex items-center">
                              <div className="text-sm font-medium">{item.text}</div>
                            </div>
                          </div>
                          {item.description && (
                            <div className="text-xs text-gray-500 mt-1 ml-0.5">{item.description}</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 成果分类 */}
                {achievementResults.length > 0 && (
                <div className="mb-3">
                  <div className="text-xs text-gray-400 font-medium mt-3 mb-1">成果</div>
                  <div className="divide-y divide-gray-100">
                    {achievementResults.map((item, index) => {
                      const resultIndex = results.findIndex(r => r.id === item.id);
                      const isSelected = selectedResultIndex === resultIndex;
                      
                      return (
                        <div
                          key={item.id}
                          data-result-index={resultIndex}
                          className={`px-4 py-3 cursor-pointer ${
                            isSelected ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"
                          }`}
                          onClick={() => onSelectResult(item)}
                          onMouseEnter={() => onHoverResult(resultIndex)}
                        >
                          <div className="flex items-center justify-between py-1">
                            <div className="flex items-center">
                              <div className="text-sm font-medium">{item.text}</div>
                            </div>
                          </div>
                          {item.description && (
                            <div className="text-xs text-gray-500 mt-1 ml-0.5">{item.description}</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 人员分类 */}
                {personnelResults.length > 0 && (
                <div className="mb-3">
                  <div className="text-xs text-gray-400 font-medium mt-3 mb-1">人员</div>
                  <div className="divide-y divide-gray-100">
                    {personnelResults.map((item, index) => {
                      const resultIndex = results.findIndex(r => r.id === item.id);
                      const isSelected = selectedResultIndex === resultIndex;
                      
                      return (
                        <div
                          key={item.id}
                          data-result-index={resultIndex}
                          className={`px-4 py-3 cursor-pointer ${
                            isSelected ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"
                          }`}
                          onClick={() => onSelectResult(item)}
                          onMouseEnter={() => onHoverResult(resultIndex)}
                        >
                          <div className="flex items-start py-1">
                            <div className="flex-shrink-0 mr-4">
                              <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 font-medium">
                                {item.text.charAt(0)}
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1.5">
                                <div className="flex items-center">
                                  <div className="text-sm font-medium">{item.text}</div>
                                  {item.age && <div className="text-xs text-gray-500 ml-2">{item.age}岁</div>}
                                </div>
                              </div>
                              {item.description && (
                                <div className="text-xs text-gray-600 mb-1.5">{item.description}</div>
                              )}
                              {item.extraInfo && (
                                <div className="text-xs text-gray-500">{item.extraInfo}</div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 服务分类 */}
              {serviceResults.length > 0 && (
                <div className="mb-3">
                  <div className="text-xs text-gray-400 font-medium mt-3 mb-1">服务</div>
                  <div className="divide-y divide-gray-100">
                    {serviceResults.map((item, index) => {
                      const resultIndex = results.findIndex(r => r.id === item.id);
                      const isSelected = selectedResultIndex === resultIndex;
                      
                      return (
                        <div
                          key={item.id}
                          data-result-index={resultIndex}
                          className={`px-4 py-3 cursor-pointer ${
                            isSelected ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"
                          }`}
                          onClick={() => onSelectResult(item)}
                          onMouseEnter={() => onHoverResult(resultIndex)}
                        >
                          <div className="flex items-center justify-between py-1">
                            <div className="flex items-center">
                              {getServiceIcon(item.text)}
                              <div className="text-sm font-medium">{item.text}</div>
                            </div>
                          </div>
                          {item.description && (
                            <div className="text-xs text-gray-500 mt-1 ml-0.5">{item.description}</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 待办分类 */}
              {todoResults.length > 0 && (
                <div className="mb-3">
                  <div className="text-xs text-gray-400 font-medium mt-3 mb-1">待办</div>
                  <div className="divide-y divide-gray-100">
                    {todoResults.map((item, index) => {
                      const resultIndex = results.findIndex(r => r.id === item.id);
                      const isSelected = selectedResultIndex === resultIndex;
                      
                      return (
                        <div
                          key={item.id}
                          data-result-index={resultIndex}
                          className={`px-4 py-3 cursor-pointer ${
                            isSelected ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"
                          }`}
                          onClick={() => onSelectResult(item)}
                          onMouseEnter={() => onHoverResult(resultIndex)}
                        >
                          <div className="flex items-center justify-between py-1">
                            <div className="flex items-center">
                              {getTodoIcon(item.text)}
                              <div className="text-sm font-medium">{item.text}</div>
                            </div>
                          </div>
                          {item.description && (
                            <div className="text-xs text-gray-500 mt-1 ml-0.5">{item.description}</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* 底部加载完成提示 */}
          <div className="py-4 text-center">
            <div className="text-xs text-gray-400 flex items-center justify-center">
              <span className="inline-block w-16 h-px bg-gray-200 mr-3"></span>
              已加载全部内容
              <span className="inline-block w-16 h-px bg-gray-200 ml-3"></span>
            </div>
          </div>
        </div>
      ) : (
        // 无搜索结果
        <div className="py-10 text-center text-gray-500">没有找到与"{query}"相关的内容</div>
      )}
    </div>
  )
}

