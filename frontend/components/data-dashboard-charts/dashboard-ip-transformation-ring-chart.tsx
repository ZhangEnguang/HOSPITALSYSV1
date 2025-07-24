"use client"

import { useEffect, useRef } from "react"
import * as echarts from "echarts/core"
import { PieChart } from "echarts/charts"
import { TitleComponent, TooltipComponent, LegendComponent } from "echarts/components"
import { CanvasRenderer } from "echarts/renderers"

// 注册必要的组件
echarts.use([TitleComponent, TooltipComponent, LegendComponent, PieChart, CanvasRenderer])

// 知识产权转化数据
const ipTransformationData = {
  variety: {
    title: '品种',
    total: 156,
    transformed: 89,
    rate: 57.1
  },
  patent: {
    title: '专利',
    total: 234,
    transformed: 167,
    rate: 71.4
  },
  software: {
    title: '软件著作权',
    total: 78,
    transformed: 45,
    rate: 57.7
  }
}

interface DashboardIPTransformationRingChartProps {
  type: 'variety' | 'patent' | 'software'
}

export default function DashboardIPTransformationRingChart({ type }: DashboardIPTransformationRingChartProps) {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<echarts.ECharts | null>(null)

  useEffect(() => {
    if (!chartRef.current) return

    // 清理之前的实例
    if (chartInstance.current) {
      chartInstance.current.dispose()
    }

    // 响应式配置函数
    const getResponsiveConfig = () => {
      let containerWidth = 400;
      let containerHeight = 300;
      
      if (chartRef.current) {
        containerWidth = chartRef.current.clientWidth || chartRef.current.offsetWidth || 400;
        containerHeight = chartRef.current.clientHeight || chartRef.current.offsetHeight || 300;
      }
      
      // 如果容器尺寸为0或很小，使用默认值
      if (containerWidth <= 0 || containerHeight <= 0) {
        containerWidth = 400;
        containerHeight = 300;
      }
      
      // 调试信息（开发环境）
      if (process.env.NODE_ENV === 'development') {
        console.log(`环形图 ${type} 容器尺寸:`, {
          clientWidth: chartRef.current?.clientWidth,
          offsetWidth: chartRef.current?.offsetWidth,
          finalWidth: containerWidth,
          isSmallScreen: containerWidth < 200,
          isMediumScreen: containerWidth >= 200 && containerWidth < 300,
          isLargeScreen: containerWidth >= 300
        });
      }
      
      const isSmallScreen = containerWidth < 200;
      const isMediumScreen = containerWidth >= 200 && containerWidth < 300;
      
      return {
        isSmallScreen,
        isMediumScreen,
        containerWidth,
        containerHeight,
        titleFontSize: isSmallScreen ? 11 : isMediumScreen ? 12 : 13,
        centerFontSize: isSmallScreen ? 12 : isMediumScreen ? 14 : 18,
        centerSubFontSize: isSmallScreen ? 8 : isMediumScreen ? 9 : 10,
        labelFontSize: isSmallScreen ? 7 : isMediumScreen ? 8 : 9,
        radius: isSmallScreen ? ['30%', '50%'] : isMediumScreen ? ['32%', '52%'] : ['35%', '55%'],
        center: isSmallScreen ? ['50%', '50%'] : isMediumScreen ? ['50%', '49%'] : ['50%', '48%'],
        titleTop: isSmallScreen ? 8 : isMediumScreen ? 9 : 10,
        centerTop: isSmallScreen ? '50%' : isMediumScreen ? '49%' : '48%'
      };
    };

    // 获取数据
    const data = ipTransformationData[type as keyof typeof ipTransformationData]
    const untransformed = data.total - data.transformed
    
    // 创建新的图表实例
    try {
      chartInstance.current = echarts.init(chartRef.current, null, {
        width: 'auto',
        height: 'auto'
      })
      
      const config = getResponsiveConfig();
      
      // 调试信息（开发环境）
      if (process.env.NODE_ENV === 'development') {
        console.log(`环形图 ${type} 响应式配置:`, {
          containerWidth: chartRef.current?.clientWidth || 'unknown',
          containerHeight: chartRef.current?.clientHeight || 'unknown',
          isSmallScreen: config.isSmallScreen,
          isMediumScreen: config.isMediumScreen,
          titleFontSize: config.titleFontSize,
          centerFontSize: config.centerFontSize,
          radius: config.radius
        });
      }

      const option = {
        title: {
          text: data.title,
          left: 'center',
          top: config.titleTop,
          textStyle: {
            fontSize: config.titleFontSize,
            fontWeight: '600',
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
          shadowOffsetY: 4,
          padding: [12, 16],
          textStyle: {
            color: '#333',
            fontSize: 12
          },
          formatter: function(params: any) {
            const percentage = ((params.value / data.total) * 100).toFixed(1)
            return `
              <div style="font-weight: 600; margin-bottom: 8px; color: #1f2937; font-size: 14px;">
                ${data.title} - ${params.name}
              </div>
              <div style="margin-bottom: 4px;">
                <span style="display: inline-block; width: 8px; height: 8px; background: ${params.color}; border-radius: 50%; margin-right: 6px;"></span>
                <span style="font-weight: 600;">数量：${params.value}项 (${percentage}%)</span>
              </div>
              <div style="margin-top: 8px; padding: 4px 8px; background: #f8f9fa; border-radius: 6px; font-size: 11px; color: #6b7280;">
                转化率：${data.rate}%
              </div>
            `;
          }
        },
        series: [
          {
            name: data.title,
            type: 'pie',
            radius: config.radius,
            center: config.center,
            avoidLabelOverlap: false,
            padAngle: 2,
            itemStyle: {
              borderRadius: 4,
              borderWidth: 0,
              shadowBlur: 6,
              shadowColor: 'rgba(0, 0, 0, 0.08)'
            },
            label: {
              show: true,
              position: 'outside',
              fontSize: config.labelFontSize,
              fontWeight: 'bold',
              color: '#374151',
              formatter: function(params: any) {
                const percentage = ((params.value / data.total) * 100).toFixed(1)
                return `${percentage}%`;
              },
              distanceToLabelLine: config.isSmallScreen ? 2 : 3
            },
            labelLine: {
              show: true,
              length: 4,
              length2: 3,
              lineStyle: {
                color: '#9CA3AF',
                width: 1
              }
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowColor: 'rgba(0, 0, 0, 0.15)',
                scale: 1.03
              }
            },
            data: [
              {
                value: data.transformed,
                name: '已转化',
                itemStyle: {
                  color: '#22C55E'
                }
              },
              {
                value: untransformed,
                name: '未转化',
                itemStyle: {
                  color: '#E5E7EB'
                }
              }
            ]
          }
        ],
        graphic: {
          type: 'group',
          left: 'center',
          top: config.centerTop,
          children: [
            {
              type: 'text',
              style: {
                text: data.rate + '%',
                textAlign: 'center',
                fill: '#374151',
                fontSize: config.centerFontSize,
                fontWeight: 'bold'
              }
            },
            {
              type: 'text',
              top: config.isSmallScreen ? 12 : config.isMediumScreen ? 14 : 16,
              style: {
                text: '转化率',
                textAlign: 'center',
                fill: '#6B7280',
                fontSize: config.centerSubFontSize
              }
            }
          ]
        },
        animation: true,
        animationDuration: 1000,
        animationEasing: 'cubicOut' as const
      };

      chartInstance.current.setOption(option);

    } catch (error) {
      console.error('Failed to create chart:', error)
    }

    // 响应式处理函数
    const handleResize = () => {
      if (chartInstance.current && chartRef.current) {
        // 重新计算响应式配置
        const newConfig = getResponsiveConfig();
        
        // 调试信息（开发环境）
        if (process.env.NODE_ENV === 'development') {
          console.log(`环形图 ${type} resize - 响应式配置:`, {
            containerWidth: chartRef.current.clientWidth,
            containerHeight: chartRef.current.clientHeight,
            isSmallScreen: newConfig.isSmallScreen,
            isMediumScreen: newConfig.isMediumScreen,
            titleFontSize: newConfig.titleFontSize,
            centerFontSize: newConfig.centerFontSize,
            radius: newConfig.radius
          });
        }
        
        // 重新构建图表配置
        const newOption = {
          title: {
            text: data.title,
            left: 'center',
            top: newConfig.titleTop,
            textStyle: {
              fontSize: newConfig.titleFontSize,
              fontWeight: '600',
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
            shadowOffsetY: 4,
            padding: [12, 16],
            textStyle: {
              color: '#333',
              fontSize: 12
            },
            formatter: function(params: any) {
              const percentage = ((params.value / data.total) * 100).toFixed(1)
              return `
                <div style="font-weight: 600; margin-bottom: 8px; color: #1f2937; font-size: 14px;">
                  ${data.title} - ${params.name}
                </div>
                <div style="margin-bottom: 4px;">
                  <span style="display: inline-block; width: 8px; height: 8px; background: ${params.color}; border-radius: 50%; margin-right: 6px;"></span>
                  <span style="font-weight: 600;">数量：${params.value}项 (${percentage}%)</span>
                </div>
                <div style="margin-top: 8px; padding: 4px 8px; background: #f8f9fa; border-radius: 6px; font-size: 11px; color: #6b7280;">
                  转化率：${data.rate}%
                </div>
              `;
            }
          },
          series: [
            {
              name: data.title,
              type: 'pie',
              radius: newConfig.radius,
              center: newConfig.center,
              avoidLabelOverlap: false,
              padAngle: 2,
              itemStyle: {
                borderRadius: 4,
                borderWidth: 0,
                shadowBlur: 6,
                shadowColor: 'rgba(0, 0, 0, 0.08)'
              },
              label: {
                show: true,
                position: 'outside',
                fontSize: newConfig.labelFontSize,
                fontWeight: 'bold',
                color: '#374151',
                formatter: function(params: any) {
                  const percentage = ((params.value / data.total) * 100).toFixed(1)
                  return `${percentage}%`;
                },
                distanceToLabelLine: newConfig.isSmallScreen ? 2 : 3
              },
              labelLine: {
                show: true,
                length: 4,
                length2: 3,
                lineStyle: {
                  color: '#9CA3AF',
                  width: 1
                }
              },
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowColor: 'rgba(0, 0, 0, 0.15)',
                  scale: 1.03
                }
              },
              data: [
                {
                  value: data.transformed,
                  name: '已转化',
                  itemStyle: {
                    color: '#22C55E'
                  }
                },
                {
                  value: untransformed,
                  name: '未转化',
                  itemStyle: {
                    color: '#E5E7EB'
                  }
                }
              ]
            }
          ],
          graphic: {
            type: 'group',
            left: 'center',
            top: newConfig.centerTop,
            children: [
              {
                type: 'text',
                style: {
                  text: data.rate + '%',
                  textAlign: 'center',
                  fill: '#374151',
                  fontSize: newConfig.centerFontSize,
                  fontWeight: 'bold'
                }
              },
              {
                type: 'text',
                top: newConfig.isSmallScreen ? 12 : newConfig.isMediumScreen ? 14 : 16,
                style: {
                  text: '转化率',
                  textAlign: 'center',
                  fill: '#6B7280',
                  fontSize: newConfig.centerSubFontSize
                }
              }
            ]
          },
          animation: true,
          animationDuration: 1000,
          animationEasing: 'cubicOut' as const
        };
        
        chartInstance.current.setOption(newOption, true);
        chartInstance.current.resize();
      }
    };

    // 添加resize事件监听
    window.addEventListener('resize', handleResize);
    
    // 使用ResizeObserver监听容器尺寸变化
    let resizeObserver: ResizeObserver | null = null;
    if (chartRef.current && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        handleResize();
      });
      resizeObserver.observe(chartRef.current);
    }
    
    // 延迟执行一次resize，确保容器尺寸正确
    setTimeout(() => {
      handleResize();
    }, 100);
    
    // 再次延迟执行，确保完全渲染后应用正确的配置
    setTimeout(() => {
      handleResize();
    }, 300);
    
    // 第三次延迟执行，确保响应式配置正确应用
    setTimeout(() => {
      handleResize();
    }, 500);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      if (chartInstance.current) {
        chartInstance.current.dispose();
        chartInstance.current = null;
      }
    };
  }, [type]);

  return (
    <div 
      ref={chartRef} 
      className="w-full h-full" 
      style={{ 
        minHeight: '200px'
      }}
    />
  );
} 