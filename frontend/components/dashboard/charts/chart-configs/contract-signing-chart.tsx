"use client"
import { FileCodeIcon as FileContract } from "lucide-react"
import ReactECharts from "echarts-for-react"
import { useEffect, useState } from "react"

export const contractSigningChart = {
  id: "contract-signing",
  title: "合同签订情况",
  description: "项目合同签订统计",
  type: "pie",
  icon: <FileContract className="h-4 w-4" />,
  size: "medium",
  renderChart: () => {
    const [chartReady, setChartReady] = useState(false)

    useEffect(() => {
      // 延迟设置图表准备状态，确保容器已完全渲染
      const timer = setTimeout(() => {
        setChartReady(true)
      }, 100)

      return () => clearTimeout(timer)
    }, [])

    const options = {
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b}: {c} ({d}%)",
      },
      legend: {
        orient: "vertical",
        right: 10,
        top: "center",
        data: ["横向项目", "纵向项目", "校内项目", "国际合作"],
      },
      series: [
        {
          name: "合同签订",
          type: "pie",
          radius: ["50%", "70%"],
          center: ["50%", "50%"], // 确保居中
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: "#fff",
            borderWidth: 2,
          },
          label: {
            show: false,
            position: "center",
          },
          emphasis: {
            label: {
              show: true,
              fontSize: "18",
              fontWeight: "bold",
            },
          },
          labelLine: {
            show: false,
          },
          data: [
            { value: 335, name: "横向项目", itemStyle: { color: "#F97F7F" } },
            { value: 310, name: "纵向项目", itemStyle: { color: "#8AD7FC" } },
            { value: 234, name: "校内项目", itemStyle: { color: "#7275F2" } },
            { value: 135, name: "国际合作", itemStyle: { color: "#0095FF" } },
          ],
        },
      ],
    }

    return (
      <div className="w-full h-full flex items-center justify-center">
        {chartReady && (
          <ReactECharts
            option={options}
            style={{ height: "100%", width: "100%" }}
            opts={{ renderer: "canvas" }}
            notMerge={true}
            lazyUpdate={false}
            onEvents={{}}
          />
        )}
      </div>
    )
  },
}

