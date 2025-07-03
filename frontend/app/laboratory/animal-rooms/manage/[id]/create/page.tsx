"use client"

import { use } from "react"
import { AnimalRoomFeedingManageForm } from "./components/animal-room-feeding-manage-form"

export default function CreateAnimalRoomFeedingManagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  return <AnimalRoomFeedingManageForm roomId={id} />
} 