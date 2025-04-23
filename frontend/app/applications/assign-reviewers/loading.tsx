export default function Loading() {
  return (
    <div className="flex flex-col h-screen">
      {/* 顶部Header骨架屏 */}
      <div className="bg-white border-b p-4 h-[15%] flex flex-col justify-between">
        <div className="flex items-center gap-2">
          <div className="w-20 h-8 bg-gray-200 animate-pulse rounded-md"></div>
          <div className="h-6 bg-gray-200 animate-pulse rounded-md w-2/3"></div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-gray-200 animate-pulse rounded-full"></div>
              <div>
                <div className="h-4 w-32 bg-gray-200 animate-pulse rounded-md"></div>
                <div className="h-3 w-24 bg-gray-200 animate-pulse rounded-md mt-1"></div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="h-4 w-4 bg-gray-200 animate-pulse rounded-full"></div>
              <div>
                <div className="h-4 w-40 bg-gray-200 animate-pulse rounded-md"></div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-6 w-16 bg-gray-200 animate-pulse rounded-md"></div>
            <div className="h-6 w-16 bg-gray-200 animate-pulse rounded-md"></div>
            <div className="h-6 w-24 bg-gray-200 animate-pulse rounded-md"></div>
            <div className="h-6 w-20 bg-gray-200 animate-pulse rounded-md"></div>
          </div>
        </div>
      </div>

      {/* 主体内容区骨架屏 */}
      <div className="flex flex-1 overflow-hidden">
        {/* 左侧主内容区 */}
        <div className="w-[70%] p-4 overflow-auto bg-gray-50">
          <div className="space-y-6">
            {/* 项目概览骨架屏 */}
            <div className="bg-white rounded-lg border shadow-sm">
              <div className="p-4 border-b">
                <div className="h-5 w-32 bg-gray-200 animate-pulse rounded-md"></div>
              </div>
              <div className="p-6 space-y-4">
                <div className="h-4 w-full bg-gray-200 animate-pulse rounded-md"></div>
                <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded-md"></div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <div className="h-4 w-24 bg-gray-200 animate-pulse rounded-md"></div>
                      <div className="h-4 w-32 bg-gray-200 animate-pulse rounded-md"></div>
                    </div>
                    <div className="h-px bg-gray-200"></div>
                    <div className="flex justify-between">
                      <div className="h-4 w-24 bg-gray-200 animate-pulse rounded-md"></div>
                      <div className="h-4 w-32 bg-gray-200 animate-pulse rounded-md"></div>
                    </div>
                    <div className="h-px bg-gray-200"></div>
                    <div className="flex justify-between">
                      <div className="h-4 w-24 bg-gray-200 animate-pulse rounded-md"></div>
                      <div className="h-4 w-32 bg-gray-200 animate-pulse rounded-md"></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <div className="h-4 w-24 bg-gray-200 animate-pulse rounded-md"></div>
                      <div className="h-4 w-32 bg-gray-200 animate-pulse rounded-md"></div>
                    </div>
                    <div className="h-px bg-gray-200"></div>
                    <div className="flex justify-between">
                      <div className="h-4 w-24 bg-gray-200 animate-pulse rounded-md"></div>
                      <div className="h-4 w-32 bg-gray-200 animate-pulse rounded-md"></div>
                    </div>
                    <div className="h-px bg-gray-200"></div>
                    <div className="flex justify-between">
                      <div className="h-4 w-24 bg-gray-200 animate-pulse rounded-md"></div>
                      <div className="h-4 w-32 bg-gray-200 animate-pulse rounded-md"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 研究价值AI评估骨架屏 */}
            <div className="bg-white rounded-lg border shadow-sm">
              <div className="p-4 border-b">
                <div className="h-5 w-40 bg-gray-200 animate-pulse rounded-md"></div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-4 gap-4 mb-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-gray-100 p-3 rounded-lg">
                      <div className="h-3 w-16 bg-gray-200 animate-pulse rounded-md mb-2"></div>
                      <div className="h-6 w-12 bg-gray-200 animate-pulse rounded-md"></div>
                    </div>
                  ))}
                </div>

                <div className="bg-gray-100 p-3 rounded-lg">
                  <div className="h-4 w-32 bg-gray-200 animate-pulse rounded-md mb-2"></div>
                  <div className="h-4 w-full bg-gray-200 animate-pulse rounded-md mb-1"></div>
                  <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded-md"></div>
                </div>
              </div>
            </div>

            {/* 动态资金流图谱骨架屏 */}
            <div className="bg-white rounded-lg border shadow-sm">
              <div className="p-4 border-b">
                <div className="h-5 w-40 bg-gray-200 animate-pulse rounded-md"></div>
              </div>
              <div className="p-6">
                <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="space-y-4 w-full max-w-md p-4">
                    <div className="h-4 w-48 bg-gray-200 animate-pulse rounded-md mx-auto"></div>

                    {[1, 2, 3].map((i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex justify-between">
                          <div className="h-4 w-16 bg-gray-200 animate-pulse rounded-md"></div>
                          <div className="h-4 w-24 bg-gray-200 animate-pulse rounded-md"></div>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 右侧固定区域骨架屏 */}
        <div className="w-[30%] border-l bg-white">
          <div className="border-b">
            <div className="flex">
              <div className="flex-1 h-10 border-r flex items-center justify-center">
                <div className="h-4 w-20 bg-gray-200 animate-pulse rounded-md"></div>
              </div>
              <div className="flex-1 h-10 flex items-center justify-center">
                <div className="h-4 w-32 bg-gray-200 animate-pulse rounded-md"></div>
              </div>
            </div>
          </div>

          <div className="p-4 border-b">
            <div className="relative">
              <div className="w-full h-10 bg-gray-200 animate-pulse rounded-md"></div>
            </div>
          </div>

          <div className="p-4 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border rounded-lg p-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-gray-200 animate-pulse rounded-full"></div>
                    <div>
                      <div className="h-4 w-24 bg-gray-200 animate-pulse rounded-md mb-1"></div>
                      <div className="h-3 w-32 bg-gray-200 animate-pulse rounded-md"></div>
                    </div>
                  </div>
                  <div className="h-8 w-16 bg-gray-200 animate-pulse rounded-md"></div>
                </div>

                <div className="mt-3">
                  <div className="flex items-center justify-between mb-1">
                    <div className="h-3 w-16 bg-gray-200 animate-pulse rounded-md"></div>
                    <div className="h-3 w-8 bg-gray-200 animate-pulse rounded-md"></div>
                  </div>
                  <div className="h-1.5 bg-gray-200 animate-pulse rounded-full"></div>
                </div>

                <div className="mt-3 flex flex-wrap gap-1">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="h-5 w-16 bg-gray-200 animate-pulse rounded-full"></div>
                  ))}
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div className="h-3 w-16 bg-gray-200 animate-pulse rounded-md"></div>
                  <div className="h-3 w-24 bg-gray-200 animate-pulse rounded-md"></div>
                  <div className="h-3 w-16 bg-gray-200 animate-pulse rounded-md"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 底部操作栏骨架屏 */}
      <div className="bg-white border-t p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <div className="h-4 w-32 bg-gray-200 animate-pulse rounded-md mb-2"></div>
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-8 w-8 bg-gray-200 animate-pulse rounded-full border-2 border-white"></div>
              ))}
            </div>
          </div>

          <div className="h-10 w-px bg-gray-200"></div>

          <div>
            <div className="h-4 w-24 bg-gray-200 animate-pulse rounded-md mb-2"></div>
            <div className="h-4 w-40 bg-gray-200 animate-pulse rounded-md"></div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="h-9 w-16 bg-gray-200 animate-pulse rounded-md"></div>
          <div className="h-9 w-20 bg-gray-200 animate-pulse rounded-md"></div>
        </div>
      </div>
    </div>
  )
}

