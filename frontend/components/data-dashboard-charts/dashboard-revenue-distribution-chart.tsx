"use client"

import { useEffect, useRef, useState } from "react"
import * as echarts from "echarts/core"
import { BarChart } from "echarts/charts"
import { TitleComponent, TooltipComponent, GridComponent, LegendComponent, DataZoomComponent } from "echarts/components"
import { CanvasRenderer } from "echarts/renderers"
import { Button } from "@/components/ui/button"

// 注册必要的组件
echarts.use([TitleComponent, TooltipComponent, GridComponent, LegendComponent, DataZoomComponent, BarChart, CanvasRenderer])

// 收益分配数据 - 多年度数据，增加更多研究所
const revenueDistributionData = {
  "2022": [
    {
      institute: "畜牧兽医研究所",
      totalRevenue: 1800,
      instituteFunds: 1080, // 到院经费 60%
      managementFee: 180,   // 院提费用 10%
      netAmount: 360,       // 净额 20%
      teamReward: 180       // 团队奖励 10%
    },
    {
      institute: "动物营养与饲料研究所",
      totalRevenue: 2200,
      instituteFunds: 1320,
      managementFee: 220,
      netAmount: 440,
      teamReward: 220
    },
    {
      institute: "动物生物技术研究所",
      totalRevenue: 1600,
      instituteFunds: 960,
      managementFee: 160,
      netAmount: 320,
      teamReward: 160
    },
    {
      institute: "农业生物技术研究所",
      totalRevenue: 1950,
      instituteFunds: 1170,
      managementFee: 195,
      netAmount: 390,
      teamReward: 195
    },
    {
      institute: "农业经济与信息研究所",
      totalRevenue: 1700,
      instituteFunds: 1020,
      managementFee: 170,
      netAmount: 340,
      teamReward: 170
    },
    {
      institute: "农业质量标准与检测技术研究所",
      totalRevenue: 1300,
      instituteFunds: 780,
      managementFee: 130,
      netAmount: 260,
      teamReward: 130
    },
    {
      institute: "农村能源与生态研究所",
      totalRevenue: 1100,
      instituteFunds: 660,
      managementFee: 110,
      netAmount: 220,
      teamReward: 110
    },
    {
      institute: "农产品加工研究所",
      totalRevenue: 950,
      instituteFunds: 570,
      managementFee: 95,
      netAmount: 190,
      teamReward: 95
    }
  ],
  "2023": [
    {
      institute: "畜牧兽医研究所",
      totalRevenue: 2100,
      instituteFunds: 1260,
      managementFee: 210,
      netAmount: 420,
      teamReward: 210
    },
    {
      institute: "动物营养与饲料研究所",
      totalRevenue: 2650,
      instituteFunds: 1590,
      managementFee: 265,
      netAmount: 530,
      teamReward: 265
    },
    {
      institute: "动物生物技术研究所",
      totalRevenue: 1850,
      instituteFunds: 1110,
      managementFee: 185,
      netAmount: 370,
      teamReward: 185
    },
    {
      institute: "农业生物技术研究所",
      totalRevenue: 2350,
      instituteFunds: 1410,
      managementFee: 235,
      netAmount: 470,
      teamReward: 235
    },
    {
      institute: "农业经济与信息研究所",
      totalRevenue: 2000,
      instituteFunds: 1200,
      managementFee: 200,
      netAmount: 400,
      teamReward: 200
    },
    {
      institute: "农业质量标准与检测技术研究所",
      totalRevenue: 1500,
      instituteFunds: 900,
      managementFee: 150,
      netAmount: 300,
      teamReward: 150
    },
    {
      institute: "农村能源与生态研究所",
      totalRevenue: 1350,
      instituteFunds: 810,
      managementFee: 135,
      netAmount: 270,
      teamReward: 135
    },
    {
      institute: "农产品加工研究所",
      totalRevenue: 1100,
      instituteFunds: 660,
      managementFee: 110,
      netAmount: 220,
      teamReward: 110
    }
  ],
  "2024": [
    {
      institute: "畜牧兽医研究所",
      totalRevenue: 2800,
      instituteFunds: 1680,
      managementFee: 280,
      netAmount: 560,
      teamReward: 280
    },
    {
      institute: "动物营养与饲料研究所",
      totalRevenue: 3200,
      instituteFunds: 1920,
      managementFee: 320,
      netAmount: 640,
      teamReward: 320
    },
    {
      institute: "动物生物技术研究所",
      totalRevenue: 1950,
      instituteFunds: 1170,
      managementFee: 195,
      netAmount: 390,
      teamReward: 195
    },
    {
      institute: "农业生物技术研究所",
      totalRevenue: 2350,
      instituteFunds: 1410,
      managementFee: 235,
      netAmount: 470,
      teamReward: 235
    },
    {
      institute: "农业经济与信息研究所",
      totalRevenue: 2200,
      instituteFunds: 1320,
      managementFee: 220,
      netAmount: 440,
      teamReward: 220
    },
    {
      institute: "农业质量标准与检测技术研究所",
      totalRevenue: 1650,
      instituteFunds: 990,
      managementFee: 165,
      netAmount: 330,
      teamReward: 165
    },
    {
      institute: "农村能源与生态研究所",
      totalRevenue: 1500,
      instituteFunds: 900,
      managementFee: 150,
      netAmount: 300,
      teamReward: 150
    },
    {
      institute: "农产品加工研究所",
      totalRevenue: 1250,
      instituteFunds: 750,
      managementFee: 125,
      netAmount: 250,
      teamReward: 125
    },
    {
      institute: "农业资源与环境研究所",
      totalRevenue: 1800,
      instituteFunds: 1080,
      managementFee: 180,
      netAmount: 360,
      teamReward: 180
    },
    {
      institute: "草地与生态研究所",
      totalRevenue: 1400,
      instituteFunds: 840,
      managementFee: 140,
      netAmount: 280,
      teamReward: 140
    },
    {
      institute: "植物保护研究所",
      totalRevenue: 1900,
      instituteFunds: 1140,
      managementFee: 190,
      netAmount: 380,
      teamReward: 190
    },
    {
      institute: "作物资源研究所",
      totalRevenue: 2100,
      instituteFunds: 1260,
      managementFee: 210,
      netAmount: 420,
      teamReward: 210
    },
    {
      institute: "经济植物研究所",
      totalRevenue: 1200,
      instituteFunds: 720,
      managementFee: 120,
      netAmount: 240,
      teamReward: 120
    },
    {
      institute: "玉米研究所",
      totalRevenue: 2600,
      instituteFunds: 1560,
      managementFee: 260,
      netAmount: 520,
      teamReward: 260
    },
    {
      institute: "水稻研究所",
      totalRevenue: 2000,
      instituteFunds: 1200,
      managementFee: 200,
      netAmount: 400,
      teamReward: 200
    },
    {
      institute: "大豆研究所",
      totalRevenue: 2400,
      instituteFunds: 1440,
      managementFee: 240,
      netAmount: 480,
      teamReward: 240
    },
    {
      institute: "花生研究所",
      totalRevenue: 1100,
      instituteFunds: 660,
      managementFee: 110,
      netAmount: 220,
      teamReward: 110
    },
    {
      institute: "果树研究所",
      totalRevenue: 1700,
      instituteFunds: 1020,
      managementFee: 170,
      netAmount: 340,
      teamReward: 170
    },
    {
      institute: "主粮工程研究中心",
      totalRevenue: 3500,
      instituteFunds: 2100,
      managementFee: 350,
      netAmount: 700,
      teamReward: 350
    },
    {
      institute: "试验地综合服务中心",
      totalRevenue: 800,
      instituteFunds: 480,
      managementFee: 80,
      netAmount: 160,
      teamReward: 80
    },
    {
      institute: "洮南综合试验站",
      totalRevenue: 600,
      instituteFunds: 360,
      managementFee: 60,
      netAmount: 120,
      teamReward: 60
    }
  ]
};

