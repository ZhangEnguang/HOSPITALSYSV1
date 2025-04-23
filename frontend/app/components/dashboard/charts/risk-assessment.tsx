import React from "react"
import { Scatter } from "react-chartjs-2"
import { ChartOptions } from "chart.js"

export function RiskAssessmentChart() {
  // 根据影响程度和发生概率计算风险等级
  const calculateRiskColor = (x: number, y: number) => {
    const riskScore = x * y / 100; // 0-100范围的风险分数
    
    if (riskScore > 60) {
      return "rgba(239, 68, 68, 0.8)"; // 红色 - 高风险
    } else if (riskScore > 30) {
      return "rgba(249, 127, 127, 0.7)"; // 浅红色 - 中高风险
    } else if (riskScore > 15) {
      return "rgba(138, 215, 252, 0.7)"; // 浅蓝色 - 中低风险
    } else {
      return "rgba(114, 117, 242, 0.7)"; // 深蓝色 - 低风险
    }
  };

  const riskPoints = [
    { x: 80, y: 90, r: 15 },
    { x: 70, y: 60, r: 12 },
    { x: 60, y: 40, r: 10 },
    { x: 35, y: 50, r: 8 },
    { x: 20, y: 30, r: 6 },
  ];

  const data = {
    datasets: [
      {
        label: "风险点",
        data: riskPoints,
        backgroundColor: riskPoints.map(point => calculateRiskColor(point.x, point.y)),
        borderColor: riskPoints.map(point => calculateRiskColor(point.x, point.y).replace("0.7", "1")),
        borderWidth: 1,
        pointHoverRadius: 8,
        pointHoverBorderWidth: 2,
        pointHoverBackgroundColor: riskPoints.map(point => calculateRiskColor(point.x, point.y).replace("0.7", "0.9")),
      },
    ],
  }

  const options: ChartOptions<"scatter"> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        min: 0,
        max: 100,
        title: {
          display: true,
          text: "影响程度",
          color: "#666"
        },
        grid: {
          display: true,
          color: "rgba(0, 0, 0, 0.05)"
        },
      },
      y: {
        min: 0,
        max: 100,
        title: {
          display: true,
          text: "发生概率",
          color: "#666"
        },
        grid: {
          display: true,
          color: "rgba(0, 0, 0, 0.05)"
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(this: any, context: any) {
            const point = context.raw;
            const riskScore = (point.x * point.y / 100).toFixed(0);
            const riskScoreNum = parseInt(riskScore);
            let riskLevel = "低风险";
            
            if (riskScoreNum > 60) riskLevel = "高风险";
            else if (riskScoreNum > 30) riskLevel = "中高风险";  
            else if (riskScoreNum > 15) riskLevel = "中低风险";
            
            return [
              `风险等级: ${riskLevel}`,
              `影响程度: ${point.x}%`,
              `发生概率: ${point.y}%`,
              `风险评分: ${riskScore}`
            ];
          },
        },
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        padding: 10,
        displayColors: false
      },
    },
  }

  return (
    <div className="h-[300px] w-full">
      <Scatter data={data} options={options} />
    </div>
  )
} 