"use client"

import { useEffect, useRef } from "react"
import * as echarts from "echarts/core"
import { BarChart, LineChart } from "echarts/charts"
import { TitleComponent, TooltipComponent, GridComponent, LegendComponent, DataZoomComponent } from "echarts/components"
import { CanvasRenderer } from "echarts/renderers"

// 注册必要的组件
echarts.use([TitleComponent, TooltipComponent, GridComponent, LegendComponent, DataZoomComponent, BarChart, LineChart, CanvasRenderer])

// 知识产权转化数据 - 简化为三类
const ipTransformationData = [
  {
    category: "品种",
    output: 48,
    transformed: 32,
    transformationAmount: 1850,
    transformationRate: 66.7
  },
  {
    category: "专利",
    output: 468, // 发明专利156 + 实用新型234 + 外观设计78 = 468
    transformed: 242, // 对应转化总和89 + 118 + 35 = 242
    transformationAmount: 7800, // 对应转化金额总和4200 + 2680 + 920 = 7800
    transformationRate: 51.7 // 重新计算的转化率 242/468 ≈ 51.7%
  },
  {
    category: "软件著作权",
    output: 125,
    transformed: 76,
    transformationAmount: 1560,
    transformationRate: 60.8
  }
];

interface TooltipParamType {
  name: string;
  marker: string;
  seriesName: string;
  value: number;
  dataIndex: number;
  seriesIndex: number;
}

