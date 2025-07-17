"use client"

import { useEffect, useRef } from "react"
import * as echarts from "echarts/core"
import { BarChart } from "echarts/charts"
import { TitleComponent, TooltipComponent, GridComponent, DataZoomComponent } from "echarts/components"
import { CanvasRenderer } from "echarts/renderers"

// 注册必要的组件
echarts.use([TitleComponent, TooltipComponent, GridComponent, DataZoomComponent, BarChart, CanvasRenderer])

interface TooltipParams {
  dataIndex: number;
  seriesName?: string;
  value?: number | string;
  name?: string;
}

export default function DashboardResourceUtilizationChart() {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<echarts.ECharts | null>(null)

  useEffect(() => {
    if (!chartRef.current) return

    if (chartInstance.current) {
      chartInstance.current.dispose()
    }

    chartInstance.current = echarts.init(chartRef.current)

    // 数据看板专用数据
    const dashboardData = {
      categories: ['计算资源', '存储资源', '网络带宽', '实验设备', '测试环境', '人力资源'],
      utilization: [92, 78, 65, 83, 71, 88],
      capacity: [100, 100, 100, 100, 100, 100],
      allocated: [95, 85, 75, 90, 80, 92]
    }

    // 数据看板专用颜色方案
    const dashboardSeriesData = [
      {
        name: '分配率',
        data: dashboardData.allocated,
        color: '#4cc9f0'
      },
      {
        name: '利用率',
        data: dashboardData.utilization,
        color: '#7209b7'
      },
      {
        name: '可用容量',
        data: dashboardData.capacity,
        color: '#e9ecef'
      }
    ]

    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: function (params: TooltipParams[]) {
          const dataIndex = params[0].dataIndex
          const categoryName = dashboardData.categories[dataIndex]
          let result = `${categoryName}<br/>`
          
          params.forEach((param: TooltipParams) => {
            if (param.seriesName === '可用容量') {
              result += `${param.seriesName}: ${param.value}%<br/>`
            } else {
              result += `${param.seriesName}: ${param.value}%<br/>`
            }
          })
          
          return result
        },
        backgroundColor: 'rgba(50, 50, 50, 0.9)',
        borderColor: 'rgba(50, 50, 50, 0.9)',
        textStyle: {
          color: '#fff'
        },
        padding: [8, 12]
      },
      legend: {
        data: dashboardSeriesData.map(series => series.name),
        bottom: 'bottom',
        itemWidth: 15,
        itemHeight: 8,
        itemGap: 20
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '15%',
        top: '8%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: dashboardData.categories,
        axisLine: {
          lineStyle: {
            color: '#E0E0E0'
          }
        },
        axisLabel: {
          interval: 0,
          rotate: 0,
          textStyle: {
            fontSize: 11
          }
        }
      },
      yAxis: {
        type: 'value',
        name: '使用率（%）',
        nameTextStyle: {
          padding: [0, 0, 0, 40]
        },
        max: 100,
        splitLine: {
          lineStyle: {
            type: 'dashed',
            color: '#E0E0E0'
          }
        },
        axisLabel: {
          formatter: '{value}%'
        }
      },
      series: dashboardSeriesData.map(seriesConfig => ({
        name: seriesConfig.name,
        type: 'bar',
        data: seriesConfig.data,
        itemStyle: {
          color: seriesConfig.color,
          borderRadius: [2, 2, 0, 0]
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.2)'
          }
        },
        barMaxWidth: 25
      }))
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