"use client"

import React from "react"

export function LiverFunctionChart() {
  // 模拟肝功能指标数据
  const indicators = ["ALT", "AST", "ALP", "GGT", "TBIL", "DBIL"];
  const experimentalData = [5.2, 6.8, 2.1, 4.3, 1.8, 1.2]; // 变化率(%)
  const controlData = [1.5, 2.2, 0.8, 1.2, 0.5, 0.3]; // 变化率(%)
  
  // 确定最大值以设置比例
  const maxValue = 8; // 固定最大值为8%，确保视觉效果更好
  
  return (
    <div className="w-full bg-white rounded-md border border-slate-200 p-4">
      <div className="mb-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">肝功能指标变化(%)</h3>
        <div className="flex items-center gap-4 text-xs text-slate-600">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-sm bg-purple-500 mr-1"></div>
            <span>实验组</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-sm bg-slate-400 mr-1"></div>
            <span>对照组</span>
          </div>
        </div>
      </div>
      
      {/* 图表主体 */}
      <div className="h-56 relative">
        {/* Y轴和水平网格线 */}
        <div className="absolute left-12 top-0 w-[calc(100%-20px)] h-48 flex flex-col justify-between">
          <div className="border-t border-dashed border-slate-200 h-0 relative">
            <span className="absolute -left-10 -top-2.5 text-xs text-slate-500 w-8 text-right">8%</span>
          </div>
          <div className="border-t border-dashed border-slate-200 h-0 relative">
            <span className="absolute -left-10 -top-2.5 text-xs text-slate-500 w-8 text-right">4%</span>
          </div>
          <div className="border-t border-dashed border-slate-200 h-0 relative">
            <span className="absolute -left-10 -top-2.5 text-xs text-slate-500 w-8 text-right">0%</span>
          </div>
        </div>
        
        {/* 柱状图容器 */}
        <div className="absolute left-12 bottom-8 h-48 w-[calc(100%-20px)] flex justify-around items-end">
          {indicators.map((indicator, index) => (
            <div key={index} className="flex flex-col items-center w-8">
              <div className="h-full flex flex-col items-center justify-end">
                <div className="flex gap-1 items-end">
                  {/* 实验组柱状图 */}
                  <div 
                    className="w-4 bg-purple-500 rounded-t" 
                    style={{ height: `${(experimentalData[index] / maxValue) * 48}px` }} 
                  />
                  
                  {/* 对照组柱状图 */}
                  <div 
                    className="w-4 bg-slate-400 rounded-t" 
                    style={{ height: `${(controlData[index] / maxValue) * 48}px` }} 
                  />
                </div>
              </div>
              <div className="pt-1 border-t border-slate-200 mt-1 w-full text-center">
                <span className="text-xs text-slate-600">{indicator}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-2 text-xs text-slate-600 border-t border-slate-200 pt-3">
        <div className="flex items-start">
          <span className="font-medium">结论：</span>
          <p className="ml-1">实验组肝功能指标在治疗剂量范围内保持稳定，无明显肝毒性反应</p>
        </div>
      </div>
    </div>
  )
} 