// 消息格式化工具函数
export const formatMessageContent = (content: string): string => {
  if (!content) return content

  // 添加特殊处理 Permission Management Assistant 快速命令列表
  if (content.includes("🚀 快捷指令清单")) {
    content = content.replace(
      /①\s*【精准赋权】基于角色\/项目的权限配置/g,
      '<div class="cursor-pointer text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-2 rounded-lg my-1 transition-colors flex items-center gap-2" onclick="document.dispatchEvent(new CustomEvent(\'clickPermissionOption\', {detail: \'为「量子计算组」配置初始权限，要求：可访问QC2024项目数据库、禁止导出实验原始数据、组长拥有审批权限。\'}))"><span class="bg-blue-100 text-blue-600 w-6 h-6 rounded-full flex items-center justify-center text-sm">①</span><span>【精准赋权】基于角色/项目的权限配置</span></div>',
    )
    content = content.replace(
      /②\s*【批量操作】多账户权限同步\/回收/g,
      '<div class="cursor-pointer text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-2 rounded-lg my-1 transition-colors flex items-center gap-2" onclick="document.dispatchEvent(new CustomEvent(\'clickPermissionOption\', {detail: \'批量回收2025届毕业生在项目。\'}))"><span class="bg-blue-100 text-blue-600 w-6 h-6 rounded-full flex items-center justify-center text-sm">②</span><span>【批量操作】多账户权限同步/回收</span></div>',
    )
    content = content.replace(
      /③\s*【冲突检测】权限重叠自动分析/g,
      '<div class="cursor-pointer text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-2 rounded-lg my-1 transition-colors flex items-center gap-2" onclick="document.dispatchEvent(new CustomEvent(\'clickPermissionOption\', {detail: \'检查用户「ChenXia@2025」的权限冲突。\'}))"><span class="bg-blue-100 text-blue-600 w-6 h-6 rounded-full flex items-center justify-center text-sm">③</span><span>【冲突检测】权限重叠自动分析</span></div>',
    )
    content = content.replace(
      /④\s*【紧急熔断】高危权限实时回收/g,
      '<div class="cursor-pointer text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-2 rounded-lg my-1 transition-colors flex items-center gap-2" onclick="document.dispatchEvent(new CustomEvent(\'clickPermissionOption\', {detail: \'立即禁用「ZhangWei」账户的所有高危权限！\'}))"><span class="bg-blue-100 text-blue-600 w-6 h-6 rounded-full flex items-center justify-center text-sm">④</span><span>【紧急熔断】高危权限实时回收</span></div>',
    )
    content = content.replace(
      /⑤\s*【生命周期】权限过期自动提醒/g,
      '<div class="cursor-pointer text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-2 rounded-lg my-1 transition-colors flex items-center gap-2" onclick="document.dispatchEvent(new CustomEvent(\'clickPermissionOption\', {detail: \'检测到即将过期权限\'}))"><span class="bg-blue-100 text-blue-600 w-6 h-6 rounded-full flex items-center justify-center text-sm">⑤</span><span>【生命周期】权限过期自动提醒</span></div>',
    )
  }

  // 添加特殊处理 System Log Analysis Agent 快速操作列表
  if (content.includes("🔍 快捷操作清单")) {
    content = content.replace(
      /①\s*【健康扫描】检查当前科研管理系统日志状态/g,
      '<div class="cursor-pointer text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-2 rounded-lg my-1 transition-colors flex items-center gap-2" onclick="document.dispatchEvent(new CustomEvent(\'clickSystemLogOption\', {detail: \'检查当前科研管理系统日志状态\'}))"><span class="bg-blue-100 text-blue-600 w-6 h-6 rounded-full flex items-center justify-center text-sm">①</span><span>【健康扫描】检查当前科研管理系统日志状态</span></div>',
    )
    content = content.replace(
      /②\s*【异常处理】异常登录处理/g,
      '<div class="cursor-pointer text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-2 rounded-lg my-1 transition-colors flex items-center gap-2" onclick="document.dispatchEvent(new CustomEvent(\'clickSystemLogOption\', {detail: \'异常登录处理\'}))"><span class="bg-blue-100 text-blue-600 w-6 h-6 rounded-full flex items-center justify-center text-sm">②</span><span>【异常处理】异常登录处理</span></div>',
    )
    content = content.replace(
      /③\s*【紧急预警】紧急事件响应/g,
      '<div class="cursor-pointer text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-2 rounded-lg my-1 transition-colors flex items-center gap-2" onclick="document.dispatchEvent(new CustomEvent(\'clickSystemLogOption\', {detail: \'紧急事件响应\'}))"><span class="bg-blue-100 text-blue-600 w-6 h-6 rounded-full flex items-center justify-center text-sm">③</span><span>【紧急预警】紧急事件响应</span></div>',
    )
  }

  // 特殊处理文献分析助手的问题模板
  if (content.includes("「请对比文献中的轻量化网络") || content.includes("「如何将知识蒸馏技术")) {
    return content.replace(
      /「([^」]+)」/g,
      "<div class=\"text-blue-600 cursor-pointer hover:text-blue-700 hover:bg-blue-50 p-2 rounded-lg my-1 transition-colors\" onclick=\"document.dispatchEvent(new CustomEvent('clickTemplate', {detail: '$1'}))\">「$1」</div>",
    )
  }

  // 移除星号和其他可能影响阅读的标点符号
  content = content.replace(/\*\*([^*]+)\*\*/g, "$1") // 移除加粗语法 **文本**
  content = content.replace(/\*([^*]+)\*/g, "$1") // 移除斜体语法 *文本*
  content = content.replace(/​/g, "") // 移除零宽空格
  content = content.replace(/\s*\|\s*/g, " | ") // 规范化表格分隔符间距

  // 处理标题和图标 - 更现代化的样式
  // 数据分析标题
  content = content.replace(
    /📊\s*([^\n]+)/g,
    '<div class="flex items-center gap-2 font-medium text-base my-3 bg-gradient-to-r from-blue-50 to-transparent p-3 rounded-lg border-l-4 border-blue-500"><span class="text-blue-500 bg-blue-100 p-1.5 rounded-md"><BarChart className="h-4 w-4" /></span><span>$1</span></div>',
  )

  // 文档标题
  content = content.replace(
    /📄\s*([^\n]+)/g,
    '<div class="flex items-center gap-2 font-medium text-base my-3 bg-gradient-to-r from-blue-50 to-transparent p-3 rounded-lg border-l-4 border-blue-500"><span class="text-blue-500 bg-blue-100 p-1.5 rounded-md"><FileText className="h-4 w-4" /></span><span>$1</span></div>',
  )

  // 时间标题
  content = content.replace(
    /⏰\s*([^\n]+)/g,
    '<div class="flex items-center gap-2 font-medium text-base my-3 bg-gradient-to-r from-amber-50 to-transparent p-3 rounded-lg border-l-4 border-amber-500"><span class="text-amber-500 bg-amber-100 p-1.5 rounded-md"><Clock className="h-4 w-4" /></span><span>$1</span></div>',
  )

  // 日期标题
  content = content.replace(
    /📅\s*([^\n]+)/g,
    '<div class="flex items-center gap-2 font-medium text-base my-3 bg-gradient-to-r from-green-50 to-transparent p-3 rounded-lg border-l-4 border-green-500"><span class="text-green-500 bg-green-100 p-1.5 rounded-md"><Calendar className="h-4 w-4" /></span><span>$1</span></div>',
  )

  // 书籍/文献标题
  content = content.replace(
    /📚\s*([^\n]+)/g,
    '<div class="flex items-center gap-2 font-medium text-base my-3 bg-gradient-to-r from-purple-50 to-transparent p-3 rounded-lg border-l-4 border-purple-500"><span class="text-purple-500 bg-purple-100 p-1.5 rounded-md"><BookOpen className="h-4 w-4" /></span><span>$1</span></div>',
  )

  // 灯泡/提示标题
  content = content.replace(
    /💡\s*([^\n]+)/g,
    '<div class="flex items-center gap-2 font-medium text-base my-3 bg-gradient-to-r from-yellow-50 to-transparent p-3 rounded-lg border-l-4 border-yellow-500"><span class="text-yellow-500 bg-yellow-100 p-1.5 rounded-md"><Lightbulb className="h-4 w-4" /></span><span>$1</span></div>',
  )

  // 闪电/快速标题
  content = content.replace(
    /⚡\s*([^\n]+)/g,
    '<div class="flex items-center gap-2 font-medium text-base my-3 bg-gradient-to-r from-orange-50 to-transparent p-3 rounded-lg border-l-4 border-orange-500"><span class="text-orange-500 bg-orange-100 p-1.5 rounded-md"><Zap className="h-4 w-4" /></span><span>$1</span></div>',
  )

  // 处理Markdown标题
  content = content.replace(
    /###\s+([^\n]+)/g,
    '<div class="font-semibold text-base border-l-4 border-blue-500 pl-3 py-2 my-3 bg-blue-50/50 rounded-r-lg">$1</div>',
  )

  // 处理列表项 (▸ 项目) - 更现代化的样式
  content = content.replace(
    /▸\s*([^\n]+)/g,
    '<div class="flex items-start gap-2 ml-2 my-2 p-2 bg-gradient-to-r from-blue-50/50 to-transparent rounded-lg"><span class="text-blue-500 mt-0.5 bg-blue-100 p-1 rounded"><ArrowRight className="h-3.5 w-3.5" /></span><span>$1</span></div>',
  )

  // 处理成功项 (✅ 项目)
  content = content.replace(
    /✅\s*([^\n]+)/g,
    '<div class="flex items-start gap-2 ml-2 my-2 p-2 bg-gradient-to-r from-green-50/50 to-transparent rounded-lg"><span class="text-green-500 mt-0.5 bg-green-100 p-1 rounded"><CheckCircle className="h-3.5 w-3.5" /></span><span>$1</span></div>',
  )

  // 处理警告项 (❗ 项目)
  content = content.replace(
    /❗\s*([^\n]+)/g,
    '<div class="flex items-start gap-2 ml-2 my-2 p-2 bg-gradient-to-r from-amber-50/50 to-transparent rounded-lg"><span class="text-amber-500 mt-0.5 bg-amber-100 p-1 rounded"><AlertCircle className="h-3.5 w-3.5" /></span><span>$1</span></div>',
  )

  // 处理闪光点 (✨ 项目)
  content = content.replace(
    /✨\s*([^\n]+)/g,
    '<div class="flex items-start gap-2 ml-2 my-2 p-2 bg-gradient-to-r from-purple-50/50 to-transparent rounded-lg"><span class="text-purple-500 mt-0.5 bg-purple-100 p-1 rounded"><Sparkles className="h-3.5 w-3.5" /></span><span>$1</span></div>',
  )

  // 处理可操作按钮 ([按钮文字]) - 更现代化的样式
  content = content.replace(
    /\[([^\]]+)\]/g,
    '<button class="inline-flex items-center justify-center rounded-full text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-500 text-white hover:bg-blue-600 h-8 px-4 py-1 mx-1 my-0.5 shadow-sm">$1</button>',
  )

  // 处理外部链接
  content = content.replace(
    /\[([^\]]+)\]\$\$([^)]+)\$\$/g,
    '<a href="$2" class="text-blue-600 hover:text-blue-700 hover:underline inline-flex items-center gap-1 bg-blue-50 px-3 py-1 rounded-full" target="_blank">$1 <ExternalLink className="h-3 w-3" /></a>',
  )

  // 处理表格 - 更现代化的样式
  if (content.includes("|") && (content.includes("\n|") || content.includes("---"))) {
    const lines = content.split("\n")
    let inTable = false
    let tableHTML =
      '<div class="overflow-x-auto my-4 rounded-xl border border-blue-200 shadow-sm"><table class="w-full border-collapse">'
    let isHeader = false
    let hasProcessedHeaderSeparator = false
    let headerCells: string[] = []

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()

      // 检测表格开始
      if (line.startsWith("|") && line.endsWith("|")) {
        if (!inTable) {
          inTable = true
          isHeader = true
        }

        // 分隔行（包含 ----- 的行）
        if (line.includes("---")) {
          hasProcessedHeaderSeparator = true
          continue
        }

        const cells = line.split("|").filter((cell) => cell.trim() !== "")

        if (isHeader && !hasProcessedHeaderSeparator) {
          headerCells = cells.map((cell) => cell.trim())
          tableHTML += "<thead class='bg-blue-50'><tr>"
          cells.forEach((cell) => {
            tableHTML += `<th class="border-b border-blue-200 px-4 py-3 text-left font-medium text-blue-700">${cell.trim()}</th>`
          })
          tableHTML += "</tr></thead><tbody>"

          // 如果下一行不是分隔符，则认为已经处理完头部
          if (i + 1 < lines.length) {
            const nextLine = lines[i + 1].trim()
            if (!nextLine.includes("---")) {
              isHeader = false
              hasProcessedHeaderSeparator = true
            }
          }
        } else {
          tableHTML += "<tr class='hover:bg-blue-50/50 transition-colors'>"
          cells.forEach((cell, index) => {
            // 确保单元格数量与表头一致
            const cellContent = cell.trim()
            tableHTML += `<td class="border-b border-blue-100 px-4 py-3">${cellContent}</td>`
          })
          tableHTML += "</tr>"
          isHeader = false
        }
      } else if (inTable) {
        // 表格结束
        tableHTML += "</tbody></table></div>"
        inTable = false
        isHeader = false
        hasProcessedHeaderSeparator = false
      }
    }

    if (inTable) {
      tableHTML += "</tbody></table></div>"
    }

    // 替换原始表格文本
    // 使用更精确的正则表达式来匹配表格
    const tableRegex = /(\|[^\n]*\|(\n|$))+/g
    content = content.replace(tableRegex, () => {
      return tableHTML
    })
  }

  // 特殊处理性能对比表
  if (content.includes("性能对比表") || (content.includes("模型类型") && content.includes("参数量"))) {
    // 添加表格前的标题样式
    content = content.replace(
      /(###\s*性能对比表|性能对比表)/g,
      '<div class="font-semibold text-base border-l-4 border-blue-500 pl-3 py-2 my-3 bg-gradient-to-r from-blue-50 to-transparent rounded-r-lg">性能对比表</div>',
    )

    // 为表格添加特殊样式
    content = content.replace(
      /<div class="overflow-x-auto my-4 rounded-xl border border-blue-200 shadow-sm"><table/g,
      '<div class="overflow-x-auto my-4 rounded-xl border border-blue-200 shadow-sm bg-white"><table',
    )
  }

  // 处理分隔线
  content = content.replace(/---+/g, '<hr class="my-4 border-t border-blue-200" />')

  // 处理换行符
  content = content.replace(/\n\n/g, '<div class="h-3"></div>')
  content = content.replace(/\n/g, "<br />")

  return content
}

