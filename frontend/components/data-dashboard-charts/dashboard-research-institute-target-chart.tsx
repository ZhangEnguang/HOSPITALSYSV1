"use client"

import { useEffect, useRef } from "react"
import * as echarts from "echarts/core"
import { BarChart, LineChart } from "echarts/charts"
import { TitleComponent, TooltipComponent, GridComponent, LegendComponent, DataZoomComponent } from "echarts/components"
import { CanvasRenderer } from "echarts/renderers"

// 注册必要的组件
echarts.use([TitleComponent, TooltipComponent, GridComponent, LegendComponent, DataZoomComponent, BarChart, LineChart, CanvasRenderer])

// 研究所目标达成数据（单位：万元）
const instituteData = [
  { 
    name: "畜牧兽医研究所", 
    target: 2500, 
    actual: 2800, 
    completion: 112,
    transform: 1800,
    horizontal: 1000
  },
  { 
    name: "动物生物技术研究所", 
    target: 2200, 
    actual: 1950, 
    completion: 88.6,
    transform: 1200,
    horizontal: 750
  },
  { 
    name: "动物营养与饲料研究所", 
    target: 3000, 
    actual: 3200, 
    completion: 106.7,
    transform: 2000,
    horizontal: 1200
  },
  { 
    name: "草地与生态研究所", 
    target: 1800, 
    actual: 1650, 
    completion: 91.7,
    transform: 900,
    horizontal: 750
  },
  { 
    name: "农业生物技术研究所", 
    target: 2100, 
    actual: 2350, 
    completion: 111.9,
    transform: 1500,
    horizontal: 850
  },
  { 
    name: "农业资源与环境研究所", 
    target: 1600, 
    actual: 1450, 
    completion: 90.6,
    transform: 800,
    horizontal: 650
  },
  { 
    name: "农业经济与信息研究所", 
    target: 1900, 
    actual: 2100, 
    completion: 110.5,
    transform: 1300,
    horizontal: 800
  },
  { 
    name: "农业质量标准与检测技术研究所", 
    target: 1400, 
    actual: 1250, 
    completion: 89.3,
    transform: 700,
    horizontal: 550
  },
  { 
    name: "农村能源与生态研究所", 
    target: 1300, 
    actual: 1450, 
    completion: 111.5,
    transform: 900,
    horizontal: 550
  },
  { 
    name: "农产品加工研究所", 
    target: 1200, 
    actual: 1150, 
    completion: 95.8,
    transform: 650,
    horizontal: 500
  },
  { 
    name: "植物保护研究所", 
    target: 2000, 
    actual: 1850, 
    completion: 92.5,
    transform: 1100,
    horizontal: 750
  },
  { 
    name: "作物资源研究所", 
    target: 1700, 
    actual: 1900, 
    completion: 111.8,
    transform: 1200,
    horizontal: 700
  },
  { 
    name: "经济植物研究所", 
    target: 1500, 
    actual: 1350, 
    completion: 90.0,
    transform: 850,
    horizontal: 500
  },
  { 
    name: "玉米研究所", 
    target: 2800, 
    actual: 3100, 
    completion: 110.7,
    transform: 1900,
    horizontal: 1200
  },
  { 
    name: "水稻研究所", 
    target: 2600, 
    actual: 2400, 
    completion: 92.3,
    transform: 1600,
    horizontal: 800
  },
  { 
    name: "大豆研究所", 
    target: 1900, 
    actual: 2100, 
    completion: 110.5,
    transform: 1300,
    horizontal: 800
  },
  { 
    name: "花生研究所", 
    target: 1400, 
    actual: 1250, 
    completion: 89.3,
    transform: 800,
    horizontal: 450
  },
  { 
    name: "果树研究所", 
    target: 1600, 
    actual: 1750, 
    completion: 109.4,
    transform: 1000,
    horizontal: 750
  },
  { 
    name: "主粮工程研究中心", 
    target: 3200, 
    actual: 3400, 
    completion: 106.3,
    transform: 2200,
    horizontal: 1200
  },
  { 
    name: "试验地综合服务中心", 
    target: 1100, 
    actual: 1000, 
    completion: 90.9,
    transform: 600,
    horizontal: 400
  },
  { 
    name: "洮南综合试验站", 
    target: 900, 
    actual: 850, 
    completion: 94.4,
    transform: 500,
    horizontal: 350
  }
];

interface TooltipParamType {
  name: string;
  marker: string;
  seriesName: string;
  value: number | string;
  dataIndex: number;
  seriesIndex: number;
}

