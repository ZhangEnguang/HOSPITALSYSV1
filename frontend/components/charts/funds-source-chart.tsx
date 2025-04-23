"use client"

import { useEffect, useRef } from "react"
import * as echarts from "echarts/core"
import { BarChart } from "echarts/charts"
import { TitleComponent, TooltipComponent, GridComponent, LegendComponent } from "echarts/components"
import { CanvasRenderer } from "echarts/renderers"

// 注册必要的组件
echarts.use([TitleComponent, TooltipComponent, GridComponent, LegendComponent, BarChart, CanvasRenderer])

// 模拟数据 - 经费来源分析
const data = [
  { name: "国家级科研基金", value: 2680 },
  { name: "省部级科研项目", value: 1850 },
  { name: "企业合作项目", value: 1520 },
  { name: "校级科研基金", value: 980 },
  { name: "国际合作项目", value: 760 },
  { name: "科技成果转化", value: 550 }
];

export default function FundsSourceChart() {
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
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: '{b}: {c}万元'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value}万元'
        }
      },
      yAxis: {
        type: 'category',
        data: data.map(item => item.name),
        axisTick: {
          alignWithLabel: true
        }
      },
      series: [
        {
          name: '经费来源',
          type: 'bar',
          barWidth: '60%',
          data: data.map(item => ({
            value: item.value,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: '#3468FF' },
                { offset: 1, color: '#17D1FF' }
              ])
            },
            emphasis: {
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                  { offset: 0, color: '#3468FF' },
                  { offset: 1, color: '#00E1FF' }
                ])
              }
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