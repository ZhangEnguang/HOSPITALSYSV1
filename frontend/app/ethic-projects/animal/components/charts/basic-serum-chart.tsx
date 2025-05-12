"use client"

import React from "react"

export function BasicSerumChart() {
  // 模拟数据
  const experimentalData = [0, 35, 65, 55, 45, 35, 25, 20, 15, 5];
  const controlData = [0, 30, 55, 45, 30, 25, 18, 12, 8, 2];
  const timePoints = ["0h", "0.5h", "1h", "2h", "4h", "6h", "8h", "12h", "24h", "48h"];
  
  // 计算最大值以确定比例
  const maxValue = Math.max(...experimentalData, ...controlData);
  
  return (
    <div className="w-full bg-white rounded-md border border-slate-200 p-4">
      <div className="mb-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">实验药物血药浓度曲线</h3>
        <div className="flex items-center gap-4 text-xs text-slate-600">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
            <span>实验组</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-slate-400 mr-1"></div>
            <span>对照组</span>
          </div>
        </div>
      </div>
      
      <div className="relative h-48 border-b border-l border-slate-200 pt-2">
        {/* Y轴标签 */}
        <div className="absolute -left-8 top-0 h-full flex flex-col justify-between text-xs text-slate-500">
          <span>{maxValue}ng/ml</span>
          <span>{Math.round(maxValue/2)}ng/ml</span>
          <span>0ng/ml</span>
        </div>
        
        {/* 数据可视化 - 使用基本的div来表示 */}
        <div className="flex justify-between h-full pl-2">
          {timePoints.map((time, index) => (
            <div key={index} className="flex flex-col items-center justify-end h-full">
              <div className="relative w-8 flex flex-col items-center">
                {/* 实验组柱状图 */}
                <div 
                  className="w-3 bg-blue-500 rounded-t-sm" 
                  style={{ height: `${(experimentalData[index] / maxValue) * 100}%` }} 
                />
                
                {/* 对照组柱状图 */}
                <div 
                  className="w-3 bg-slate-400 rounded-t-sm absolute left-4" 
                  style={{ height: `${(controlData[index] / maxValue) * 100}%` }} 
                />
              </div>
              <span className="mt-2 text-xs text-slate-500 rotate-45 origin-left">{time}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-4 text-xs text-slate-600">
        <div className="flex items-start">
          <span className="font-medium">结论：</span>
          <p className="ml-1">药物在实验组中表现出较长的半衰期，维持有效血药浓度时间延长32%</p>
        </div>
      </div>
    </div>
  )
} 