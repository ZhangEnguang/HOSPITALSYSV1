"use client"

import { useEffect, useRef, useState } from "react"
import * as echarts from "echarts/core"
import { BarChart } from "echarts/charts"
import { TitleComponent, TooltipComponent, GridComponent, LegendComponent, DataZoomComponent, ToolboxComponent } from "echarts/components"
import { CanvasRenderer } from "echarts/renderers"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

// 注册必要的组件
echarts.use([TitleComponent, TooltipComponent, GridComponent, LegendComponent, DataZoomComponent, ToolboxComponent, BarChart, CanvasRenderer])

// 我院类别数据（A-E类）
const instituteCategoryData = [
  { 
    name: "A类院", 
    contracts: 85, 
    income: 4200, 
    contractAmount: 5800,
    color: "#1E88E5"
  },
  { 
    name: "B类院", 
    contracts: 68, 
    income: 3150, 
    contractAmount: 4200,
    color: "#43A047"
  },
  { 
    name: "C类院", 
    contracts: 52, 
    income: 2400, 
    contractAmount: 3100,
    color: "#FB8C00"
  },
  { 
    name: "D类院", 
    contracts: 34, 
    income: 1680, 
    contractAmount: 2200,
    color: "#8E24AA"
  },
  { 
    name: "E类院", 
    contracts: 28, 
    income: 1220, 
    contractAmount: 1850,
    color: "#E53935"
  }
];

// 技术合同类别数据（五技合同）
const contractTypeData = [
  { 
    name: "技术开发", 
    contracts: 95, 
    income: 5200, 
    contractAmount: 7100,
    color: "#1E88E5"
  },
  { 
    name: "技术转让", 
    contracts: 48, 
    income: 2800, 
    contractAmount: 3600,
    color: "#43A047"
  },
  { 
    name: "技术咨询", 
    contracts: 72, 
    income: 3400, 
    contractAmount: 4200,
    color: "#FB8C00"
  },
  { 
    name: "技术服务", 
    contracts: 56, 
    income: 2650, 
    contractAmount: 3400,
    color: "#8E24AA"
  },
  { 
    name: "技术培训", 
    contracts: 25, 
    income: 950, 
    contractAmount: 1350,
    color: "#E53935"
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

interface DashboardMultiDimensionalAnalysisChartProps {
  activeMode?: 'institute' | 'contract'
}

export default function DashboardMultiDimensionalAnalysisChart({ 
  activeMode = 'institute' 
}: DashboardMultiDimensionalAnalysisChartProps) {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<echarts.ECharts | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  // 当activeMode变化时重置筛选
  useEffect(() => {
    setSelectedCategory(null)
  }, [activeMode])

  const getCurrentData = () => {
    return activeMode === 'institute' ? instituteCategoryData : contractTypeData;
  }

  const getFilteredData = () => {
    const data = getCurrentData();
    if (selectedCategory) {
      return data.filter(item => item.name === selectedCategory);
    }
    return data;
  }

  useEffect(() => {
    if (!chartRef.current) return

    if (chartInstance.current) {
      chartInstance.current.dispose()
    }

    chartInstance.current = echarts.init(chartRef.current, null, {
      width: 'auto',
      height: 'auto'
    })

    const data = getFilteredData();
    const categories = data.map(item => item.name);
    const contractsData = data.map(item => item.contracts);
    const incomeData = data.map(item => item.income);
    const contractAmountData = data.map(item => item.contractAmount);

    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
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
          const item = data[dataIndex];
          
          return `
            <div style="font-weight: 600; margin-bottom: 8px; color: #1f2937;">${item.name}</div>
            <div style="display: flex; flex-direction: column; gap: 4px;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="display: flex; align-items: center;">
                  <span style="display: inline-block; width: 10px; height: 10px; background: #60A5FA; border-radius: 2px; margin-right: 6px;"></span>
                  合同数量：
                </span>
                <span style="font-weight: 600; color: #1f2937;">${item.contracts}个</span>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="display: flex; align-items: center;">
                  <span style="display: inline-block; width: 10px; height: 10px; background: #34D399; border-radius: 2px; margin-right: 6px;"></span>
                  来款金额：
                </span>
                <span style="font-weight: 600; color: #1f2937;">${item.income}万元</span>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="display: flex; align-items: center;">
                  <span style="display: inline-block; width: 10px; height: 10px; background: #FBBF24; border-radius: 2px; margin-right: 6px;"></span>
                  合同金额：
                </span>
                <span style="font-weight: 600; color: #1f2937;">${item.contractAmount}万元</span>
              </div>
              <div style="margin-top: 6px; padding-top: 6px; border-top: 1px solid #E5E7EB; font-size: 11px; color: #6B7280;">
                来款率：${Math.round((item.income / item.contractAmount) * 100)}%
              </div>
            </div>
          `;
        }
      },
      legend: {
        data: ['合同数量', '来款金额', '合同金额'],
        top: 5,
        itemGap: 12,
        textStyle: {
          color: '#64748B',
          fontSize: 11
        },
        itemWidth: 12,
        itemHeight: 8
      },
      grid: {
        top: 40,
        left: 50,
        right: 50,
        bottom: 40,
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
            rotate: 0,
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
          name: '数量/金额',
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
            formatter: function(value: number) {
              if (value >= 1000) {
                return (value / 1000).toFixed(1) + 'k'
              }
              return value.toString()
            },
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
        }
      ],
      series: [
        {
          name: '合同数量',
          type: 'bar',
          yAxisIndex: 0,
          data: contractsData,
          itemStyle: {
            color: '#60A5FA',
            borderRadius: [2, 2, 0, 0]
          },
          barWidth: '25%',
          barGap: '10%',
          emphasis: {
            itemStyle: {
              color: '#3B82F6'
            }
          }
        },
        {
          name: '来款金额',
          type: 'bar',
          yAxisIndex: 0,
          data: incomeData,
          itemStyle: {
            color: '#34D399',
            borderRadius: [2, 2, 0, 0]
          },
          barWidth: '25%',
          emphasis: {
            itemStyle: {
              color: '#10B981'
            }
          }
        },
        {
          name: '合同金额',
          type: 'bar',
          yAxisIndex: 0,
          data: contractAmountData,
          itemStyle: {
            color: '#FBBF24',
            borderRadius: [2, 2, 0, 0]
          },
          barWidth: '25%',
          emphasis: {
            itemStyle: {
              color: '#F59E0B'
            }
          }
        }
      ],
      animation: true,
      animationDuration: 1000,
      animationEasing: 'cubicOut' as const
    };

    chartInstance.current.setOption(option);

    // 点击事件处理 - 联动筛选
    chartInstance.current.on('click', function(params: any) {
      if (params.componentType === 'series') {
        const categoryName = params.name;
        if (selectedCategory === categoryName) {
          // 如果点击的是已选中的类别，则取消筛选
          setSelectedCategory(null);
        } else {
          // 选中新的类别
          setSelectedCategory(categoryName);
        }
      }
    });

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
  }, [activeMode, selectedCategory]);

  return (
    <div className="w-full h-full flex flex-col">
      {/* 图表区域 */}
      <div ref={chartRef} className="flex-1 w-full" />
      
      {/* 底部筛选状态显示 */}
      {selectedCategory && (
        <div className="flex justify-center mt-2">
          <Badge 
            variant="secondary" 
            className="text-xs cursor-pointer hover:bg-gray-200 transition-colors"
            onClick={() => setSelectedCategory(null)}
          >
            已筛选: {selectedCategory} ✕
          </Badge>
        </div>
      )}
    </div>
  );
} 