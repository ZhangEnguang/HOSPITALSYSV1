// 获取状态对应的颜色
export function getStatusColor(status: string): string {
  switch (status) {
    case "待审核":
      return "bg-amber-50 text-amber-700 border-amber-200"
    case "已通过":
      return "bg-green-50 text-green-700 border-green-200"
    case "已退回":
      return "bg-red-50 text-red-700 border-red-200"
    case "已完结":
      return "bg-slate-50 text-slate-700 border-slate-200"
    case "进行中":
      return "bg-green-50 text-green-700 border-green-200"
    case "已暂停":
      return "bg-amber-50 text-amber-700 border-amber-200"
    case "已取消":
      return "bg-red-50 text-red-700 border-red-200"
    default:
      return "bg-slate-50 text-slate-700 border-slate-200"
  }
}

// 获取优先级对应的颜色
export function getPriorityColor(priority: string): string {
  switch (priority) {
    case "紧急":
      return "bg-red-500 text-white"
    case "一般":
      return "bg-amber-50 text-amber-700"
    case "普通":
      return "bg-green-50 text-green-700"
    case "高":
      return "bg-black text-white"
    default:
      return "bg-slate-50 text-slate-700"
  }
}

