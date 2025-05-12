"use client"

import React from "react"

export function SimpleSerumChart() {
  return (
    <div className="w-full h-64 border border-slate-200 rounded-lg p-4 bg-white">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium">血清药物浓度图表</h3>
        <div className="flex items-center gap-3">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-1.5"></div>
            <span className="text-xs text-slate-600">实验组</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gray-400 rounded-full mr-1.5"></div>
            <span className="text-xs text-slate-600">对照组</span>
          </div>
        </div>
      </div>
      
      <div className="relative h-40 w-full">
        {/* 背景网格 */}
        <div className="absolute inset-0 grid grid-cols-10 grid-rows-4 border-l border-b border-slate-200">
          {Array.from({ length: 40 }).map((_, i) => (
            <div key={i} className="border-t border-r border-slate-100"></div>
          ))}
        </div>
        
        {/* 实验组曲线 - 使用简单的div元素模拟 */}
        <div className="absolute left-0 bottom-0 w-full h-full flex items-end">
          <div style={{ height: '0%', width: '2px' }} className="bg-blue-500 relative mx-[5%] z-10">
            <div className="absolute top-0 left-1/2 w-2 h-2 bg-blue-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
          </div>
          <div style={{ height: '55%', width: '2px' }} className="bg-blue-500 relative mx-[5%] z-10">
            <div className="absolute top-0 left-1/2 w-2 h-2 bg-blue-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
          </div>
          <div style={{ height: '95%', width: '2px' }} className="bg-blue-500 relative mx-[5%] z-10">
            <div className="absolute top-0 left-1/2 w-2 h-2 bg-blue-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
          </div>
          <div style={{ height: '85%', width: '2px' }} className="bg-blue-500 relative mx-[5%] z-10">
            <div className="absolute top-0 left-1/2 w-2 h-2 bg-blue-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
          </div>
          <div style={{ height: '70%', width: '2px' }} className="bg-blue-500 relative mx-[5%] z-10">
            <div className="absolute top-0 left-1/2 w-2 h-2 bg-blue-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
          </div>
          <div style={{ height: '50%', width: '2px' }} className="bg-blue-500 relative mx-[5%] z-10">
            <div className="absolute top-0 left-1/2 w-2 h-2 bg-blue-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
          </div>
          <div style={{ height: '35%', width: '2px' }} className="bg-blue-500 relative mx-[5%] z-10">
            <div className="absolute top-0 left-1/2 w-2 h-2 bg-blue-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
          </div>
          <div style={{ height: '25%', width: '2px' }} className="bg-blue-500 relative mx-[5%] z-10">
            <div className="absolute top-0 left-1/2 w-2 h-2 bg-blue-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
          </div>
          <div style={{ height: '15%', width: '2px' }} className="bg-blue-500 relative mx-[5%] z-10">
            <div className="absolute top-0 left-1/2 w-2 h-2 bg-blue-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
          </div>
          <div style={{ height: '5%', width: '2px' }} className="bg-blue-500 relative mx-[5%] z-10">
            <div className="absolute top-0 left-1/2 w-2 h-2 bg-blue-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
          </div>
        </div>
        
        {/* 对照组曲线 */}
        <div className="absolute left-2 bottom-0 w-full h-full flex items-end">
          <div style={{ height: '0%', width: '2px' }} className="bg-gray-400 relative mx-[5%] z-10">
            <div className="absolute top-0 left-1/2 w-2 h-2 bg-gray-400 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
          </div>
          <div style={{ height: '45%', width: '2px' }} className="bg-gray-400 relative mx-[5%] z-10">
            <div className="absolute top-0 left-1/2 w-2 h-2 bg-gray-400 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
          </div>
          <div style={{ height: '80%', width: '2px' }} className="bg-gray-400 relative mx-[5%] z-10">
            <div className="absolute top-0 left-1/2 w-2 h-2 bg-gray-400 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
          </div>
          <div style={{ height: '65%', width: '2px' }} className="bg-gray-400 relative mx-[5%] z-10">
            <div className="absolute top-0 left-1/2 w-2 h-2 bg-gray-400 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
          </div>
          <div style={{ height: '45%', width: '2px' }} className="bg-gray-400 relative mx-[5%] z-10">
            <div className="absolute top-0 left-1/2 w-2 h-2 bg-gray-400 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
          </div>
          <div style={{ height: '35%', width: '2px' }} className="bg-gray-400 relative mx-[5%] z-10">
            <div className="absolute top-0 left-1/2 w-2 h-2 bg-gray-400 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
          </div>
          <div style={{ height: '25%', width: '2px' }} className="bg-gray-400 relative mx-[5%] z-10">
            <div className="absolute top-0 left-1/2 w-2 h-2 bg-gray-400 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
          </div>
          <div style={{ height: '15%', width: '2px' }} className="bg-gray-400 relative mx-[5%] z-10">
            <div className="absolute top-0 left-1/2 w-2 h-2 bg-gray-400 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
          </div>
          <div style={{ height: '8%', width: '2px' }} className="bg-gray-400 relative mx-[5%] z-10">
            <div className="absolute top-0 left-1/2 w-2 h-2 bg-gray-400 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
          </div>
          <div style={{ height: '2%', width: '2px' }} className="bg-gray-400 relative mx-[5%] z-10">
            <div className="absolute top-0 left-1/2 w-2 h-2 bg-gray-400 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
          </div>
        </div>
        
        {/* X轴标签 */}
        <div className="absolute bottom-[-22px] left-0 w-full flex justify-between px-[1%] text-xs text-slate-500">
          <span>0h</span>
          <span>0.5h</span>
          <span>1h</span>
          <span>2h</span>
          <span>4h</span>
          <span>6h</span>
          <span>8h</span>
          <span>12h</span>
          <span>24h</span>
          <span>48h</span>
        </div>
        
        {/* Y轴标签 */}
        <div className="absolute top-0 left-[-30px] h-full flex flex-col justify-between text-xs text-slate-500">
          <span>250ng/ml</span>
          <span>125ng/ml</span>
          <span>0ng/ml</span>
        </div>
      </div>
    </div>
  )
} 