"use client"

import { useEffect, useRef } from "react"
import * as echarts from "echarts/core"
import { BarChart } from "echarts/charts"
import { TitleComponent, TooltipComponent, GridComponent, DataZoomComponent } from "echarts/components"
import { CanvasRenderer } from "echarts/renderers"

// 注册必要的组件
echarts.use([TitleComponent, TooltipComponent, GridComponent, DataZoomComponent, BarChart, CanvasRenderer])

interface TooltipParams {
  dataIndex: number;
  seriesName?: string;
  value?: number | string;
  name?: string;
}

export default function ResourceUtilizationChart() {
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
    const data = {
      categories: ['计算资源', '存储资源', '网络带宽', '实验设备', '测试环境', '人力资源'],
      utilization: [92, 78, 65, 83, 71, 88],
      capacity: [100, 100, 100, 100, 100, 100],
      allocated: [95, 85, 75, 90, 80, 92]
    }

    // 资源分配与使用定义数据
    const seriesData = [
      {
        name: '分配率',
        data: data.allocated,
        color: '#4cc9f0'
      },
      {
        name: '利用率',
        data: data.utilization,
        color: '#4361ee'
      },
      {
        name: '总容量',
        data: data.capacity,
        color: '#e9ecef'
      }
    ]

    // 设置图表选项
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: function(params: TooltipParams[]) {
          const categoryIndex = params[0].dataIndex
          const category = data.categories[categoryIndex]
          const utilization = data.utilization[categoryIndex]
          const allocated = data.allocated[categoryIndex]
          
          return `${category}<br/>
                  <span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${seriesData[0].color};"></span> 分配率: ${allocated}%<br/>
                  <span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${seriesData[1].color};"></span> 利用率: ${utilization}%<br/>`
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '15%',
        top: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        max: 100,
        axisLabel: {
          formatter: '{value}%'
        }
      },
      yAxis: {
        type: 'category',
        data: data.categories,
        axisLabel: {
          margin: 20
        }
      },
      series: [
        {
          name: '总容量',
          type: 'bar',
          stack: 'total',
          silent: true,
          itemStyle: {
            borderColor: 'transparent',
            color: seriesData[2].color
          },
          emphasis: {
            itemStyle: {
              borderColor: 'transparent',
              color: seriesData[2].color
            }
          },
          data: data.capacity
        },
        {
          name: '分配率',
          type: 'bar',
          stack: 'total',
          silent: true,
          itemStyle: {
            borderColor: 'transparent',
            color: 'transparent'
          },
          emphasis: {
            itemStyle: {
              borderColor: 'transparent',
              color: 'transparent'
            }
          },
          data: data.capacity.map((v, i) => v - data.allocated[i])
        },
        {
          name: '分配率显示',
          type: 'bar',
          stack: 'allocated',
          z: 3,
          itemStyle: {
            color: seriesData[0].color
          },
          data: data.allocated
        },
        {
          name: '利用率',
          type: 'bar',
          stack: 'total',
          silent: true,
          itemStyle: {
            borderColor: 'transparent',
            color: 'transparent'
          },
          emphasis: {
            itemStyle: {
              borderColor: 'transparent',
              color: 'transparent'
            }
          },
          data: data.capacity.map((v, i) => v - data.utilization[i])
        },
        {
          name: '利用率显示',
          type: 'bar',
          stack: 'usage',
          z: 4,
          itemStyle: {
            color: seriesData[1].color
          },
          data: data.utilization
        }
      ],
      dataZoom: [
        {
          type: 'inside',
          yAxisIndex: 0,
          start: 0,
          end: 100
        }
      ]
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
  }, [])

  return <div ref={chartRef} style={{ width: "100%", height: "100%" }} />
} 