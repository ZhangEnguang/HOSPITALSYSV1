"use client"

import { EvaluatedAchievementsEditForm } from "./components/evaluated-achievements-edit-form"

interface EditEvaluatedAchievementPageProps {
  params: {
    id: string
  }
}

export default function EditEvaluatedAchievementPage({ params }: EditEvaluatedAchievementPageProps) {
  return (
    <div className="w-full py-6 px-6">
      <EvaluatedAchievementsEditForm id={params.id} />
    </div>
  )
}
