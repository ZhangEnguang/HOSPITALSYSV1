"use client"

import { use } from "react"
import { AnimalRoomMonitoringDashboard } from "./components/animal-room-monitoring-dashboard"

export default function AnimalRoomMonitoringPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  return <AnimalRoomMonitoringDashboard roomId={id} />
} 