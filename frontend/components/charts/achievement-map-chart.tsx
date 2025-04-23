"use client"

import { useEffect, useRef } from "react"
import * as echarts from "echarts/core"
import { PieChart } from "echarts/charts"
import { TitleComponent, TooltipComponent, LegendComponent } from "echarts/components"
import { CanvasRenderer } from "echarts/renderers"

// 注册必要的组件
echarts.use([TitleComponent, TooltipComponent, LegendComponent, PieChart, CanvasRenderer])

// 模拟数据 - 成果地域分布
const data = [
  { name: "华东地区", value: 530 },
  { name: "华北地区", value: 276 },
  { name: "华南地区", value: 247 },
  { name: "华中地区", value: 252 },
  { name: "西南地区", value: 230 },
  { name: "东北地区", value: 150 },
  { name: "西北地区", value: 149 }
];

// 指定颜色
const colors = ["#8AD7FC", "#F97F7F", "#7275F2", "#92F1B4", "#FFB36D", "#A7AEFF", "#FFA5A5"]

export default function AchievementMapChart() {
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
        formatter: '{b}: {c} ({d}%)'
      },
      legend: {
        bottom: 'bottom',
        itemWidth: 10,
        itemHeight: 10,
        textStyle: {
          fontSize: 12
        },
        selectedMode: false
      },
      series: [
        {
          name: '成果地域分布',
          type: 'pie',
          radius: '70%',
          center: ['50%', '45%'],
          label: {
            show: true,
            formatter: '{b}\n{c} ({d}%)',
            fontSize: 12,
            lineHeight: 14
          },
          labelLine: {
            length: 15,
            length2: 10,
            smooth: true
          },
          itemStyle: {
            borderWidth: 2,
            borderColor: '#fff'
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