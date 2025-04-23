"use client"

import { useEffect, useRef } from "react"
import * as echarts from "echarts/core"
import { BarChart } from "echarts/charts"
import { TitleComponent, TooltipComponent, GridComponent, LegendComponent } from "echarts/components"
import { CanvasRenderer } from "echarts/renderers"

// 注册必要的组件
echarts.use([TitleComponent, TooltipComponent, GridComponent, LegendComponent, BarChart, CanvasRenderer])

// 模拟数据 - 成果影响力分析
const data = [
  { category: "SCI论文", 引用次数: 320, 发表数量: 180 },
  { category: "EI论文", 引用次数: 240, 发表数量: 150 },
  { category: "核心期刊", 引用次数: 165, 发表数量: 120 },
  { category: "一般期刊", 引用次数: 86, 发表数量: 95 },
  { category: "会议论文", 引用次数: 72, 发表数量: 110 },
];

export default function AchievementImpactChart() {
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
        }
      },
      legend: {
        data: ['引用次数', '发表数量'],
        bottom: 'bottom',
        itemWidth: 10,
        itemHeight: 10,
        textStyle: {
          fontSize: 12
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '15%',
        top: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: data.map(item => item.category),
        axisLabel: {
          interval: 0,
          rotate: 0
        }
      },
      yAxis: [
        {
          type: 'value',
          name: '引用次数',
          position: 'left',
          axisLine: {
            show: true,
            lineStyle: {
              color: '#5470C6'
            }
          },
          axisLabel: {
            formatter: '{value}'
          }
        },
        {
          type: 'value',
          name: '发表数量',
          position: 'right',
          axisLine: {
            show: true,
            lineStyle: {
              color: '#91CC75'
            }
          },
          axisLabel: {
            formatter: '{value}'
          }
        }
      ],
      series: [
        {
          name: '引用次数',
          type: 'bar',
          yAxisIndex: 0,
          data: data.map(item => item.引用次数),
          itemStyle: {
            color: new echarts.graphic.LinearGradient(
              0, 0, 0, 1,
              [
                {offset: 0, color: '#5470C6'},
                {offset: 1, color: '#91CC75'}
              ]
            )
          },
          emphasis: {
            itemStyle: {
              color: new echarts.graphic.LinearGradient(
                0, 0, 0, 1,
                [
                  {offset: 0, color: '#3A66CC'},
                  {offset: 1, color: '#73BB5C'}
                ]
              )
            }
          },
          barWidth: 20,
          barCategoryGap: '40%'
        },
        {
          name: '发表数量',
          type: 'bar',
          yAxisIndex: 1,
          data: data.map(item => item.发表数量),
          itemStyle: {
            color: new echarts.graphic.LinearGradient(
              0, 0, 0, 1,
              [
                {offset: 0, color: '#FFA500'},
                {offset: 1, color: '#FF4500'}
              ]
            )
          },
          emphasis: {
            itemStyle: {
              color: new echarts.graphic.LinearGradient(
                0, 0, 0, 1,
                [
                  {offset: 0, color: '#FF9000'},
                  {offset: 1, color: '#E03D00'}
                ]
              )
            }
          },
          barWidth: 20,
          barCategoryGap: '40%'
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