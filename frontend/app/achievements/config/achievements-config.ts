export const quickFilters = [
  {
    id: "type",
    label: "成果类型",
    value: "all",
    category: "basic",
    options: [
      { id: "all", label: "全部类型", value: "all" },
      { id: "academic-papers", label: "学术论文", value: "学术论文" },
      { id: "academic-works", label: "学术著作", value: "学术著作" },
      { id: "evaluated-achievements", label: "鉴定成果", value: "鉴定成果" },
      { id: "achievement-awards", label: "成果获奖", value: "成果获奖" },
      { id: "patents", label: "专利", value: "专利" },
    ],
  },
  {
    id: "status",
    label: "状态",
    value: "all",
    category: "basic",
    options: [
      { id: "all", label: "全部状态", value: "all" },
      { id: "draft", label: "草稿", value: "草稿" },
      { id: "pending", label: "待审核", value: "待审核" },
      { id: "approved", label: "已通过", value: "已通过" },
      { id: "rejected", label: "已退回", value: "已退回" },
    ],
  },
];

export const statusColors: Record<string, "default" | "destructive" | "outline" | "secondary"> = {
  "草稿": "default",
  "待审核": "secondary",
  "已通过": "outline",
  "已退回": "destructive",
}; 