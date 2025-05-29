"use client"

import { ReagentEditForm } from "./components/reagent-edit-form"

interface PageProps {
  params: {
    id: string
  }
}

export default function EditReagentPage({ params }: PageProps) {
  return <ReagentEditForm reagentId={params.id} />
} 