export default function DashboardResearchInstituteTargetChart() {
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

    const institutes = instituteData.map(item => item.name);
    const targetData = instituteData.map(item => item.target);
    const actualData = instituteData.map(item => item.actual);
    const completionData = instituteData.map(item => item.completion);

    // 计算超额部分数据（超过目标的部分用红色显示）
    const excessData = instituteData.map(item => {
      return item.actual > item.target ? item.actual - item.target : 0;
    });

    // 计算正常部分数据（不超过目标的部分）
    const normalActualData = instituteData.map(item => {
      return item.actual > item.target ? item.target : item.actual;
    });

    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999'
          }
        },
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#E5E5E5',
        borderWidth: 1,
        borderRadius: 8,
        shadowBlur: 20,
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOffsetY: 4,
        padding: [12, 16],
        textStyle: {
          color: '#333',
          fontSize: 12
        },
        formatter: function (params: TooltipParamType[]) {
          const dataIndex = params[0].dataIndex;
          const institute = instituteData[dataIndex];
          
          return `
            <div style="font-weight: 600; margin-bottom: 8px; color: #1f2937;">${institute.name}</div>
            <div style="display: flex; flex-direction: column; gap: 4px;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="display: flex; align-items: center;">
                  <span style="display: inline-block; width: 10px; height: 10px; background: #60A5FA; border-radius: 2px; margin-right: 6px;"></span>
                  目标金额：
                </span>
                <span style="font-weight: 600; color: #1f2937;">${institute.target}万元</span>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="display: flex; align-items: center;">
                  <span style="display: inline-block; width: 10px; height: 10px; background: #34D399; border-radius: 2px; margin-right: 6px;"></span>
                  实际到院：
                </span>
                <span style="font-weight: 600; color: #1f2937;">${institute.actual}万元</span>
              </div>
              ${institute.actual > institute.target ? `
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="display: flex; align-items: center;">
                  <span style="display: inline-block; width: 10px; height: 10px; background: #F87171; border-radius: 2px; margin-right: 6px;"></span>
                  超额完成：
                </span>
                <span style="font-weight: 600; color: #dc2626;">${institute.actual - institute.target}万元</span>
              </div>
              ` : ''}
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="display: flex; align-items: center;">
                  <span style="display: inline-block; width: 10px; height: 10px; background: #FBBF24; border-radius: 2px; margin-right: 6px;"></span>
                  完成率：
                </span>
                <span style="font-weight: 600; color: ${institute.completion >= 100 ? '#059669' : '#dc2626'};">${institute.completion}%</span>
              </div>
              <div style="margin-top: 6px; padding-top: 6px; border-top: 1px solid #E5E7EB; font-size: 11px; color: #6B7280;">
                成果转化：${institute.transform}万元 | 横向科研：${institute.horizontal}万元
              </div>
            </div>
          `;
        }
      },
      legend: {
        data: ['目标金额', '实际到院', '超额部分', '完成率'],
        top: 'top',
        left: 'center',
        itemGap: 15,
        textStyle: {
          color: '#64748B',
          fontSize: 11
        },
        itemWidth: 12,
        itemHeight: 8,
        padding: [5, 0, 0, 0]
      },
      // 数据缩放配置 - 当研究所数量超过6个时启用横向滚动
      dataZoom: institutes.length > 6 ? [
        {
          type: 'slider',
          show: true,
          xAxisIndex: [0],
          start: 0,
          end: Math.min(100, (6 / institutes.length) * 100), // 默认显示6个研究所
          bottom: 20,
          height: 18,
          borderColor: '#E2E8F0',
          fillerColor: 'rgba(59, 130, 246, 0.15)',
          handleStyle: {
            color: '#3B82F6',
            borderColor: '#3B82F6'
          },
          textStyle: {
            color: '#64748B',
            fontSize: 9
          },
          dataBackground: {
            lineStyle: {
              color: '#E2E8F0'
            },
            areaStyle: {
              color: 'rgba(226, 232, 240, 0.3)'
            }
          }
        },
        {
          type: 'inside',
          xAxisIndex: [0],
          start: 0,
          end: Math.min(100, (6 / institutes.length) * 100),
          zoomOnMouseWheel: true,
          moveOnMouseMove: true,
          moveOnMouseWheel: true
        }
      ] : [],
      grid: {
        top: 45,
        left: 60,
        right: 60,
        bottom: institutes.length > 6 ? 80 : 40, // 当有滚动条时为X轴标签和滚动轴预留30px分离空间
        containLabel: false
      },
      xAxis: [
        {
          type: 'category',
          data: institutes,
          axisPointer: {
            type: 'shadow'
          },
          axisLabel: {
            color: '#64748B',
            fontSize: 10,
            interval: 0,
            rotate: 15,
            margin: 10
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
          name: '金额（万元）',
          position: 'left',
          nameLocation: 'middle',
          nameGap: 30,
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
          name: '完成率（%）',
          position: 'right',
          nameLocation: 'middle',
          nameGap: 30,
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
          name: '目标金额',
          type: 'bar',
          yAxisIndex: 0,
          data: targetData,
          itemStyle: {
            color: '#60A5FA',
            borderRadius: [2, 2, 0, 0]
          },
          barWidth: '20%',
          barGap: '10%',
          emphasis: {
            itemStyle: {
              color: '#3B82F6'
            }
          }
        },
        {
          name: '实际到院',
          type: 'bar',
          yAxisIndex: 0,
          data: normalActualData,
          itemStyle: {
            color: '#34D399',
            borderRadius: [2, 2, 0, 0]
          },
          barWidth: '20%',
          emphasis: {
            itemStyle: {
              color: '#10B981'
            }
          },
          stack: 'actual'
        },
        {
          name: '超额部分',
          type: 'bar',
          yAxisIndex: 0,
          data: excessData,
          itemStyle: {
            color: '#F87171',
            borderRadius: [2, 2, 0, 0]
          },
          barWidth: '20%',
          emphasis: {
            itemStyle: {
              color: '#EF4444'
            }
          },
          stack: 'actual'
        },
        {
          name: '完成率',
          type: 'line',
          yAxisIndex: 1,
          data: completionData,
          lineStyle: {
            color: '#FBBF24',
            width: 3
          },
          itemStyle: {
            color: '#FBBF24',
            borderWidth: 2,
            borderColor: '#fff'
          },
          symbol: 'circle',
          symbolSize: 8,
          emphasis: {
            itemStyle: {
              color: '#F59E0B',
              borderColor: '#fff',
              borderWidth: 2,
              shadowBlur: 8,
              shadowColor: 'rgba(245, 158, 11, 0.4)'
            },
            lineStyle: {
              width: 4
            }
          },
          markLine: {
            data: [
              {
                yAxis: 100,
                lineStyle: {
                  color: '#DC2626',
                  type: 'dashed',
                  width: 2
                },
                label: {
                  show: true,
                  position: 'end',
                  formatter: '目标线: 100%',
                  color: '#DC2626',
                  fontSize: 11
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