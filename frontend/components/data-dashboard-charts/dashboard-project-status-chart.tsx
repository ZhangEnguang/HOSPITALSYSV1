"use client"

import { useEffect, useRef } from "react"
import * as echarts from "echarts/core"
import { PieChart } from "echarts/charts"
import { TitleComponent, TooltipComponent, LegendComponent } from "echarts/components"
import { CanvasRenderer } from "echarts/renderers"

// 注册必要的组件
echarts.use([TitleComponent, TooltipComponent, LegendComponent, PieChart, CanvasRenderer])

// 数据看板专用颜色方案
const dashboardColors = ["#7275F2", "#8AD7FC", "#F97F7F", "#92F1B4"]

export default function DashboardProjectStatusChart() {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<echarts.ECharts | null>(null)

  useEffect(() => {
    if (!chartRef.current) return

    if (chartInstance.current) {
      chartInstance.current.dispose()
    }

    chartInstance.current = echarts.init(chartRef.current)

    // 数据看板专用数据 - 成果转化目标总完成统计
    const dashboardData = [
      { value: 44, name: '已达标' },
      { value: 30, name: '未达标' },
      { value: 19, name: '超标' }
    ]

    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} 个科室 ({d}%)',
        backgroundColor: 'rgba(50, 50, 50, 0.9)',
        borderColor: 'rgba(50, 50, 50, 0.9)',
        textStyle: {
          color: '#fff'
        }
      },
      legend: {
        orient: 'vertical',
        left: '5%',
        top: 'middle',
        data: dashboardData.map(item => item.name),
        textStyle: {
          fontSize: 11,
          color: '#666'
        },
        itemWidth: 12,
        itemHeight: 12,
        itemGap: 8
      },
      series: [
        {
          name: '成果转化目标总完成统计',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['62%', '50%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '18',
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: dashboardData.map((item, index) => ({
            ...item,
            itemStyle: {
              color: dashboardColors[index % dashboardColors.length]
            }
          }))
        }
      ]
    }

    chartInstance.current.setOption(option)

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