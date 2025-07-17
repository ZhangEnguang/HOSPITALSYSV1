"use client"

import { useEffect, useRef } from "react"
import * as echarts from "echarts/core"
import { BarChart } from "echarts/charts"
import { TitleComponent, TooltipComponent, GridComponent, LegendComponent } from "echarts/components"
import { CanvasRenderer } from "echarts/renderers"

// 注册必要的组件
echarts.use([TitleComponent, TooltipComponent, GridComponent, LegendComponent, BarChart, CanvasRenderer])

// 科研成果产出数据
const researchData = [
  { year: "2020", 产出数量: 125 },
  { year: "2021", 产出数量: 158 },
  { year: "2022", 产出数量: 172 },
  { year: "2023", 产出数量: 198 },
  { year: "2024", 产出数量: 215 }
];

// 数据看板专用颜色方案
const dashboardColors = ["#246EFF"];

export default function DashboardSingleBarChart() {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<echarts.ECharts | null>(null)

  useEffect(() => {
    if (!chartRef.current) return

    if (chartInstance.current) {
      chartInstance.current.dispose()
    }

    chartInstance.current = echarts.init(chartRef.current)

    const years = researchData.map(item => item.year);

    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: function(params: any) {
          let result = params[0].name + '年<br/>';
          result += `${params[0].marker} ${params[0].seriesName}: ${params[0].value} 项<br/>`;
          return result;
        },
        backgroundColor: 'rgba(50, 50, 50, 0.9)',
        borderColor: 'rgba(50, 50, 50, 0.9)',
        textStyle: {
          color: '#fff'
        },
        padding: [8, 12]
      },
      grid: {
        left: '8%',
        right: '5%',
        bottom: '12%',
        top: '10%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: years,
        axisLine: {
          lineStyle: {
            color: '#E0E0E0'
          }
        },
        axisLabel: {
          fontSize: 11,
          color: '#666'
        }
      },
      yAxis: {
        type: 'value',
        name: '成果数量（项）',
        nameTextStyle: {
          fontSize: 11,
          color: '#666',
          padding: [0, 0, 0, 35]
        },
        splitLine: {
          lineStyle: {
            type: 'dashed',
            color: '#E0E0E0'
          }
        },
        axisLabel: {
          fontSize: 11,
          color: '#666'
        }
      },
      series: [
        {
          name: '成果产出',
          type: 'bar',
          barMaxWidth: 40,
          emphasis: {
            focus: 'series'
          },
          itemStyle: {
            color: dashboardColors[0],
            borderRadius: [4, 4, 0, 0]
          },
          data: researchData.map(item => item.产出数量)
        }
      ]
    };

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