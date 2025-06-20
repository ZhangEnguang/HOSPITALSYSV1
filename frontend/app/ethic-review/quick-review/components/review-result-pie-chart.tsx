"use client"

import { useEffect, useRef } from "react"
import * as echarts from "echarts/core"
import { PieChart as EChartsPie } from "echarts/charts"
import { TitleComponent, TooltipComponent, LegendComponent } from "echarts/components"
import { CanvasRenderer } from "echarts/renderers"

// 注册必要的组件
echarts.use([TitleComponent, TooltipComponent, LegendComponent, EChartsPie, CanvasRenderer])

interface ReviewResultData {
  name: string;
  value: number;
  color: string;
}

interface ReviewResultPieChartProps {
  data: ReviewResultData[];
  height?: number;
}

export default function ReviewResultPieChart({ data, height = 300 }: ReviewResultPieChartProps) {
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

    const option = {
      tooltip: {
        trigger: "item",
        formatter: "{b}: {c}位 ({d}%)",
        backgroundColor: "rgba(50, 50, 50, 0.9)",
        borderColor: "rgba(255, 255, 255, 0.2)",
        borderWidth: 1,
        textStyle: {
          color: "#fff",
          fontSize: 12
        }
      },
      legend: {
        bottom: '5%',
        left: 'center',
        orient: 'horizontal',
        itemWidth: 12,
        itemHeight: 12,
        itemGap: 16,
        textStyle: {
          fontSize: 12,
          color: '#666'
        },
        formatter: (name: string) => {
          const item = data.find(d => d.name === name);
          return `${name} (${item?.value || 0}位)`;
        }
      },
      series: [
        {
          name: "评审结果",
          type: "pie",
          radius: ["35%", "60%"],
          center: ['50%', '45%'],
          avoidLabelOverlap: true,
          itemStyle: {
            borderRadius: 6,
            borderColor: "#fff",
            borderWidth: 2,
          },
          label: {
            show: true,
            position: 'outside',
            fontSize: 11,
            fontWeight: 'bold',
            formatter: '{d}%',
            color: '#333'
          },
          labelLine: {
            show: true,
            length: 12,
            length2: 8,
            smooth: true
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.3)'
            },
            label: {
              show: true,
              fontSize: 14,
              fontWeight: "bold",
            }
          },
          data: data.map((item) => ({
            name: item.name,
            value: item.value,
            itemStyle: {
              color: item.color
            }
          }))
        }
      ],
      animation: true,
      animationThreshold: 2000,
      animationDuration: 1000,
      animationEasing: "cubicOut" as const,
      animationDelay: (idx: number) => idx * 100,
      animationDurationUpdate: 1000,
      animationEasingUpdate: "cubicOut" as const,
      animationDelayUpdate: (idx: number) => idx * 100,
    }

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
  }, [data, height])

  return <div ref={chartRef} style={{ width: "100%", height: `${height}px` }} />
} 