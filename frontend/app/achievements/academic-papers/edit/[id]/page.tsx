"use client"

import { AcademicPapersEditForm } from "./components/academic-papers-edit-form"

export default function EditAcademicPapersPage({ params }: { params: { id: string } }) {
  const paperId = params.id
  
  return <AcademicPapersEditForm id={paperId} />
} 