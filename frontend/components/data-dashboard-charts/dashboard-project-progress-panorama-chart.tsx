"use client"

import { useEffect, useRef } from "react"
import * as echarts from "echarts/core"
import { BarChart } from "echarts/charts"
import { TitleComponent, TooltipComponent, GridComponent, LegendComponent } from "echarts/components"
import { CanvasRenderer } from "echarts/renderers"

// 注册必要的组件
echarts.use([TitleComponent, TooltipComponent, GridComponent, LegendComponent, BarChart, CanvasRenderer])

// 数据看板专用颜色方案
const dashboardColors = ["#246EFF", "#00B2FF", "#FF4D4F"]

export default function DashboardProjectProgressPanoramaChart() {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<echarts.ECharts | null>(null)

  useEffect(() => {
    if (!chartRef.current) return

    if (chartInstance.current) {
      chartInstance.current.dispose()
    }

    chartInstance.current = echarts.init(chartRef.current)

    // 数据看板专用数据 - 近五年项目进度统计
    const dashboardData = [
      { year: "2020", 进行中: 42, 已完成: 35, 已逾期: 6 },
      { year: "2021", 进行中: 48, 已完成: 40, 已逾期: 7 },
      { year: "2022", 进行中: 45, 已完成: 38, 已逾期: 7 },
      { year: "2023", 进行中: 52, 已完成: 45, 已逾期: 8 },
      { year: "2024", 进行中: 48, 已完成: 42, 已逾期: 6 }
    ]

    const years = dashboardData.map(item => item.year)
    const ongoingData = dashboardData.map(item => item.进行中)
    const completedData = dashboardData.map(item => item.已完成)
    const delayedData = dashboardData.map(item => item.已逾期)

    const option = {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow"
        },
        confine: true,
        backgroundColor: "rgba(0, 0, 0, 0.75)",
        borderWidth: 0,
        textStyle: {
          color: "#fff",
        },
        extraCssText: "box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15); border-radius: 8px;",
        formatter: function(params: any) {
          let result = `<div style="font-weight: bold; margin-bottom: 8px;">${params[0].axisValue}</div>`
          params.forEach((param: any) => {
            const color = param.color
            const value = param.value
            const name = param.seriesName
            result += `<div style="display: flex; align-items: center; margin: 4px 0;">
              <span style="display: inline-block; width: 10px; height: 10px; background: ${color}; margin-right: 8px; border-radius: 2px;"></span>
              <span style="flex: 1;">${name}:</span>
              <span style="font-weight: bold;">${value}</span>
            </div>`
          })
          return result
        }
      },
      legend: {
        data: ["进行中", "已完成", "已逾期"],
        bottom: "2%",
        itemWidth: 10,
        itemHeight: 6,
        itemGap: 10,
        textStyle: {
          fontSize: 10,
          color: "#666"
        }
      },
      grid: {
        left: "3%",
        right: "3%",
        bottom: "8%",
        top: "8%",
        containLabel: true
      },
      xAxis: [
        {
          type: "category",
          data: years,
          axisPointer: {
            type: "shadow"
          },
          axisLabel: {
            fontSize: 10,
            color: "#666"
          }
        }
      ],
      yAxis: [
        {
          type: "value",
          name: "项目数量",
          min: 0,
          interval: 10,
          axisLabel: {
            formatter: "{value} 项",
            fontSize: 10,
            color: "#666"
          },
          splitLine: {
            lineStyle: {
              color: "#f0f0f0"
            }
          }
        }
      ],
      series: [
        {
          name: "进行中",
          type: "bar",
          data: ongoingData,
          barMaxWidth: 40,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: dashboardColors[0] },
              { offset: 1, color: dashboardColors[0] + "80" }
            ]),
            borderRadius: [4, 4, 0, 0]
          },
          emphasis: {
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: dashboardColors[0] },
                { offset: 1, color: dashboardColors[0] + "60" }
              ])
            }
          }
        },
        {
          name: "已完成",
          type: "bar",
          data: completedData,
          barMaxWidth: 40,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: dashboardColors[1] },
              { offset: 1, color: dashboardColors[1] + "80" }
            ]),
            borderRadius: [4, 4, 0, 0]
          },
          emphasis: {
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: dashboardColors[1] },
                { offset: 1, color: dashboardColors[1] + "60" }
              ])
            }
          }
        },
        {
          name: "已逾期",
          type: "bar",
          data: delayedData,
          barMaxWidth: 40,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: dashboardColors[2] },
              { offset: 1, color: dashboardColors[2] + "80" }
            ]),
            borderRadius: [4, 4, 0, 0]
          },
          emphasis: {
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: dashboardColors[2] },
                { offset: 1, color: dashboardColors[2] + "60" }
              ])
            }
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