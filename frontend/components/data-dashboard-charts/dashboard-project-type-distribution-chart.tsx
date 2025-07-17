"use client"

import { useEffect, useRef } from "react"
import * as echarts from "echarts/core"
import { PieChart } from "echarts/charts"
import { TitleComponent, TooltipComponent, LegendComponent } from "echarts/components"
import { CanvasRenderer } from "echarts/renderers"

// 注册必要的组件
echarts.use([TitleComponent, TooltipComponent, LegendComponent, PieChart, CanvasRenderer])

// 数据看板专用颜色方案
const levelColors = ["#246EFF", "#00B2FF", "#81E2FF", "#B3EEFF"]
const fundingColors = ["#73D13D", "#92F1B4"]

export default function DashboardProjectTypeDistributionChart() {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<echarts.ECharts | null>(null)

  useEffect(() => {
    if (!chartRef.current) return

    if (chartInstance.current) {
      chartInstance.current.dispose()
    }

    chartInstance.current = echarts.init(chartRef.current)

    // 数据看板专用数据
    const levelData = [
      { name: "国家级", value: 25, percentage: 35.7 },
      { name: "省部级", value: 32, percentage: 45.7 },
      { name: "市级", value: 8, percentage: 11.4 },
      { name: "院级", value: 5, percentage: 7.2 }
    ]

    const fundingData = [
      { name: "项目数量", value: 25, percentage: 35.7 },
      { name: "经费到账", value: 45, percentage: 64.3 }
    ]

    const option = {
      tooltip: {
        trigger: "item",
        formatter: function(params: any) {
          return `<div style="font-weight: bold; margin-bottom: 8px;">${params.name}</div>
                  <div style="display: flex; align-items: center; margin: 4px 0;">
                    <span style="display: inline-block; width: 10px; height: 10px; background: ${params.color}; margin-right: 8px; border-radius: 2px;"></span>
                    <span style="flex: 1;">${params.seriesName === "纵向项目级别统计" ? "项目数量" : "数量"}:</span>
                    <span style="font-weight: bold;">${params.value} ${params.seriesName === "纵向项目级别统计" ? "项" : "个"}</span>
                  </div>
                  <div style="display: flex; align-items: center; margin: 4px 0;">
                    <span style="display: inline-block; width: 10px; height: 10px; background: transparent; margin-right: 8px;"></span>
                    <span style="flex: 1;">占比:</span>
                    <span style="font-weight: bold;">${params.percent}%</span>
                  </div>`
        },
        confine: true,
        backgroundColor: "rgba(0, 0, 0, 0.75)",
        borderWidth: 0,
        textStyle: {
          color: "#fff",
        },
        extraCssText: "box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15); border-radius: 8px;",
      },
      legend: [
        {
          orient: "vertical",
          left: "5%",
          top: "center",
          itemWidth: 10,
          itemHeight: 6,
          itemGap: 8,
          textStyle: {
            fontSize: 10,
            color: "#666"
          },
          formatter: function(name: string) {
            const item = levelData.find(d => d.name === name)
            return `${name}  ${item?.value}项`
          }
        },
        {
          orient: "vertical",
          right: "5%",
          top: "center",
          itemWidth: 10,
          itemHeight: 6,
          itemGap: 8,
          textStyle: {
            fontSize: 10,
            color: "#666"
          },
          formatter: function(name: string) {
            const item = fundingData.find(d => d.name === name)
            return `${name}  ${item?.value}${name === "项目数量" ? "项" : "万元"}`
          }
        }
      ],
      series: [
        {
          name: "纵向项目级别统计",
          type: "pie",
          radius: ["40%", "70%"],
          center: ["25%", "50%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 8,
            borderColor: "#fff",
            borderWidth: 2
          },
          label: {
            show: false,
            position: "center"
          },
          emphasis: {
            label: {
              show: true,
              fontSize: "12",
              fontWeight: "bold",
              formatter: function(params: any) {
                return `${params.name}\n${params.value}项\n${params.percent}%`
              }
            },
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)"
            }
          },
          labelLine: {
            show: false
          },
          data: levelData.map((item, index) => ({
            ...item,
            itemStyle: {
              color: levelColors[index % levelColors.length]
            }
          })),
          animationType: "scale",
          animationEasing: "elasticOut" as const,
          animationDelay: function(idx: number) {
            return Math.random() * 200
          }
        },
        {
          name: "纵向项目经费统计",
          type: "pie",
          radius: ["40%", "70%"],
          center: ["75%", "50%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 8,
            borderColor: "#fff",
            borderWidth: 2
          },
          label: {
            show: false,
            position: "center"
          },
          emphasis: {
            label: {
              show: true,
              fontSize: "12",
              fontWeight: "bold",
              formatter: function(params: any) {
                return `${params.name}\n${params.value}${params.name === "项目数量" ? "项" : "万元"}\n${params.percent}%`
              }
            },
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)"
            }
          },
          labelLine: {
            show: false
          },
          data: fundingData.map((item, index) => ({
            ...item,
            itemStyle: {
              color: fundingColors[index % fundingColors.length]
            }
          })),
          animationType: "scale",
          animationEasing: "elasticOut" as const,
          animationDelay: function(idx: number) {
            return Math.random() * 200 + 200
          }
        }
      ],
      animation: true,
      animationDuration: 1000,
      animationEasing: "cubicOut" as const
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