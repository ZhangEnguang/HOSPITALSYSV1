"use client"

import { useEffect, useRef } from "react"
import * as echarts from "echarts/core"
import { PieChart } from "echarts/charts"
import { TitleComponent, TooltipComponent, LegendComponent, GraphicComponent } from "echarts/components"
import { CanvasRenderer } from "echarts/renderers"

// 注册必要的组件
echarts.use([TitleComponent, TooltipComponent, LegendComponent, GraphicComponent, PieChart, CanvasRenderer])

// 指定颜色，与project-status-chart保持一致的配色方案
const colors = ["#F97F7F", "#8AD7FC", "#7275F2", "#92F1B4"]

export default function TeamDistributionChart() {
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

    // 图表数据 - 按角色分布
    const roleData = [
      { value: 28, name: '研究人员' },
      { value: 15, name: '技术开发' },
      { value: 12, name: '项目管理' },
      { value: 8, name: '数据分析' },
      { value: 6, name: '行政支持' }
    ]

    // 图表数据 - 按地域分布
    const locationData = [
      { value: 35, name: '北京' },
      { value: 25, name: '上海' },
      { value: 18, name: '广州' },
      { value: 15, name: '深圳' },
      { value: 7, name: '其他' }
    ]

    // 设置切换状态
    let currentData = {
      type: 'role',
      data: roleData
    }

    // 设置图表选项
    const updateOption = () => {
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'horizontal',
          bottom: 0,
          data: currentData.data.map(item => item.name)
        },
        series: [
          {
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
              show: false,
              position: 'center'
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
            data: currentData.data.map((item, index) => ({
              ...item,
              itemStyle: {
                color: colors[index % colors.length]
              }
            }))
          }
        ],
        graphic: [
          {
            type: 'group',
            right: 0,
            top: 0,
            children: [
              {
                type: 'rect',
                z: 100,
                left: 'center',
                top: 'middle',
                shape: {
                  width: 60,
                  height: 30
                },
                style: {
                  fill: '#f5f5f5',
                  stroke: '#ccc',
                  lineWidth: 1,
                  borderRadius: 4,
                  shadowBlur: 5,
                  shadowOffsetX: 3,
                  shadowOffsetY: 3,
                  shadowColor: 'rgba(0,0,0,0.2)'
                },
                onclick: function() {
                  currentData.type = currentData.type === 'role' ? 'location' : 'role'
                  currentData.data = currentData.type === 'role' ? roleData : locationData
                  updateOption()
                }
              },
              {
                type: 'text',
                z: 100,
                left: 'center',
                top: 'middle',
                style: {
                  fill: '#333',
                  text: '切换视图',
                  font: '12px Microsoft YaHei'
                },
                onclick: function() {
                  currentData.type = currentData.type === 'role' ? 'location' : 'role'
                  currentData.data = currentData.type === 'role' ? roleData : locationData
                  updateOption()
                }
              }
            ]
          },
          {
            type: 'text',
            left: 'center',
            top: 'center',
            style: {
              text: currentData.type === 'role' ? '按角色' : '按地域',
              textAlign: 'center',
              fill: '#999',
              fontSize: 16
            }
          }
        ]
      }

      // 渲染图表
      chartInstance.current?.setOption(option, true)
    }

    // 首次渲染
    updateOption()

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