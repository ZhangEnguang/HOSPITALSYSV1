"use client"

import { useEffect, useRef } from "react"
import * as echarts from "echarts/core"
import { BarChart as EChartsBar } from "echarts/charts"
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from "echarts/components"
import { CanvasRenderer } from "echarts/renderers"

// 注册必要的组件
echarts.use([TitleComponent, TooltipComponent, LegendComponent, GridComponent, EChartsBar, CanvasRenderer])

interface BarChartProps {
  data:
    | Array<{
        [key: string]: string | number
      }>
    | undefined // 添加 undefined 类型
}

export default function BarChart({ data }: BarChartProps) {
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

    // 检查数据是否存在
    if (!data || data.length === 0) {
      // 如果没有数据，显示一个空的图表或加载状态
      chartInstance.current.setOption({
        title: {
          text: "暂无数据",
          left: "center",
          top: "center",
          textStyle: {
            color: "#999",
            fontSize: 14,
            fontWeight: "normal",
          },
        },
      })
      return
    }

    // 获取类别名称字段（通常是第一个字段）
    const categoryField = Object.keys(data[0])[0];
    
    // 获取数值字段（剩余的字段）
    const valueFields = Object.keys(data[0]).filter(key => key !== categoryField);
    
    // 准备数据
    const categories = data.map((item) => item[categoryField]);

    // 设置图表选项
    const option = {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
        formatter: (params) => {
          let result = `${params[0].axisValue}<br/>`
          params.forEach((param) => {
            result += `${param.marker} ${param.seriesName}: ${param.value}<br/>`
          })
          return result
        },
        confine: true,
        backgroundColor: "rgba(0, 0, 0, 0.75)",
        borderWidth: 0,
        textStyle: {
          color: "#fff",
        },
        extraCssText: "box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15); border-radius: 8px;",
      },
      legend: {
        data: valueFields,
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: categories,
      },
      yAxis: {
        type: "value",
        name: "数量",
      },
      series: valueFields.map((field, index) => ({
        name: field,
        type: "bar",
        emphasis: {
          focus: "series",
        },
        data: data.map((item) => item[field]),
        itemStyle: {
          color: [
            "#4ade80", "#facc15", "#f87171", "#60a5fa", 
            "#a78bfa", "#f472b6", "#34d399", "#fbbf24"
          ][index % 8],
        },
      })),
      animation: true,
      animationThreshold: 2000,
      animationDuration: 1000,
      animationEasing: "cubicOut",
      animationDelay: function(idx) { return idx * 100; },
      animationDurationUpdate: 1000,
      animationEasingUpdate: "cubicOut",
      animationDelayUpdate: function(idx) { return idx * 100; },
    }

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
  }, [data])

  return <div ref={chartRef} style={{ width: "100%", height: "100%" }} />
}

