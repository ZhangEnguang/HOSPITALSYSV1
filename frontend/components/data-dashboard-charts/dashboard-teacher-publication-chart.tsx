"use client"

import { useEffect, useRef } from "react"
import * as echarts from "echarts/core"
import { BarChart } from "echarts/charts"
import { TitleComponent, TooltipComponent, GridComponent, LegendComponent } from "echarts/components"
import { CanvasRenderer } from "echarts/renderers"

// 注册必要的组件
echarts.use([TitleComponent, TooltipComponent, GridComponent, LegendComponent, BarChart, CanvasRenderer])

// 近五年项目申报与立项数据
const projectData = [
  { year: "2020", 申报数量: 145, 立项数量: 98 },
  { year: "2021", 申报数量: 168, 立项数量: 112 },
  { year: "2022", 申报数量: 192, 立项数量: 128 },
  { year: "2023", 申报数量: 218, 立项数量: 156 },
  { year: "2024", 申报数量: 235, 立项数量: 168 }
];

// 数据看板专用颜色方案
const dashboardColors = ["#246EFF", "#00B2FF"];

export default function DashboardProjectApplicationChart() {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<echarts.ECharts | null>(null)

  useEffect(() => {
    if (!chartRef.current) return

    if (chartInstance.current) {
      chartInstance.current.dispose()
    }

    chartInstance.current = echarts.init(chartRef.current)

    const years = projectData.map(item => item.year);

    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: function(params: any) {
          let result = params[0].name + '年<br/>';
          params.forEach((item: any) => {
            result += `${item.marker} ${item.seriesName}: ${item.value} 项<br/>`;
          });
          return result;
        },
        backgroundColor: 'rgba(50, 50, 50, 0.9)',
        borderColor: 'rgba(50, 50, 50, 0.9)',
        textStyle: {
          color: '#fff'
        },
        padding: [8, 12]
      },
      legend: {
        data: ['申报数量', '立项数量'],
        bottom: '5%',
        itemWidth: 15,
        itemHeight: 8,
        itemGap: 20,
        selectedMode: true,
        orient: 'horizontal'
      },
      grid: {
        left: '8%',
        right: '5%',
        bottom: '18%',
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
        name: '项目数量（项）',
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
          name: '申报数量',
          type: 'bar',
          barMaxWidth: 30,
          barGap: '20%',
          emphasis: {
            focus: 'series'
          },
          itemStyle: {
            color: dashboardColors[0],
            borderRadius: [4, 4, 0, 0]
          },
          data: projectData.map(item => item.申报数量)
        },
        {
          name: '立项数量',
          type: 'bar',
          barMaxWidth: 30,
          emphasis: {
            focus: 'series'
          },
          itemStyle: {
            color: dashboardColors[1],
            borderRadius: [4, 4, 0, 0]
          },
          data: projectData.map(item => item.立项数量)
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