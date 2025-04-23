"use client"

import { useEffect, useRef } from "react"
import * as echarts from "echarts/core"
import { PieChart } from "echarts/charts"
import { TitleComponent, TooltipComponent, LegendComponent } from "echarts/components"
import { CanvasRenderer } from "echarts/renderers"

// 注册必要的组件
echarts.use([TitleComponent, TooltipComponent, LegendComponent, PieChart, CanvasRenderer])

// 模拟数据 - 各学院经费分布（单位：万元）
const data = [
  { name: "计算机学院", value: 1860 },
  { name: "机械工程学院", value: 1420 },
  { name: "电气工程学院", value: 1380 },
  { name: "材料科学学院", value: 1250 },
  { name: "生物医学学院", value: 1080 },
  { name: "化学化工学院", value: 950 },
  { name: "经济管理学院", value: 820 },
  { name: "其他学院", value: 1240 }
];

// 指定颜色，与project-status-chart保持一致的配色方案
const colors = ["#F97F7F", "#8AD7FC", "#7275F2", "#92F1B4", "#FFB36D", "#A7AEFF", "#FFA5A5", "#B4F4E0"]

// 定义图表参数类型
interface TooltipParamType {
  name: string;
  value: number;
  percent: number;
}

// 定义Label类型
interface LabelType {
  show: boolean;
  position?: string;
  formatter?: string;
  fontSize?: number;
  fontWeight?: string;
}

export default function FundsDistributionChart() {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<echarts.ECharts | null>(null)

  useEffect(() => {
    if (!chartRef.current) return

    // 如果已经有实例，先销毁
    if (chartInstance.current) {
      chartInstance.current.dispose()
    }

    // 创建新实例
    chartInstance.current = echarts.init(chartRef.current)

    // 设置图表选项
    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c}万元 ({d}%)'
      },
      legend: {
        bottom: 'bottom',
        itemWidth: 10,
        itemHeight: 10,
        itemGap: 20,
        textStyle: {
          fontSize: 12,
          color: '#666'
        }
      },
      series: [
        {
          name: '经费分布',
          type: 'pie',
          radius: ['40%', '65%'],
          center: ['50%', '45%'],
          avoidLabelOverlap: true,
          itemStyle: {
            borderRadius: 4,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 14,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: data.map((item, index) => ({
            ...item,
            itemStyle: {
              color: colors[index % colors.length]
            }
          }))
        }
      ]
    };

    // 渲染图表
    chartInstance.current.setOption(option)

    // 响应窗口大小变化
    const handleResize = () => {
      chartInstance.current?.resize()
    }
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      chartInstance.current?.dispose()
    }
  }, [])

  return <div ref={chartRef} style={{ width: "100%", height: "100%" }} />
} 