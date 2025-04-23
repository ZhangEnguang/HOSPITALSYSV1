interface OperationHistoryTabProps {
  operationHistory?: Array<{
    date: string
    user: string
    action: string
    detail: string
  }>
}

export default function OperationHistoryTab({
  operationHistory = [
    { date: "2024-03-18", user: "王经理", action: "修改", detail: "更新了项目预算" },
    { date: "2024-03-10", user: "李研究员", action: "添加", detail: "上传了研究报告" },
    { date: "2024-02-28", user: "张主任", action: "分配", detail: "将任务分配给李研究员" },
    { date: "2024-02-15", user: "系统", action: "提醒", detail: "项目进度落后提醒" },
    { date: "2024-02-01", user: "赵经理", action: "更新", detail: "更新了项目时间线" },
  ],
}: OperationHistoryTabProps) {
  return (
    <div className="h-full">
      <div className="relative pl-6 pr-2 mt-4">
        {/* 竖线 */}
        <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-gradient-to-b from-blue-300 to-blue-100"></div>

        <div className="space-y-4">
          {operationHistory.map((record, index) => (
            <div key={index} className="relative group">
              {/* 时间点 */}
              <div
                className="absolute left-[-20px] top-0 w-4 h-4 rounded-full bg-white border-2 border-blue-400 z-10 
                              transition-all duration-500 ease-in-out 
                              group-hover:scale-125 group-hover:border-blue-500 
                              group-hover:shadow-[0_0_10px_rgba(59,130,246,0.5)]"
              ></div>

              <div
                className="bg-white/50 backdrop-blur-sm rounded-lg p-3 border border-transparent 
                          transition-all duration-400 ease-out 
                          group-hover:bg-white group-hover:border-blue-200 
                          group-hover:shadow-[0_4px_12px_rgba(59,130,246,0.15)] 
                          transform group-hover:translate-x-2 group-hover:-translate-y-1 
                          group-hover:scale-[1.02]"
              >
                <div className="flex justify-between items-center mb-1">
                  <span
                    className="font-medium text-sm text-blue-700 transition-all duration-300 
                                  group-hover:text-blue-600 group-hover:translate-x-1"
                  >
                    {record.action}
                  </span>
                  <span
                    className="text-slate-500 text-xs transition-all duration-300 
                                  group-hover:text-blue-500"
                  >
                    {record.date}
                  </span>
                </div>
                <div
                  className="text-xs text-slate-500 mb-1 transition-all duration-300 
                                group-hover:text-slate-700 group-hover:translate-x-1"
                >
                  {record.user}
                </div>
                <div
                  className="text-xs text-slate-700 bg-slate-50 p-2 rounded 
                                transition-all duration-500 ease-in-out 
                                group-hover:bg-blue-50/80 group-hover:text-slate-800 
                                group-hover:shadow-inner"
                >
                  {record.detail}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

