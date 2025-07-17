"use client"

import { useEffect, useRef } from "react"
import * as echarts from "echarts/core"
import { LineChart } from "echarts/charts"
import { TitleComponent, TooltipComponent, GridComponent, LegendComponent } from "echarts/components"
import { CanvasRenderer } from "echarts/renderers"

// 注册必要的组件
echarts.use([TitleComponent, TooltipComponent, GridComponent, LegendComponent, LineChart, CanvasRenderer])

// 数据看板专用数据 - 近5年不同类型项目经费情况（单位：万元）
const dashboardData = [
  { year: "2019", 国家级: 1200, 省部级: 850, 横向项目: 450 },
  { year: "2020", 国家级: 1350, 省部级: 920, 横向项目: 580 },
  { year: "2021", 国家级: 1580, 省部级: 1080, 横向项目: 720 },
  { year: "2022", 国家级: 1820, 省部级: 1250, 横向项目: 880 },
  { year: "2023", 国家级: 2100, 省部级: 1450, 横向项目: 1050 }
];

// 数据看板专用颜色方案
const dashboardColors = ["#1890FF", "#00DDDD", "#73D13D"];

interface TooltipParamType {
  name: string;
  marker: string;
  seriesName: string;
  value: number;
  dataIndex: number;
  seriesIndex: number;
}

export default function DashboardProjectFundingChart() {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<echarts.ECharts | null>(null)

  useEffect(() => {
    if (!chartRef.current) return

    if (chartInstance.current) {
      chartInstance.current.dispose()
    }

    chartInstance.current = echarts.init(chartRef.current)

    const years = dashboardData.map(item => item.year);
    const nationalData = dashboardData.map(item => item.国家级);
    const provincialData = dashboardData.map(item => item.省部级);
    const horizontalData = dashboardData.map(item => item.横向项目);

    const option = {
      tooltip: {
        trigger: 'axis',
        formatter: function (params: TooltipParamType[]) {
          let result = params[0].name + '年<br/>';
          let total = 0;
          params.forEach((item: TooltipParamType, index: number) => {
            result += `${item.marker} ${item.seriesName}: ${item.value} 万元<br/>`;
            total += item.value as number;
          });
          result += `<br/>总计: ${total} 万元`;
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
        data: ['纵向项目', '横向项目', '院级项目'],
        bottom: '5%',
        itemWidth: 15,
        itemHeight: 8,
        itemGap: 20,
        textStyle: {
          fontSize: 11,
          color: '#666'
        }
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
        boundaryGap: false,
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
        name: '经费（万元）',
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
          formatter: '{value}',
          fontSize: 11,
          color: '#666'
        }
      },
      series: [
        {
          name: '纵向项目',
          type: 'line',
          lineStyle: {
            width: 2.5,
            color: dashboardColors[0]
          },
          symbol: 'circle',
          symbolSize: 6,
          itemStyle: {
            color: dashboardColors[0]
          },
          emphasis: {
            lineStyle: {
              width: 3.5
            },
            symbolSize: 8
          },
          smooth: 0.6,
          areaStyle: {
            opacity: 0.2,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: dashboardColors[0] + '88' },
              { offset: 0.5, color: dashboardColors[0] + '44' },
              { offset: 1, color: 'rgba(255, 255, 255, 0.1)' }
            ])
          },
          data: nationalData
        },
        {
          name: '横向项目',
          type: 'line',
          lineStyle: {
            width: 2.5,
            color: dashboardColors[1]
          },
          symbol: 'circle',
          symbolSize: 6,
          itemStyle: {
            color: dashboardColors[1]
          },
          emphasis: {
            lineStyle: {
              width: 3.5
            },
            symbolSize: 8
          },
          smooth: 0.6,
          areaStyle: {
            opacity: 0.2,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: dashboardColors[1] + '88' },
              { offset: 0.5, color: dashboardColors[1] + '44' },
              { offset: 1, color: 'rgba(255, 255, 255, 0.1)' }
            ])
          },
          data: provincialData
        },
        {
          name: '院级项目',
          type: 'line',
          lineStyle: {
            width: 2.5,
            color: dashboardColors[2]
          },
          symbol: 'circle',
          symbolSize: 6,
          itemStyle: {
            color: dashboardColors[2]
          },
          emphasis: {
            lineStyle: {
              width: 3.5
            },
            symbolSize: 8
          },
          smooth: 0.6,
          areaStyle: {
            opacity: 0.2,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: dashboardColors[2] + '88' },
              { offset: 0.5, color: dashboardColors[2] + '44' },
              { offset: 1, color: 'rgba(255, 255, 255, 0.1)' }
            ])
          },
          data: horizontalData
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