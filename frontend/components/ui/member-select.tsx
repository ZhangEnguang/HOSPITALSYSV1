import * as React from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export interface Member {
  id: string
  name: string
}

interface MemberSelectProps {
  value?: string
  onChange?: (value: string) => void
  members?: Member[]
  placeholder?: string
}

export function MemberSelect({ value, onChange, members = [], placeholder = "选择成员" }: MemberSelectProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {members.map((member) => (
          <SelectItem key={member.id} value={member.id}>
            {member.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
} 