"use client"

import { EquipmentEditForm } from "./components/equipment-edit-form"

export default function EditEquipmentPage({ params }: { params: { id: string } }) {
  return <EquipmentEditForm equipmentId={params.id} />
} 