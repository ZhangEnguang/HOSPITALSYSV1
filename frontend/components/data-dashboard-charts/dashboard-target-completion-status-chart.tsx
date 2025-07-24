"use client"

import { useEffect, useRef } from "react"
import * as echarts from "echarts/core"
import { PieChart } from "echarts/charts"
import { TitleComponent, TooltipComponent, LegendComponent } from "echarts/components"
import { CanvasRenderer } from "echarts/renderers"

// 注册必要的组件
echarts.use([TitleComponent, TooltipComponent, LegendComponent, PieChart, CanvasRenderer])

// 完成状态数据
const completionStatusData = [
  {
    name: "超额完成",
    value: 12,
    percentage: 57.1,
    institutes: [
      "畜牧兽医研究所(112.0%)",
      "动物营养与饲料研究所(106.7%)", 
      "农业生物技术研究所(111.9%)",
      "农村能源与生态研究所(111.5%)",
      "农业经济与信息研究所(110.5%)",
      "作物资源研究所(111.8%)",
      "玉米研究所(110.7%)",
      "大豆研究所(110.5%)",
      "果树研究所(109.4%)",
      "主粮工程研究中心(106.3%)",
      "植物保护研究所(105.2%)",
      "水稻研究所(103.8%)"
    ],
    color: "#22C55E", // 绿色
    description: "目标完成率 > 100%"
  },
  {
    name: "达标",
    value: 6,
    percentage: 28.6,
    institutes: [
      "农产品加工研究所(100.0%)",
      "洮南综合试验站(100.0%)",
      "草地与生态研究所(100.0%)",
      "农业资源与环境研究所(100.0%)",
      "农业质量标准与检测技术研究所(100.0%)",
      "经济植物研究所(100.0%)"
    ],
    color: "#EAB308", // 黄色
    description: "目标完成率 = 100%"
  },
  {
    name: "未达标",
    value: 3,
    percentage: 14.3,
    institutes: [
      "动物生物技术研究所(95.2%)",
      "花生研究所(96.8%)",
      "试验地综合服务中心(97.5%)"
    ],
    color: "#EF4444", // 红色
    description: "目标完成率 < 100%"
  }
];

// 时间进度数据
const progressStatusData = [
  {
    name: "进度超前",
    value: 8,
    percentage: 38.1,
    institutes: [
      "畜牧兽医研究所(提前15天)",
      "动物营养与饲料研究所(提前12天)",
      "农业生物技术研究所(提前8天)",
      "农村能源与生态研究所(提前10天)",
      "农业经济与信息研究所(提前5天)",
      "作物资源研究所(提前7天)",
      "玉米研究所(提前6天)",
      "大豆研究所(提前9天)"
    ],
    color: "#3B82F6", // 蓝色
    description: "进度提前完成"
  },
  {
    name: "进度正常",
    value: 6,
    percentage: 28.6,
    institutes: [
      "果树研究所(按时进行)",
      "主粮工程研究中心(按时进行)",
      "农产品加工研究所(按时进行)",
      "洮南综合试验站(按时进行)",
      "植物保护研究所(按时进行)",
      "水稻研究所(按时进行)"
    ],
    color: "#10B981", // 绿色
    description: "按时间计划执行"
  },
  {
    name: "进度延迟",
    value: 7,
    percentage: 33.3,
    institutes: [
      "动物生物技术研究所(延迟8天)",
      "草地与生态研究所(延迟12天)",
      "农业资源与环境研究所(延迟6天)",
      "农业质量标准与检测技术研究所(延迟15天)",
      "经济植物研究所(延迟10天)",
      "花生研究所(延迟7天)",
      "试验地综合服务中心(延迟5天)"
    ],
    color: "#F59E0B", // 橙色
    description: "进度落后于计划"
  }
];

interface TooltipParamType {
  name: string;
  value: number;
  data: {
    name: string;
    value: number;
    percentage: number;
    institutes: string[];
    color: string;
    description: string;
  };
}

interface DashboardTargetCompletionStatusChartProps {
  onCategorySelect?: (category: string | null, institutes: string[]) => void;
  activeMode?: 'completion' | 'progress';
}

