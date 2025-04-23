"use client"

import React from "react"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"
import { Doughnut } from "react-chartjs-2"

ChartJS.register(ArcElement, Tooltip, Legend)

interface DoughnutChartProps {
  data: {
    name: string;
    value: number;
  }[];
}

export default function DoughnutChart({ data }: DoughnutChartProps) {
  // 设置浅蓝色渐变色系
  const blueGradients = [
    'rgba(23, 209, 255, 0.8)',
    'rgba(55, 226, 213, 0.8)',
    'rgba(90, 200, 250, 0.8)',
    'rgba(130, 160, 255, 0.8)',
    'rgba(52, 104, 255, 0.7)'
  ];

  const chartData = {
    labels: data.map((item) => item.name),
    datasets: [
      {
        data: data.map((item) => item.value),
        backgroundColor: blueGradients,
        borderColor: blueGradients.map(color => color.replace(/[\d.]+\)$/, '1)')),
        borderWidth: 1,
        borderRadius: 5,
        hoverOffset: 10,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          padding: 20,
          boxWidth: 10,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
    cutout: '70%',
    animation: {
      animateScale: true,
      animateRotate: true
    }
  }

  return <Doughnut data={chartData} options={options} />
}