export default function DashboardIPTransformationEfficiencyChart() {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<echarts.ECharts | null>(null)

  useEffect(() => {
    if (!chartRef.current) return

    if (chartInstance.current) {
      chartInstance.current.dispose()
    }

    chartInstance.current = echarts.init(chartRef.current, null, {
      width: 'auto',
      height: 'auto'
    })

    const categories = ipTransformationData.map(item => item.category);
    const outputData = ipTransformationData.map(item => item.output);
    const transformedData = ipTransformationData.map(item => item.transformed);
    const transformationRateData = ipTransformationData.map(item => item.transformationRate);

    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999'
          }
        },
        backgroundColor: 'rgba(255, 255, 255, 0.96)',
        borderColor: '#E5E5E5',
        borderWidth: 1,
        borderRadius: 10,
        shadowBlur: 20,
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOffsetY: 4,
        padding: [14, 18],
        textStyle: {
          color: '#333',
          fontSize: 12
        },
        formatter: function (params: TooltipParamType[]) {
          const dataIndex = params[0].dataIndex;
          const data = ipTransformationData[dataIndex];
          
          return `
            <div style="font-weight: 600; margin-bottom: 10px; color: #1f2937; font-size: 14px;">
              ${data.category}
            </div>
            <div style="display: flex; flex-direction: column; gap: 6px;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="display: flex; align-items: center;">
                  <span style="display: inline-block; width: 10px; height: 10px; background: #3B82F6; border-radius: 2px; margin-right: 8px;"></span>
                  产出数量：
                </span>
                <span style="font-weight: 600; color: #1f2937;">${data.output}项</span>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="display: flex; align-items: center;">
                  <span style="display: inline-block; width: 10px; height: 10px; background: #10B981; border-radius: 2px; margin-right: 8px;"></span>
                  已转化数量：
                </span>
                <span style="font-weight: 600; color: #1f2937;">${data.transformed}项</span>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="display: flex; align-items: center;">
                  <span style="display: inline-block; width: 10px; height: 10px; background: #F59E0B; border-radius: 2px; margin-right: 8px;"></span>
                  转化金额：
                </span>
                <span style="font-weight: 600; color: #1f2937;">${data.transformationAmount}万元</span>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="display: flex; align-items: center;">
                  <span style="display: inline-block; width: 10px; height: 10px; background: #EF4444; border-radius: 2px; margin-right: 8px;"></span>
                  转化率：
                </span>
                <span style="font-weight: 600; color: ${data.transformationRate >= 60 ? '#059669' : data.transformationRate >= 45 ? '#d97706' : '#dc2626'};">${data.transformationRate}%</span>
              </div>
            </div>
          `;
        }
      },
      legend: {
        data: ['产出数量', '已转化数量', '转化率'],
        top: 8,
        itemGap: 15,
        textStyle: {
          color: '#64748B',
          fontSize: 11
        },
        itemWidth: 12,
        itemHeight: 8
      },
      grid: {
        top: 45,
        left: 45,
        right: 45,
        bottom: 35,
        containLabel: false
      },
      xAxis: [
        {
          type: 'category',
          data: categories,
          axisPointer: {
            type: 'shadow'
          },
          axisLabel: {
            color: '#64748B',
            fontSize: 10,
            interval: 0,
            rotate: 20,
            margin: 8
          },
          axisLine: {
            lineStyle: {
              color: '#E2E8F0'
            }
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: '数量（项）',
          position: 'left',
          nameLocation: 'middle',
          nameGap: 35,
          nameTextStyle: {
            color: '#64748B',
            fontSize: 11
          },
          axisLabel: {
            color: '#64748B',
            fontSize: 10,
            formatter: '{value}',
            margin: 8
          },
          axisLine: {
            lineStyle: {
              color: '#E2E8F0'
            }
          },
          splitLine: {
            lineStyle: {
              color: '#F1F5F9',
              type: 'dashed'
            }
          }
        },
        {
          type: 'value',
          name: '转化率（%）',
          position: 'right',
          nameLocation: 'middle',
          nameGap: 35,
          nameTextStyle: {
            color: '#64748B',
            fontSize: 11
          },
          axisLabel: {
            color: '#64748B',
            fontSize: 10,
            formatter: '{value}%',
            margin: 8
          },
          axisLine: {
            lineStyle: {
              color: '#E2E8F0'
            }
          },
          splitLine: {
            show: false
          }
        }
      ],
      series: [
        {
          name: '产出数量',
          type: 'bar',
          yAxisIndex: 0,
          data: outputData,
          itemStyle: {
            color: '#3B82F6',
            borderRadius: [3, 3, 0, 0]
          },
          barWidth: '25%',
          barGap: '10%',
          emphasis: {
            itemStyle: {
              color: '#2563EB'
            }
          }
        },
        {
          name: '已转化数量',
          type: 'bar',
          yAxisIndex: 0,
          data: transformedData,
          itemStyle: {
            color: '#10B981',
            borderRadius: [3, 3, 0, 0]
          },
          barWidth: '25%',
          emphasis: {
            itemStyle: {
              color: '#059669'
            }
          }
        },
        {
          name: '转化率',
          type: 'line',
          yAxisIndex: 1,
          data: transformationRateData,
          lineStyle: {
            color: '#EF4444',
            width: 3
          },
          itemStyle: {
            color: '#EF4444',
            borderWidth: 2,
            borderColor: '#fff'
          },
          symbol: 'circle',
          symbolSize: 8,
          emphasis: {
            itemStyle: {
              color: '#DC2626',
              borderColor: '#fff',
              borderWidth: 2,
              shadowBlur: 8,
              shadowColor: 'rgba(220, 38, 38, 0.4)'
            },
            lineStyle: {
              width: 4
            }
          },
          markLine: {
            data: [
              {
                yAxis: 59.7, // 新的平均转化率 (66.7 + 51.7 + 60.8) / 3 ≈ 59.7%
                lineStyle: {
                  color: '#F59E0B',
                  type: 'dashed',
                  width: 2
                },
                label: {
                  show: true,
                  position: 'end',
                  formatter: '平均转化率: 59.7%',
                  color: '#F59E0B',
                  fontSize: 10
                }
              }
            ]
          }
        }
      ],
      animation: true,
      animationDuration: 1000,
      animationEasing: 'cubicOut' as const
    };

    chartInstance.current.setOption(option);

    // 响应式处理
    const handleResize = () => {
      if (chartInstance.current) {
        chartInstance.current.resize();
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartInstance.current) {
        chartInstance.current.dispose();
        chartInstance.current = null;
      }
    };
  }, []);

  return <div ref={chartRef} className="w-full h-full" />;
} 