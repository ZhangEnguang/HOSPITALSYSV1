"use client"

import { ConsumableEditForm } from "./components/consumable-edit-form"

interface EditConsumablePageProps {
  params: {
    id: string
  }
}

export default function EditConsumablePage({ params }: EditConsumablePageProps) {
  return <ConsumableEditForm consumableId={params.id} />
} 