"use client"

import { useEffect, useRef } from "react"
import * as echarts from "echarts/core"
import { LineChart } from "echarts/charts"
import { TitleComponent, TooltipComponent, GridComponent, LegendComponent } from "echarts/components"
import { CanvasRenderer } from "echarts/renderers"

// 注册必要的组件
echarts.use([TitleComponent, TooltipComponent, GridComponent, LegendComponent, LineChart, CanvasRenderer])

// 模拟数据 - 年度经费趋势
const years = ['2018', '2019', '2020', '2021', '2022', '2023'];
const data = {
  '纵向项目': [1280, 1560, 1820, 2350, 2680, 3240],
  '横向项目': [860, 980, 1240, 1580, 1780, 2120],
  '基金项目': [640, 780, 950, 1150, 1360, 1620]
};

export default function FundsYearTrendChart() {
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

    // 设置图表选项
    const option = {
      tooltip: {
        trigger: 'axis',
        formatter: function(params: any) {
          let result = params[0].axisValue + '<br/>';
          params.forEach((item: any) => {
            result += item.marker + ' ' + item.seriesName + ': ' + item.value + '万元<br/>';
          });
          return result;
        }
      },
      legend: {
        data: Object.keys(data),
        bottom: 'bottom'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '15%',
        top: '3%',
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
          color: '#666'
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value}万元',
          color: '#666'
        },
        splitLine: {
          lineStyle: {
            color: '#F0F0F0'
          }
        }
      },
      series: [
        {
          name: '纵向项目',
          type: 'line',
          smooth: true,
          lineStyle: {
            width: 3,
            color: '#3468FF'
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(52, 104, 255, 0.5)' },
              { offset: 1, color: 'rgba(52, 104, 255, 0.1)' }
            ])
          },
          emphasis: {
            focus: 'series'
          },
          data: data['纵向项目']
        },
        {
          name: '横向项目',
          type: 'line',
          smooth: true,
          lineStyle: {
            width: 3,
            color: '#17D1FF'
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(23, 209, 255, 0.5)' },
              { offset: 1, color: 'rgba(23, 209, 255, 0.1)' }
            ])
          },
          emphasis: {
            focus: 'series'
          },
          data: data['横向项目']
        },
        {
          name: '基金项目',
          type: 'line',
          smooth: true,
          lineStyle: {
            width: 3,
            color: '#FF7D00'
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(255, 125, 0, 0.5)' },
              { offset: 1, color: 'rgba(255, 125, 0, 0.1)' }
            ])
          },
          emphasis: {
            focus: 'series'
          },
          data: data['基金项目']
        }
      ]
    };

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
  }, [])

  return <div ref={chartRef} style={{ width: "100%", height: "100%" }} />
} 