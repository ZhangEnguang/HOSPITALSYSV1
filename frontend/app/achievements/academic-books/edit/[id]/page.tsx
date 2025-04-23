"use client"

import { AcademicBooksEditForm } from "./components/academic-books-edit-form"

export default function EditAcademicBooksPage({ params }: { params: { id: string } }) {
  const bookId = params.id
  
  return <AcademicBooksEditForm id={bookId} />
} 