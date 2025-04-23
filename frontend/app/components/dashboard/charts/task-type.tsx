import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

const options = {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: 'y' as const,
  plugins: {
    legend: {
      position: 'top' as const,
    },
  },
  scales: {
    x: {
      beginAtZero: true,
      grid: {
        display: true,
        color: 'rgba(0, 0, 0, 0.1)',
      },
    },
    y: {
      grid: {
        display: false,
      },
    },
  },
}

const data = {
  labels: ['研发任务', '测试任务', '文档任务', '会议任务', '其他任务'],
  datasets: [
    {
      label: '任务数量',
      data: [45, 35, 25, 20, 15],
      backgroundColor: 'rgba(54, 162, 235, 0.5)',
      borderColor: 'rgb(54, 162, 235)',
      borderWidth: 1,
    },
  ],
}

export function TaskTypeChart() {
  return (
    <div className="h-[300px]">
      <Bar options={options} data={data} />
    </div>
  )
} 