// 文献分析助手的特殊回复处理
export const handleLiteratureAssistantResponse = (userMessage: string): string | null => {
  // 检查是否包含问题模板1
  if (
    userMessage.includes("请对比文献中的轻量化网络") ||
    userMessage.includes("轻量化网络") ||
    userMessage.includes("CNN模型的性能差异")
  ) {
    return `📊 轻量化网络与经典CNN对比分析

已收到您的请求。以下是轻量化网络与经典CNN的对比分析：

### 最新研究进展
▸ 混合精度量化技术使轻量化网络在INT8精度下仅损失0.5%准确率，同时提升推理速度2.5倍
▸ 神经架构搜索(NAS)自动优化的MobileNetV3-NAS变体在相同参数量下提升准确率1.2%
▸ 新型硬件感知设计使ShuffleNetV3在边缘AI芯片上能耗降低40%，同时保持性能
▸ 轻量化网络在保持可接受精度（较经典CNN如ResNet-50仅降低0.7-3.1%）的前提下，参数量减少80%-87%
▸ 推理速度提升1.8-2倍，典型代表MobileNetV3以5.4M参数实现75.6% ImageNet精度（58 FPS）

### 应用案例分析
▸ 自动驾驶辅助系统中，轻量化模型实现30fps实时目标检测，延迟降低65%
▸ 移动AR应用中，优化后的MobileNetV3实现单帧处理时间<20ms，满足交互需求
▸ 智能监控系统中，边缘部署的ShuffleNetV2降低带宽需求90%，同时保持检测准确率
▸ 医疗影像分析中，轻量化模型使设备端实时诊断成为可能，无需云端处理

[查看完整技术报告] [导出对比数据]`
  }

  // 检查是否包含问题模板2
  if (userMessage.includes("知识蒸馏") || userMessage.includes("模型压缩")) {
    return `🔍 知识蒸馏技术应用指南

知识蒸馏应用于图像识别模型压缩的方法如下：

### 1. 教师-学生架构设置
<div class="flex items-start gap-2 my-2 ml-4">
  <span class="text-blue-500 mt-1"><Cpu className="h-4 w-4" /></span>
  <span>教师网络：使用预训练的大型模型（如ResNet-152）</span>
</div>
<div class="flex items-start gap-2 my-2 ml-4">
  <span class="text-green-500 mt-1"><Cpu className="h-4 w-4" /></span>
  <span>学生网络：轻量化模型（如MobileNet或自定义小型CNN）</span>
</div>

### 2. 蒸馏损失函数设计
<div class="flex items-start gap-2 my-2 ml-4">
  <span class="text-amber-500 mt-1"><Workflow className="h-4 w-4" /></span>
  <span>软标签损失：KL散度(student_logits/T, teacher_logits/T), T为温度参数（通常2-5）</span>
</div>
<div class="flex items-start gap-2 my-2 ml-4">
  <span class="text-amber-500 mt-1"><Workflow className="h-4 w-4" /></span>
  <span>硬标签损失：交叉熵(student_output, ground_truth)</span>
</div>
<div class="flex items-start gap-2 my-2 ml-4">
  <span class="text-amber-500 mt-1"><Workflow className="h-4 w-4" /></span>
  <span>总损失：α·软标签损失 + (1-α)·硬标签损失，α为平衡系数</span>
</div>

### 3. 特征图蒸馏
<div class="flex items-start gap-2 my-2 ml-4">
  <span class="text-purple-500 mt-1"><Layers className="h-4 w-4" /></span>
  <span>在中间层添加适配器将教师特征映射到学生特征空间</span>
</div>
<div class="flex items-start gap-2 my-2 ml-4">
  <span class="text-purple-500 mt-1"><Layers className="h-4 w-4" /></span>
  <span>最小化教师与学生特征图的L2距离或相关性差异</span>
</div>

### 4. 实验效果
<div class="flex items-start gap-2 my-2 ml-4">
  <span class="text-green-500 mt-1"><TrendingUp className="h-4 w-4" /></span>
  <span>参数量减少75%的情况下，精度损失控制在2-3%以内</span>
</div>
<div class="flex items-start gap-2 my-2 ml-4">
  <span class="text-green-500 mt-1"><TrendingUp className="h-4 w-4" /></span>
  <span>推理速度提升3-4倍，模型大小减少70%以上</span>
</div>

<div class="bg-blue-50 p-3 rounded-md mt-3 border-l-4 border-blue-500">
  <div class="flex items-start gap-2">
    <span class="text-blue-600 mt-1"><Lightbulb className="h-4 w-4" /></span>
    <span>这种方法特别适合部署到移动设备和嵌入式系统中的图像识别应用</span>
  </div>
</div>

[查看代码示例] [获取预训练模型]`
  }

  // 默认回复
  return null
}

// 检查是否是文献分析助手活跃状态
export const isLiteratureAssistantActive = (messages: Array<{ type: string; content: string }>): boolean => {
  // 检查最近的消息是否包含文献分析助手的启动信息
  const recentMessages = messages.slice(-3)
  return recentMessages.some(
    (msg) =>
      msg.type === "bot" &&
      (msg.content.includes("文献分析助手已启动") ||
        msg.content.includes("请上传您需要分析的文献文件") ||
        msg.content.includes("您可以点击以下问题模板")),
  )
}

