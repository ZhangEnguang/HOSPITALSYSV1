"use client"

import { useEffect, useRef } from "react"
import * as echarts from "echarts/core"
import { PieChart } from "echarts/charts"
import { TitleComponent, TooltipComponent, LegendComponent, GraphicComponent } from "echarts/components"
import { CanvasRenderer } from "echarts/renderers"

// 注册必要的组件
echarts.use([TitleComponent, TooltipComponent, LegendComponent, GraphicComponent, PieChart, CanvasRenderer])

// 数据看板专用颜色方案
const dashboardColors = ["#F97F7F", "#8AD7FC", "#7275F2", "#92F1B4", "#FFB17A"]

export default function DashboardTeamDistributionChart() {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<echarts.ECharts | null>(null)

  useEffect(() => {
    if (!chartRef.current) return

    if (chartInstance.current) {
      chartInstance.current.dispose()
    }

    chartInstance.current = echarts.init(chartRef.current)

    // 成果转化经费统计数据 - 按科室分布
    const fundingData = [
      { value: 285, name: '内科' },
      { value: 215, name: '外科' },
      { value: 168, name: '妇产科' },
      { value: 142, name: '儿科' },
      { value: 95, name: '急诊科' }
    ]

    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} 万元 ({d}%)',
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
        data: fundingData.map(item => item.name),
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
          name: '成果转化经费统计',
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
          data: fundingData.map((item, index) => ({
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