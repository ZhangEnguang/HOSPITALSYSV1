"use client"

import { use } from "react"
import { AnimalRoomEditForm } from "./components/animal-room-edit-form"

export default function EditAnimalRoomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  return <AnimalRoomEditForm roomId={id} />
} 