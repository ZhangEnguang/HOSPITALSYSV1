"use client"

import { useEffect, useRef } from "react"
import * as echarts from "echarts/core"
import { LineChart } from "echarts/charts"
import { TitleComponent, TooltipComponent, GridComponent, LegendComponent } from "echarts/components"
import { CanvasRenderer } from "echarts/renderers"

// 注册必要的组件
echarts.use([TitleComponent, TooltipComponent, GridComponent, LegendComponent, LineChart, CanvasRenderer])

// 模拟数据 - 近10年科研经费增长数据（单位：万元）
const data = [
  { year: "2014", total: 2450, growth: 0 },
  { year: "2015", total: 2780, growth: 13.5 },
  { year: "2016", total: 3210, growth: 15.5 },
  { year: "2017", total: 3580, growth: 11.5 },
  { year: "2018", total: 4050, growth: 13.1 },
  { year: "2019", total: 4520, growth: 11.6 },
  { year: "2020", total: 4980, growth: 10.2 },
  { year: "2021", total: 5380, growth: 8.0 },
  { year: "2022", total: 5840, growth: 8.6 },
  { year: "2023", total: 6240, growth: 6.8 }
];

// 指定颜色，与project-funding-chart保持一致
const colors = ["#3469FF", "#37E2E2", "#FF7D00"];

// 定义图表参数类型
interface TooltipParamType {
  name: string;
  marker: string;
  seriesName: string;
  value: number;
  dataIndex: number;
  seriesIndex: number;
}

export default function FundsGrowthChart() {
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
    const totalValues = data.map(item => item.total);
    const growthValues = data.map(item => item.growth);

    // 设置图表选项
    const option = {
      tooltip: {
        trigger: 'axis',
        formatter: function (params: TooltipParamType[]) {
          let result = params[0].name + '年<br/>';
          params.forEach((item: TooltipParamType) => {
            if (item.seriesName === '总经费') {
              result += `${item.marker} ${item.seriesName}: ${item.value} 万元<br/>`;
            } else {
              result += `${item.marker} ${item.seriesName}: ${item.value}%<br/>`;
            }
          });
          return result;
        }
      },
      legend: {
        data: ['总经费', '增长率'],
        bottom: 'bottom',
        itemWidth: 15,
        itemHeight: 8
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '15%',
        top: '8%',
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
        }
      },
      yAxis: [
        {
          type: 'value',
          name: '经费（万元）',
          nameTextStyle: {
            padding: [0, 0, 0, 40]
          },
          min: 0,
          position: 'left',
          axisLine: {
            show: true,
            lineStyle: {
              color: colors[0]
            }
          },
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: '#E0E0E0'
            }
          }
        },
        {
          type: 'value',
          name: '增长率（%）',
          min: 0,
          max: 20,
          position: 'right',
          axisLine: {
            show: true,
            lineStyle: {
              color: colors[1]
            }
          },
          splitLine: {
            show: false
          }
        }
      ],
      series: [
        {
          name: '总经费',
          type: 'line',
          yAxisIndex: 0,
          smooth: true,
          lineStyle: {
            width: 2,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: colors[0] },
              { offset: 1, color: colors[0] + '80' }
            ])
          },
          symbol: 'circle',
          symbolSize: 6,
          itemStyle: {
            color: colors[0]
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: colors[0] + 'CC' },
              { offset: 1, color: colors[0] + '10' }
            ])
          },
          data: totalValues
        },
        {
          name: '增长率',
          type: 'line',
          yAxisIndex: 1,
          smooth: true,
          lineStyle: {
            width: 2,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: colors[1] },
              { offset: 1, color: colors[1] + '80' }
            ])
          },
          symbol: 'circle',
          symbolSize: 6,
          itemStyle: {
            color: colors[1]
          },
          data: growthValues
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