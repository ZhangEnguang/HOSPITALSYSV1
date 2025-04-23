"use client"

import { useEffect, useRef } from "react"
import * as echarts from "echarts/core"
import { GaugeChart } from "echarts/charts"
import { TitleComponent, TooltipComponent, LegendComponent } from "echarts/components"
import { CanvasRenderer } from "echarts/renderers"

// 注册必要的组件
echarts.use([TitleComponent, TooltipComponent, LegendComponent, GaugeChart, CanvasRenderer])

export default function ProjectHealthChart() {
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

    // 图表数据
    const data = [
      {
        value: 78,
        name: '整体健康度',
        title: {
          offsetCenter: ['0%', '-20%']
        },
        detail: {
          valueAnimation: true,
          offsetCenter: ['0%', '5%']
        }
      }
    ]

    // 设置图表选项
    const option = {
      series: [
        {
          type: 'gauge',
          startAngle: 90,
          endAngle: -270,
          center: ['50%', '45%'],
          radius: '65%',
          pointer: {
            show: false
          },
          progress: {
            show: true,
            overlap: false,
            roundCap: true,
            clip: false,
            itemStyle: {
              borderWidth: 1,
              color: '#8AD7FC'
            }
          },
          axisLine: {
            lineStyle: {
              width: 12
            }
          },
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: false
          },
          data: data,
          title: {
            fontSize: 14
          },
          detail: {
            width: 50,
            height: 14,
            fontSize: 28,
            color: '#000000',
            borderColor: 'auto',
            formatter: '{value}%'
          }
        }
      ]
    }

    // 渲染图表
    chartInstance.current.setOption(option)

    // 附加细节信息
    const detailsElement = document.createElement('div')
    detailsElement.className = 'absolute bottom-4 left-0 right-0 px-4'
    detailsElement.innerHTML = `
      <div class="grid grid-cols-3 gap-4 text-center">
        <div>
          <div class="text-lg font-medium text-black">92%</div>
          <div class="text-xs text-gray-500">预算执行</div>
        </div>
        <div>
          <div class="text-lg font-medium text-black">87%</div>
          <div class="text-xs text-gray-500">进度完成</div>
        </div>
        <div>
          <div class="text-lg font-medium text-black">65%</div>
          <div class="text-xs text-gray-500">风险控制</div>
        </div>
      </div>
    `
    if (chartRef.current.parentElement) {
      chartRef.current.parentElement.style.position = 'relative'
      chartRef.current.parentElement.appendChild(detailsElement)
    }

    // 响应窗口大小变化
    const handleResize = () => {
      chartInstance.current?.resize()
    }
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      chartInstance.current?.dispose()
      if (chartRef.current?.parentElement && detailsElement.parentElement) {
        detailsElement.parentElement.removeChild(detailsElement)
      }
    }
  }, [])

  return <div ref={chartRef} style={{ width: "100%", height: "100%" }} />
} 