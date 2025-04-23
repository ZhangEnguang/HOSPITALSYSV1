import type React from "react"
export interface SearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export interface SearchResultItem {
  id: string
  text: string
  description?: string
  category?: string
  url?: string
  icon?: React.ReactNode
  type?: string
  avatar?: string
  extraInfo?: string
  age?: number
}

export interface SearchResultsProps {
  query: string
  selectedResultIndex: number
  onSelectResult: (result: SearchResultItem) => void
  onHoverResult: (index: number) => void
  resultsRef: React.RefObject<HTMLDivElement>
  flatResultsRef: React.RefObject<SearchResultItem[]>
}

export interface SearchResultCategoryProps {
  title: string
  icon: React.ReactNode
  items: SearchResultItem[]
  selectedResultIndex: number
  startIndex: number
  onSelectResult: (result: SearchResultItem) => void
  onHoverResult: (index: number) => void
}

