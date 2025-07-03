"use client"

import { use } from "react"
import { AnimalRoomManageForm } from "./components/animal-room-manage-form"

export default function ManageAnimalRoomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  return <AnimalRoomManageForm roomId={id} />
} 