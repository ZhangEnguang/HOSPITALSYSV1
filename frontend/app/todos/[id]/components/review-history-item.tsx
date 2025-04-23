import type { FC } from "react"

interface ReviewHistoryItemProps {
  date: string
  user: string
  action: string
  comment: string
}

const ReviewHistoryItem: FC<ReviewHistoryItemProps> = ({ date, user, action, comment }) => {
  return (
    <div className="text-sm border-l-2 border-primary pl-3 py-1">
      <div className="flex justify-between">
        <span className="font-medium">{action}</span>
        <span className="text-muted-foreground text-xs">{date}</span>
      </div>
      <div className="text-xs text-muted-foreground mb-1">{user}</div>
      <div className="text-xs">{comment}</div>
    </div>
  )
}

export default ReviewHistoryItem

