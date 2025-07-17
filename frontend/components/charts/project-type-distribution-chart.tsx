"use client"

import React, { useRef, useEffect } from "react"
import * as echarts from "echarts"

interface ProjectLevelData {
  name: string
  value: number
  percentage: number
}

interface ProjectFundingData {
  name: string
  value: number
  percentage: number
}

interface ProjectTypeDistributionChartProps {
  levelData?: ProjectLevelData[]
  fundingData?: ProjectFundingData[]
}

export default function ProjectTypeDistributionChart({ levelData, fundingData }: ProjectTypeDistributionChartProps) {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<echarts.ECharts | null>(null)

  // 纵向项目级别统计默认数据
  const defaultLevelData: ProjectLevelData[] = [
    { name: "国家级", value: 25, percentage: 35.7 },
    { name: "省部级", value: 32, percentage: 45.7 },
    { name: "市级", value: 8, percentage: 11.4 },
    { name: "院级", value: 5, percentage: 7.2 }
  ]

  // 纵向项目经费统计默认数据
  const defaultFundingData: ProjectFundingData[] = [
    { name: "项目数量", value: 25, percentage: 35.7 },
    { name: "经费到账", value: 45, percentage: 64.3 }
  ]

  const chartLevelData = levelData || defaultLevelData
  const chartFundingData = fundingData || defaultFundingData

  useEffect(() => {
    if (!chartRef.current) return

    // 如果已经有实例，先销毁
    if (chartInstance.current) {
      chartInstance.current.dispose()
    }

    // 创建新实例
    chartInstance.current = echarts.init(chartRef.current)

    // 颜色配置
    const levelColors = ["#246EFF", "#00B2FF", "#81E2FF", "#B3EEFF"]
    const fundingColors = ["#73D13D", "#92F1B4"]

    // 设置图表选项
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
            const item = chartLevelData.find(d => d.name === name)
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
            const item = chartFundingData.find(d => d.name === name)
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
          data: chartLevelData.map((item, index) => ({
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
          data: chartFundingData.map((item, index) => ({
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
  }, [chartLevelData, chartFundingData])

  return <div ref={chartRef} style={{ width: "100%", height: "100%" }} />
} 