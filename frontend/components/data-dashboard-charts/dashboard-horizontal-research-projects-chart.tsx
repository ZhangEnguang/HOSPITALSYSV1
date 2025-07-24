"use client"

import { useEffect, useRef } from "react"
import * as echarts from "echarts/core"
import { BarChart, LineChart } from "echarts/charts"
import { TitleComponent, TooltipComponent, GridComponent, LegendComponent, DataZoomComponent } from "echarts/components"
import { CanvasRenderer } from "echarts/renderers"

// 注册必要的组件
echarts.use([TitleComponent, TooltipComponent, GridComponent, LegendComponent, DataZoomComponent, BarChart, LineChart, CanvasRenderer])

// 各研究所横向科研项目数据
const horizontalResearchData = [
  {
    institute: "畜牧兽医研究所",
    projectCount: 15,
    projectAmount: 1350,
    avgAmount: 90
  },
  {
    institute: "动物营养与饲料研究所",
    projectCount: 22,
    projectAmount: 1980,
    avgAmount: 90
  },
  {
    institute: "动物生物技术研究所",
    projectCount: 12,
    projectAmount: 960,
    avgAmount: 80
  },
  {
    institute: "农业生物技术研究所",
    projectCount: 18,
    projectAmount: 1620,
    avgAmount: 90
  },
  {
    institute: "农业经济与信息研究所",
    projectCount: 14,
    projectAmount: 1260,
    avgAmount: 90
  },
  {
    institute: "农业质量标准与检测技术研究所",
    projectCount: 8,
    projectAmount: 640,
    avgAmount: 80
  },
  {
    institute: "农村能源与生态研究所",
    projectCount: 6,
    projectAmount: 480,
    avgAmount: 80
  },
  {
    institute: "农产品加工研究所",
    projectCount: 5,
    projectAmount: 400,
    avgAmount: 80
  },
  {
    institute: "农业资源与环境研究所",
    projectCount: 10,
    projectAmount: 850,
    avgAmount: 85
  },
  {
    institute: "草地与生态研究所",
    projectCount: 9,
    projectAmount: 720,
    avgAmount: 80
  },
  {
    institute: "植物保护研究所",
    projectCount: 11,
    projectAmount: 990,
    avgAmount: 90
  },
  {
    institute: "作物资源研究所",
    projectCount: 16,
    projectAmount: 1440,
    avgAmount: 90
  },
  {
    institute: "经济植物研究所",
    projectCount: 7,
    projectAmount: 560,
    avgAmount: 80
  },
  {
    institute: "玉米研究所",
    projectCount: 20,
    projectAmount: 1800,
    avgAmount: 90
  },
  {
    institute: "水稻研究所",
    projectCount: 13,
    projectAmount: 1040,
    avgAmount: 80
  },
  {
    institute: "大豆研究所",
    projectCount: 17,
    projectAmount: 1530,
    avgAmount: 90
  },
  {
    institute: "花生研究所",
    projectCount: 6,
    projectAmount: 480,
    avgAmount: 80
  },
  {
    institute: "果树研究所",
    projectCount: 12,
    projectAmount: 1080,
    avgAmount: 90
  },
  {
    institute: "主粮工程研究中心",
    projectCount: 25,
    projectAmount: 2250,
    avgAmount: 90
  },
  {
    institute: "试验地综合服务中心",
    projectCount: 4,
    projectAmount: 320,
    avgAmount: 80
  },
  {
    institute: "洮南综合试验站",
    projectCount: 3,
    projectAmount: 240,
    avgAmount: 80
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

export default function DashboardHorizontalResearchProjectsChart() {
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

    const institutes = horizontalResearchData.map(item => item.institute);
    const projectCounts = horizontalResearchData.map(item => item.projectCount);
    const projectAmounts = horizontalResearchData.map(item => item.projectAmount);

    // 响应式配置函数
    const getResponsiveConfig = () => {
      // 获取容器宽度，如果获取不到则使用更保守的默认值
      let containerWidth = 400; // 默认值
      
      if (chartRef.current) {
        containerWidth = chartRef.current.clientWidth || chartRef.current.offsetWidth || 400;
      }
      
      // 如果容器宽度为0或很小，可能是还没有完全渲染，使用更保守的配置
      if (containerWidth <= 0 || containerWidth < 300) {
        containerWidth = 400; // 使用默认值
      }
      
      const isSmallScreen = containerWidth < 600;
      const isMediumScreen = containerWidth >= 600 && containerWidth < 900;
      
      return {
        isSmallScreen,
        isMediumScreen,
        fontSize: isSmallScreen ? 9 : isMediumScreen ? 10 : 11,
        labelFontSize: isSmallScreen ? 8 : isMediumScreen ? 9 : 10,
        rotate: isSmallScreen ? 45 : isMediumScreen ? 30 : 15,
        leftMargin: isSmallScreen ? 40 : isMediumScreen ? 50 : 60,
        rightMargin: isSmallScreen ? 40 : isMediumScreen ? 50 : 60,
        bottomMargin: institutes.length > 6 ? (isSmallScreen ? 60 : 80) : (isSmallScreen ? 30 : 40),
        barWidth: isSmallScreen ? '25%' : isMediumScreen ? '28%' : '30%',
        legendGap: isSmallScreen ? 10 : isMediumScreen ? 12 : 15,
        legendItemWidth: isSmallScreen ? 10 : isMediumScreen ? 11 : 12,
        legendItemHeight: isSmallScreen ? 6 : isMediumScreen ? 7 : 8
      };
    };

    const config = getResponsiveConfig();
    
    // 调试信息（开发环境）
    if (process.env.NODE_ENV === 'development') {
      console.log('图表响应式配置:', {
        containerWidth: chartRef.current?.clientWidth || 'unknown',
        isSmallScreen: config.isSmallScreen,
        fontSize: config.fontSize,
        rotate: config.rotate,
        leftMargin: config.leftMargin
      });
    }

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
          fontSize: config.isSmallScreen ? 10 : 12
        },
        formatter: function (params: TooltipParamType[]) {
          const dataIndex = params[0].dataIndex;
          const data = horizontalResearchData[dataIndex];
          
          const titleFontSize = config.isSmallScreen ? 12 : 14;
          const contentFontSize = config.isSmallScreen ? 10 : 12;
          const gap = config.isSmallScreen ? 3 : 4;
          const marginBottom = config.isSmallScreen ? 6 : 8;
          const marginRight = config.isSmallScreen ? 4 : 6;
          const dotSize = config.isSmallScreen ? 8 : 10;
          
          return `
            <div style="font-weight: 600; margin-bottom: ${marginBottom}px; color: #1f2937; font-size: ${titleFontSize}px;">
              ${data.institute}
            </div>
            <div style="display: flex; flex-direction: column; gap: ${gap}px;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="display: flex; align-items: center;">
                  <span style="display: inline-block; width: ${dotSize}px; height: ${dotSize}px; background: #3B82F6; border-radius: 2px; margin-right: ${marginRight}px;"></span>
                  项目数量：
                </span>
                <span style="font-weight: 600; color: #1f2937; font-size: ${contentFontSize}px;">${data.projectCount}个</span>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="display: flex; align-items: center;">
                  <span style="display: inline-block; width: ${dotSize}px; height: ${dotSize}px; background: #10B981; border-radius: 2px; margin-right: ${marginRight}px;"></span>
                  项目金额：
                </span>
                <span style="font-weight: 600; color: #1f2937; font-size: ${contentFontSize}px;">${data.projectAmount}万元</span>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="display: flex; align-items: center;">
                  <span style="display: inline-block; width: ${dotSize}px; height: ${dotSize}px; background: #F59E0B; border-radius: 2px; margin-right: ${marginRight}px;"></span>
                  平均单价：
                </span>
                <span style="font-weight: 600; color: #1f2937; font-size: ${contentFontSize}px;">${data.avgAmount}万元/项</span>
              </div>
            </div>
          `;
        }
      },
      legend: {
        data: ['项目数量', '项目金额'],
        top: 'top',
        left: 'center',
        itemGap: config.legendGap,
        textStyle: {
          color: '#64748B',
          fontSize: config.fontSize
        },
        itemWidth: config.legendItemWidth,
        itemHeight: config.legendItemHeight,
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
          bottom: config.isSmallScreen ? 15 : 20,
          height: config.isSmallScreen ? 15 : 18,
          borderColor: '#E2E8F0',
          fillerColor: 'rgba(59, 130, 246, 0.15)',
          handleStyle: {
            color: '#3B82F6',
            borderColor: '#3B82F6'
          },
          textStyle: {
            color: '#64748B',
            fontSize: config.isSmallScreen ? 8 : 9
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
        left: config.leftMargin,
        right: config.rightMargin,
        bottom: config.bottomMargin, // 当有滚动条时为X轴标签和滚动轴预留空间
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
            fontSize: config.labelFontSize,
            interval: 0,
            rotate: config.rotate,
            margin: config.isSmallScreen ? 8 : 10
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
          name: '项目数量（个）',
          position: 'left',
          nameLocation: 'middle',
          nameGap: config.isSmallScreen ? 25 : 35,
          nameTextStyle: {
            color: '#64748B',
            fontSize: config.fontSize
          },
          axisLabel: {
            color: '#64748B',
            fontSize: config.labelFontSize,
            formatter: '{value}',
            margin: config.isSmallScreen ? 6 : 8
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
          name: '项目金额（万元）',
          position: 'right',
          nameLocation: 'middle',
          nameGap: config.isSmallScreen ? 25 : 35,
          nameTextStyle: {
            color: '#64748B',
            fontSize: config.fontSize
          },
          axisLabel: {
            color: '#64748B',
            fontSize: config.labelFontSize,
            formatter: '{value}',
            margin: config.isSmallScreen ? 6 : 8
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
          name: '项目数量',
          type: 'bar',
          yAxisIndex: 0,
          data: projectCounts,
          itemStyle: {
            color: '#3B82F6',
            borderRadius: [3, 3, 0, 0]
          },
          barWidth: config.barWidth,
          emphasis: {
            itemStyle: {
              color: '#2563EB'
            }
          }
        },
        {
          name: '项目金额',
          type: 'line',
          yAxisIndex: 1,
          data: projectAmounts,
          lineStyle: {
            color: '#10B981',
            width: 3
          },
          itemStyle: {
            color: '#10B981',
            borderWidth: 2,
            borderColor: '#fff'
          },
          symbol: 'circle',
          symbolSize: 8,
          emphasis: {
            itemStyle: {
              color: '#059669',
              borderColor: '#fff',
              borderWidth: 2,
              shadowBlur: 8,
              shadowColor: 'rgba(5, 150, 105, 0.4)'
            },
            lineStyle: {
              width: 4
            }
          }
        }
      ],
      animation: true,
      animationDuration: 1000,
      animationEasing: 'cubicOut' as const
    };

    chartInstance.current.setOption(option);

    // 响应式处理函数
    const handleResize = () => {
      if (chartInstance.current && chartRef.current) {
        // 重新计算响应式配置
        const newConfig = getResponsiveConfig();
        
        // 调试信息（开发环境）
        if (process.env.NODE_ENV === 'development') {
          console.log('图表resize - 响应式配置:', {
            containerWidth: chartRef.current.clientWidth,
            isSmallScreen: newConfig.isSmallScreen,
            fontSize: newConfig.fontSize,
            rotate: newConfig.rotate
          });
        }
        
        // 更新图表配置
        const newOption = {
          ...option,
          legend: {
            ...option.legend,
            itemGap: newConfig.legendGap,
            textStyle: {
              ...option.legend.textStyle,
              fontSize: newConfig.fontSize
            },
            itemWidth: newConfig.legendItemWidth,
            itemHeight: newConfig.legendItemHeight
          },
          grid: {
            ...option.grid,
            left: newConfig.leftMargin,
            right: newConfig.rightMargin,
            bottom: newConfig.bottomMargin
          },
          xAxis: [{
            ...option.xAxis[0],
            axisLabel: {
              ...option.xAxis[0].axisLabel,
              fontSize: newConfig.labelFontSize,
              rotate: newConfig.rotate,
              margin: newConfig.isSmallScreen ? 8 : 10
            }
          }],
          yAxis: [
            {
              ...option.yAxis[0],
              nameGap: newConfig.isSmallScreen ? 25 : 35,
              nameTextStyle: {
                ...option.yAxis[0].nameTextStyle,
                fontSize: newConfig.fontSize
              },
              axisLabel: {
                ...option.yAxis[0].axisLabel,
                fontSize: newConfig.labelFontSize,
                margin: newConfig.isSmallScreen ? 6 : 8
              }
            },
            {
              ...option.yAxis[1],
              nameGap: newConfig.isSmallScreen ? 25 : 35,
              nameTextStyle: {
                ...option.yAxis[1].nameTextStyle,
                fontSize: newConfig.fontSize
              },
              axisLabel: {
                ...option.yAxis[1].axisLabel,
                fontSize: newConfig.labelFontSize,
                margin: newConfig.isSmallScreen ? 6 : 8
              }
            }
          ],
          series: [
            {
              ...option.series[0],
              barWidth: newConfig.barWidth
            },
            option.series[1]
          ]
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
  }, []);

  return <div ref={chartRef} className="w-full h-full" />;
} 