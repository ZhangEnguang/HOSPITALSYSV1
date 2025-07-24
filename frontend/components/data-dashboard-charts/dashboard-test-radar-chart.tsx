"use client"

import { useEffect, useRef } from "react"
import * as echarts from "echarts/core"
import { RadarChart } from "echarts/charts"
import { TitleComponent, TooltipComponent, LegendComponent } from "echarts/components"
import { CanvasRenderer } from "echarts/renderers"

// 注册必要的组件
echarts.use([TitleComponent, TooltipComponent, LegendComponent, RadarChart, CanvasRenderer])

// 左侧雷达图数据 - 五类合同的来款金额、合同金额
const contractRadarData = {
  indicator: [
    { name: '技术开发合同', max: 1000 },
    { name: '技术转让合同', max: 1000 },
    { name: '技术咨询合同', max: 1000 },
    { name: '技术服务合同', max: 1000 },
    { name: '专利许可合同', max: 1000 }
  ],
  series: [
    {
      name: '来款金额',
      data: [850, 720, 650, 780, 590],
      color: '#3B82F6'
    },
    {
      name: '合同金额', 
      data: [900, 800, 700, 850, 650],
      color: '#10B981'
    }
  ]
};

// 右侧雷达图数据 - 技合同的来款金额、来款类型
const paymentRadarData = {
  indicator: [
    { name: '预付款', max: 800 },
    { name: '进度款', max: 800 },
    { name: '验收款', max: 800 },
    { name: '质保金', max: 800 },
    { name: '尾款', max: 800 }
  ],
  series: [
    {
      name: '来款金额',
      data: [680, 750, 620, 580, 690],
      color: '#8B5CF6'
    },
    {
      name: '来款类型',
      data: [650, 720, 590, 560, 670],
      color: '#F59E0B'
    }
  ]
};

interface DashboardTestRadarChartProps {
  type?: 'contract' | 'payment';
}

export default function DashboardTestRadarChart({ type = 'contract' }: DashboardTestRadarChartProps) {
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

    const data = type === 'contract' ? contractRadarData : paymentRadarData;
    const title = type === 'contract' ? '合同类型分析' : '来款类型分析';

    const option = {
      title: {
        text: title,
        left: 'center',
        top: 10,
        textStyle: {
          fontSize: 14,
          fontWeight: 'normal',
          color: '#374151'
        }
      },
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#E5E5E5',
        borderWidth: 1,
        borderRadius: 8,
        shadowBlur: 20,
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        padding: [12, 16],
        textStyle: {
          color: '#333',
          fontSize: 12
        },
        formatter: function(params: any) {
          return `
            <div style="font-weight: bold; margin-bottom: 8px;">${params.name}</div>
            <div style="display: flex; align-items: center; margin-bottom: 4px;">
              <span style="display: inline-block; width: 10px; height: 10px; background-color: ${params.color}; border-radius: 50%; margin-right: 8px;"></span>
              ${params.seriesName}: ${params.value}万元
            </div>
          `;
        }
      },
      legend: {
        bottom: 10,
        left: 'center',
        itemGap: 20,
        textStyle: {
          fontSize: 11,
          color: '#64748B'
        },
        itemWidth: 12,
        itemHeight: 8
      },
      radar: {
        center: ['50%', '55%'],
        radius: '60%',
        indicator: data.indicator,
        name: {
          textStyle: {
            color: '#6B7280',
            fontSize: 11
          },
          formatter: function(value: string) {
            return value.length > 6 ? value.substring(0, 6) + '...' : value;
          }
        },
        splitArea: {
          areaStyle: {
            color: ['rgba(59, 130, 246, 0.02)', 'rgba(59, 130, 246, 0.05)']
          }
        },
        splitLine: {
          lineStyle: {
            color: '#E5E7EB',
            width: 1
          }
        },
        axisLine: {
          lineStyle: {
            color: '#D1D5DB'
          }
        }
      },
      series: [{
        name: '数据对比',
        type: 'radar',
        emphasis: {
          areaStyle: {
            opacity: 0.3
          }
        },
        data: data.series.map(item => ({
          value: item.data,
          name: item.name,
          areaStyle: {
            opacity: 0.1,
            color: item.color
          },
          lineStyle: {
            color: item.color,
            width: 2
          },
          itemStyle: {
            color: item.color,
            borderColor: item.color,
            borderWidth: 2
          }
        }))
      }],
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
  }, [type]);

  return <div ref={chartRef} className="w-full h-full" />;
} 