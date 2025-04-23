"use client"

import { useEffect, useRef } from "react"
import * as echarts from "echarts/core"
import { BarChart } from "echarts/charts"
import { TitleComponent, TooltipComponent, GridComponent, LegendComponent } from "echarts/components"
import { CanvasRenderer } from "echarts/renderers"

// 注册必要的组件
echarts.use([TitleComponent, TooltipComponent, GridComponent, LegendComponent, BarChart, CanvasRenderer])

// 模拟数据 - 各学院教师发表的不同类型论文数量
const data = [
  { college: "计算机学院", SCI: 45, EI: 68, 核心期刊: 92, 普通期刊: 120 },
  { college: "电子信息学院", SCI: 38, EI: 56, 核心期刊: 78, 普通期刊: 105 },
  { college: "自动化学院", SCI: 42, EI: 63, 核心期刊: 85, 普通期刊: 96 },
  { college: "人工智能学院", SCI: 52, EI: 75, 核心期刊: 90, 普通期刊: 110 },
  { college: "网络安全学院", SCI: 35, EI: 50, 核心期刊: 72, 普通期刊: 88 },
  { college: "通信工程学院", SCI: 40, EI: 60, 核心期刊: 82, 普通期刊: 98 }
];

// 指定颜色方案
const colors = ["#246EFF", "#00B2FF", "#81E2FF", "#B3EEFF"];

export default function TeacherPublicationChart() {
  // 创建DOM引用
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

    // 获取学院名称列表
    const colleges = data.map(item => item.college);

    // 设置图表选项
    const option = {
      // 提示框配置
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: function(params: any) {
          let result = params[0].name + '<br/>';
          let total = 0;
          params.forEach((item: any) => {
            result += `${item.marker} ${item.seriesName}: ${item.value} 篇<br/>`;
            total += item.value;
          });
          result += `<br/>总计: ${total} 篇`;
          return result;
        },
        backgroundColor: 'rgba(50, 50, 50, 0.9)',
        borderColor: 'rgba(50, 50, 50, 0.9)',
        textStyle: {
          color: '#fff'
        },
        padding: [8, 12]
      },
      // 图例配置
      legend: {
        data: ['SCI论文', 'EI论文', '核心期刊论文', '普通期刊论文'],
        bottom: 'bottom',
        itemWidth: 15,
        itemHeight: 8,
        itemGap: 20,
        selectedMode: true
      },
      // 网格配置
      grid: {
        left: '3%',
        right: '4%',
        bottom: '20%',
        top: '8%',
        containLabel: true
      },
      // X轴配置
      xAxis: {
        type: 'category',
        data: colleges,
        axisLine: {
          lineStyle: {
            color: '#E0E0E0'
          }
        },
        axisLabel: {
          interval: 0,
          rotate: 30,
          textStyle: {
            fontSize: 12
          }
        }
      },
      // Y轴配置
      yAxis: {
        type: 'value',
        name: '论文数量（篇）',
        nameTextStyle: {
          padding: [0, 0, 0, 40]
        },
        splitLine: {
          lineStyle: {
            type: 'dashed',
            color: '#E0E0E0'
          }
        }
      },
      // 数据系列配置
      series: [
        {
          name: 'SCI论文',
          type: 'bar',
          stack: 'total',
          emphasis: {
            focus: 'series'
          },
          itemStyle: {
            color: colors[0]
          },
          data: data.map(item => item.SCI)
        },
        {
          name: 'EI论文',
          type: 'bar',
          stack: 'total',
          emphasis: {
            focus: 'series'
          },
          itemStyle: {
            color: colors[1]
          },
          data: data.map(item => item.EI)
        },
        {
          name: '核心期刊论文',
          type: 'bar',
          stack: 'total',
          emphasis: {
            focus: 'series'
          },
          itemStyle: {
            color: colors[2]
          },
          data: data.map(item => item.核心期刊)
        },
        {
          name: '普通期刊论文',
          type: 'bar',
          stack: 'total',
          emphasis: {
            focus: 'series'
          },
          itemStyle: {
            color: colors[3]
          },
          data: data.map(item => item.普通期刊)
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

    // 组件卸载时清理
    return () => {
      window.removeEventListener("resize", handleResize)
      chartInstance.current?.dispose()
    }
  }, [])

  return <div ref={chartRef} style={{ width: "100%", height: "100%" }} />
} 