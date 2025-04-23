"use client"

import { useEffect, useRef } from "react"
import * as echarts from "echarts/core"
import { LineChart } from "echarts/charts"
import { TitleComponent, TooltipComponent, GridComponent, LegendComponent } from "echarts/components"
import { CanvasRenderer } from "echarts/renderers"

// 注册必要的组件
echarts.use([TitleComponent, TooltipComponent, GridComponent, LegendComponent, LineChart, CanvasRenderer])

// 模拟数据 - 近5年不同类型项目经费情况（单位：万元）
const data = [
  { year: "2019", 国家级: 1200, 省部级: 850, 横向项目: 450 },
  { year: "2020", 国家级: 1350, 省部级: 920, 横向项目: 580 },
  { year: "2021", 国家级: 1580, 省部级: 1080, 横向项目: 720 },
  { year: "2022", 国家级: 1820, 省部级: 1250, 横向项目: 880 },
  { year: "2023", 国家级: 2100, 省部级: 1450, 横向项目: 1050 }
];

// 指定颜色方案
const colors = ["#1890FF", "#00DDDD", "#73D13D"];

// 定义数据类型
interface ChartDataItem {
  year: string;
  国家级: number;
  省部级: number;
  横向项目: number;
}

// 定义Tooltip参数类型
interface TooltipParamType {
  name: string;
  marker: string;
  seriesName: string;
  value: number;
  dataIndex: number;
  seriesIndex: number;
}

export default function ProjectFundingChart() {
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

    // 准备数据
    const years = data.map(item => item.year);
    const nationalData = data.map(item => item.国家级);
    const provincialData = data.map(item => item.省部级);
    const horizontalData = data.map(item => item.横向项目);

    // 设置图表选项
    const option = {
      // 提示框配置
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
      // 图例配置
      legend: {
        data: ['国家级项目', '省部级项目', '横向合作项目'],
        bottom: 'bottom',
        itemWidth: 15,
        itemHeight: 8,
        itemGap: 20
      },
      // 网格配置
      grid: {
        left: '3%',
        right: '4%',
        bottom: '15%',
        top: '8%',
        containLabel: true
      },
      // X轴配置
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: years,
        axisLine: {
          lineStyle: {
            color: '#E0E0E0'
          }
        }
      },
      // Y轴配置
      yAxis: {
        type: 'value',
        name: '经费（万元）',
        nameTextStyle: {
          padding: [0, 0, 0, 40]
        },
        splitLine: {
          lineStyle: {
            type: 'dashed',
            color: '#E0E0E0'
          }
        },
        axisLabel: {
          formatter: '{value}'
        }
      },
      // 数据系列配置
      series: [
        {
          name: '国家级项目',
          type: 'line',
          lineStyle: {
            width: 2.5,
            color: colors[0]
          },
          symbol: 'circle',
          symbolSize: 6,
          itemStyle: {
            color: colors[0]
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
              { offset: 0, color: colors[0] + '88' },
              { offset: 0.5, color: colors[0] + '44' },
              { offset: 1, color: 'rgba(255, 255, 255, 0.1)' }
            ])
          },
          data: nationalData
        },
        {
          name: '省部级项目',
          type: 'line',
          lineStyle: {
            width: 2.5,
            color: colors[1]
          },
          symbol: 'circle',
          symbolSize: 6,
          itemStyle: {
            color: colors[1]
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
              { offset: 0, color: colors[1] + '88' },
              { offset: 0.5, color: colors[1] + '44' },
              { offset: 1, color: 'rgba(255, 255, 255, 0.1)' }
            ])
          },
          data: provincialData
        },
        {
          name: '横向合作项目',
          type: 'line',
          lineStyle: {
            width: 2.5,
            color: colors[2]
          },
          symbol: 'circle',
          symbolSize: 6,
          itemStyle: {
            color: colors[2]
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
              { offset: 0, color: colors[2] + '88' },
              { offset: 0.5, color: colors[2] + '44' },
              { offset: 1, color: 'rgba(255, 255, 255, 0.1)' }
            ])
          },
          data: horizontalData
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