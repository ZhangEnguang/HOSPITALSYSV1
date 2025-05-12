"use client"

import React from "react"

export function MetaboliteDistributionChart() {
  // 模拟代谢物分布数据
  const metabolites = [
    { name: "M1代谢物", value: 45, color: "#f59e0b", bgColor: "bg-amber-500" },
    { name: "M2代谢物", value: 33, color: "#10b981", bgColor: "bg-emerald-500" },
    { name: "其他代谢物", value: 22, color: "#60a5fa", bgColor: "bg-blue-400" }
  ];
  
  // 计算总和和累积角度
  const total = metabolites.reduce((sum, item) => sum + item.value, 0);
  
  // 生成饼图扇区
  const generateSlices = () => {
    let currentAngle = 0;
    return metabolites.map((item, index) => {
      const angle = (item.value / total) * 360;
      const sliceStyle = {
        position: 'absolute',
        width: '100%',
        height: '100%',
        transform: `rotate(${currentAngle}deg)`,
        transformOrigin: '50% 50%',
        clip: 'rect(0px, 80px, 160px, 0px)',
        backgroundColor: 'transparent',
      } as React.CSSProperties;
      
      const pieStyle = {
        position: 'absolute',
        width: '100%',
        height: '100%',
        clip: angle <= 180 ? 'rect(0px, 80px, 160px, 40px)' : 'rect(0px, 80px, 160px, 0px)',
        transform: angle <= 180 ? 'rotate(0deg)' : `rotate(${180}deg)`,
        transformOrigin: '50% 50%',
        backgroundColor: item.color,
        borderRadius: '50%',
      } as React.CSSProperties;
      
      currentAngle += angle;
      
      return (
        <div key={index} style={sliceStyle}>
          <div style={pieStyle}></div>
        </div>
      );
    });
  };
  
  return (
    <div className="w-full bg-white rounded-md border border-slate-200 p-4">
      <div className="mb-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">代谢物分布情况</h3>
      </div>
      
      <div className="flex flex-col md:flex-row items-center justify-center gap-6">
        {/* 简化的饼图实现 */}
        <div className="w-40 h-40 rounded-full overflow-hidden relative bg-gray-100 flex items-center justify-center">
          {/* 使用分割的颜色块来模拟饼图 */}
          <div className="w-full h-full relative">
            <div className="absolute inset-0 bg-amber-500" style={{ clipPath: 'polygon(50% 50%, 50% 0, 100% 0, 100% 100%, 50% 100%)' }}></div>
            <div className="absolute inset-0 bg-emerald-500" style={{ clipPath: 'polygon(50% 50%, 50% 100%, 0 100%, 0 30%, 50% 0)' }}></div>
            <div className="absolute inset-0 bg-blue-400" style={{ clipPath: 'polygon(50% 50%, 0 30%, 0 0, 50% 0)' }}></div>
          </div>
          <div className="absolute w-12 h-12 bg-white rounded-full z-10"></div>
        </div>
        
        {/* 图例 */}
        <div className="flex flex-col gap-3 mt-4 md:mt-0">
          {metabolites.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-sm ${item.bgColor}`}></div>
              <span className="text-sm text-slate-700">{item.name}</span>
              <span className="text-sm font-medium">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-6 text-xs text-slate-600">
        <div className="flex items-start">
          <span className="font-medium">结论：</span>
          <p className="ml-1">初步结果显示代谢物M1和M2占总代谢物的78%，与预期一致</p>
        </div>
      </div>
    </div>
  )
} 