const years = Object.keys(revenueDistributionData);
const institutes = revenueDistributionData["2024"].map(item => item.institute);

interface TooltipParamType {
  name: string;
  marker: string;
  seriesName: string;
  value: number;
  dataIndex: number;
  seriesIndex: number;
}

export default function DashboardRevenueDistributionChart() {
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

    const currentData = revenueDistributionData["2024"];
    const institutes = currentData.map(item => item.institute);
    
    const instituteFundsData = currentData.map(item => item.instituteFunds);
    const managementFeeData = currentData.map(item => item.managementFee);
    const netAmountData = currentData.map(item => item.netAmount);
    const teamRewardData = currentData.map(item => item.teamReward);

    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
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
          const data = currentData[dataIndex];
          
          return `
            <div style="font-weight: 600; margin-bottom: 10px; color: #1f2937; font-size: 14px;">
              ${data.institute} (2024年)
            </div>
            <div style="display: flex; flex-direction: column; gap: 6px;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-weight: 600; color: #1f2937;">总收益：</span>
                <span style="font-weight: 600; color: #1f2937;">${data.totalRevenue}万元</span>
              </div>
              <div style="border-top: 1px solid #E5E7EB; margin: 6px 0;"></div>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="display: flex; align-items: center;">
                  <span style="display: inline-block; width: 10px; height: 10px; background: #3B82F6; border-radius: 2px; margin-right: 8px;"></span>
                  到院经费：
                </span>
                <span style="font-weight: 600; color: #1f2937;">${data.instituteFunds}万元 (${Math.round((data.instituteFunds/data.totalRevenue)*100)}%)</span>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="display: flex; align-items: center;">
                  <span style="display: inline-block; width: 10px; height: 10px; background: #F59E0B; border-radius: 2px; margin-right: 8px;"></span>
                  院提费用：
                </span>
                <span style="font-weight: 600; color: #1f2937;">${data.managementFee}万元 (${Math.round((data.managementFee/data.totalRevenue)*100)}%)</span>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="display: flex; align-items: center;">
                  <span style="display: inline-block; width: 10px; height: 10px; background: #10B981; border-radius: 2px; margin-right: 8px;"></span>
                  净额：
                </span>
                <span style="font-weight: 600; color: #1f2937;">${data.netAmount}万元 (${Math.round((data.netAmount/data.totalRevenue)*100)}%)</span>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="display: flex; align-items: center;">
                  <span style="display: inline-block; width: 10px; height: 10px; background: #8B5CF6; border-radius: 2px; margin-right: 8px;"></span>
                  团队奖励：
                </span>
                <span style="font-weight: 600; color: #1f2937;">${data.teamReward}万元 (${Math.round((data.teamReward/data.totalRevenue)*100)}%)</span>
              </div>
            </div>
          `;
        }
      },
      legend: {
        data: ['到院经费', '院提费用', '净额', '团队奖励'],
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
        right: 40,
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
            fontSize: 9,
            interval: 0,
            rotate: 25,
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
          name: '收益金额（万元）',
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
        }
      ],
      series: [
        {
          name: '到院经费',
          type: 'bar',
          stack: 'revenue',
          data: instituteFundsData,
          barWidth: '40%',
          itemStyle: {
            color: '#3B82F6',
            borderRadius: [0, 0, 0, 0]
          },
          emphasis: {
            itemStyle: {
              color: '#2563EB'
            }
          }
        },
        {
          name: '院提费用',
          type: 'bar',
          stack: 'revenue',
          data: managementFeeData,
          itemStyle: {
            color: '#F59E0B',
            borderRadius: [0, 0, 0, 0]
          },
          emphasis: {
            itemStyle: {
              color: '#D97706'
            }
          }
        },
        {
          name: '净额',
          type: 'bar',
          stack: 'revenue',
          data: netAmountData,
          itemStyle: {
            color: '#10B981',
            borderRadius: [0, 0, 0, 0]
          },
          emphasis: {
            itemStyle: {
              color: '#059669'
            }
          }
        },
        {
          name: '团队奖励',
          type: 'bar',
          stack: 'revenue',
          data: teamRewardData,
          itemStyle: {
            color: '#8B5CF6', // 改为紫色
            borderRadius: [3, 3, 0, 0]
          },
          emphasis: {
            itemStyle: {
              color: '#7C3AED' // 改为深紫色
            }
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

  return (
    <div className="w-full h-full">
      <div ref={chartRef} className="w-full h-full" />
    </div>
  );
} 