export default function DashboardTargetCompletionStatusChart({ 
  onCategorySelect,
  activeMode = 'completion'
}: DashboardTargetCompletionStatusChartProps) {
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

    // 根据activeMode选择数据
    const currentData = activeMode === 'completion' ? completionStatusData : progressStatusData;
    const chartTitle = activeMode === 'completion' ? '按完成状态分布' : '按时间进度分布';

    const option = {
      tooltip: {
        trigger: 'item',
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
        formatter: function (params: TooltipParamType) {
          const data = params.data;
          
          let institutesHtml = '';
          data.institutes.forEach((institute, index) => {
            if (index < 4) { // 只显示前4个，防止tooltip过长
              institutesHtml += `
                <div style="margin: 4px 0; padding: 4px 8px; background: #f8f9fa; border-radius: 6px; font-size: 12px;">
                  ${institute}
                </div>
              `;
            }
          });

          if (data.institutes.length > 4) {
            institutesHtml += `
              <div style="margin: 4px 0; padding: 4px 8px; background: #e9ecef; border-radius: 6px; font-size: 12px; color: #6c757d;">
                还有 ${data.institutes.length - 4} 个研究所...
              </div>
            `;
          }

          return `
            <div style="max-width: 300px;">
              <div style="font-weight: 600; margin-bottom: 8px; color: #1f2937; font-size: 14px;">
                ${data.name} (${data.value}个研究所)
              </div>
              <div style="margin-bottom: 8px; font-size: 12px; color: #6b7280;">
                ${data.description}
              </div>
              <div style="margin-bottom: 8px;">
                <span style="display: inline-block; width: 8px; height: 8px; background: ${data.color}; border-radius: 50%; margin-right: 6px;"></span>
                <span style="font-weight: 600;">占比：${data.percentage}%</span>
              </div>
              <div style="max-height: 200px; overflow-y: auto;">
                ${institutesHtml}
              </div>
            </div>
          `;
        }
      },
      legend: {
        orient: 'horizontal',
        bottom: 20,
        left: 'center',
        itemGap: 12,
        textStyle: {
          fontSize: 11,
          color: '#64748B'
        },
        itemWidth: 10,
        itemHeight: 10,
        formatter: function(name: string) {
          const item = currentData.find(d => d.name === name);
          return `${name} (${item?.value || 0}个)`;
        }
      },
      series: [
        {
          name: chartTitle,
          type: 'pie',
          radius: ['30%', '48%'],
          center: ['50%', '45%'],
          avoidLabelOverlap: false,
          padAngle: 1,
          itemStyle: {
            borderRadius: 8,
            borderWidth: 0,
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.1)'
          },
          label: {
            show: true,
            position: 'outside',
            fontSize: 11,
            fontWeight: 'bold',
            color: '#374151',
            formatter: function(params: any) {
              return `${params.data.percentage}%`;
            },
            distanceToLabelLine: 5
          },
          labelLine: {
            show: true,
            length: 12,
            length2: 6,
            lineStyle: {
              color: '#9CA3AF',
              width: 1
            }
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 15,
              shadowColor: 'rgba(0, 0, 0, 0.2)',
              scale: 1.05
            }
          },
          data: currentData.map(item => ({
            ...item,
            itemStyle: {
              color: item.color
            }
          }))
        }
      ],
      animation: true,
      animationDuration: 1000,
      animationEasing: 'cubicOut' as const
    };

    chartInstance.current.setOption(option);

    // 调整图表canvas位置 - 强制设置样式
    setTimeout(() => {
      const canvasElement = chartRef.current?.querySelector('canvas');
      if (canvasElement) {
        canvasElement.style.setProperty('top', '-20px', 'important');
        canvasElement.style.setProperty('position', 'absolute', 'important');
      }
    }, 50);

    // 添加额外的调整，确保样式生效
    setTimeout(() => {
      const canvasElement = chartRef.current?.querySelector('canvas');
      if (canvasElement) {
        canvasElement.style.top = '-20px';
      }
    }, 200);

    // 添加点击事件
    chartInstance.current.on('click', (params: any) => {
      if (params.data && onCategorySelect) {
        const category = params.data.name;
        const institutes = params.data.institutes;
        onCategorySelect(category, institutes);
      }
    });

    // 响应式处理
    const handleResize = () => {
      if (chartInstance.current) {
        chartInstance.current.resize();
        // 在resize后重新调整canvas位置
        setTimeout(() => {
          const canvasElement = chartRef.current?.querySelector('canvas');
          if (canvasElement) {
            canvasElement.style.setProperty('top', '-20px', 'important');
          }
        }, 50);
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
  }, [onCategorySelect, activeMode]);

  return (
    <div 
      ref={chartRef} 
      className="w-full h-full" 
      style={{ 
        position: 'relative',
        overflow: 'hidden'
      }}
    />
  );
} 