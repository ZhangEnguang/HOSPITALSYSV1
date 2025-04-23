"use client"

import type React from "react"

import { useState, useRef } from "react"
import { X, Check, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface TagsInputProps {
  availableTags: string[]
  selectedTags?: string[]
  onTagsChange: (tags: string[]) => void
  placeholder?: string
  className?: string
}

export default function TagsInput({
  availableTags = [],
  selectedTags = [],
  onTagsChange,
  placeholder = "选择标签...",
  className,
}: TagsInputProps) {
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  // Filter available tags based on input value and already selected tags
  const filteredTags = availableTags.filter(
    (tag) => tag.toLowerCase().includes(inputValue.toLowerCase()) && !selectedTags.includes(tag),
  )

  // Add a tag
  const addTag = (tag: string) => {
    if (tag && !selectedTags.includes(tag)) {
      onTagsChange([...selectedTags, tag])
      setInputValue("")
    }
  }

  // Remove a tag
  const removeTag = (tag: string) => {
    onTagsChange(selectedTags.filter((t) => t !== tag))
  }

  // Create a new tag from input
  const createNewTag = () => {
    if (inputValue.trim() && !selectedTags.includes(inputValue.trim())) {
      addTag(inputValue.trim())
      setOpen(false)
    }
  }

  // Handle keyboard events
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && inputValue) {
      e.preventDefault()
      createNewTag()
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {selectedTags.map((tag) => (
          <Badge key={tag} variant="secondary" className="px-2 py-1">
            {tag}
            <button
              className="ml-1 rounded-full outline-none focus:ring-2 focus:ring-primary"
              onClick={() => removeTag(tag)}
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Remove {tag}</span>
            </button>
          </Badge>
        ))}
      </div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
            onClick={() => {
              setOpen(true)
              setTimeout(() => inputRef.current?.focus(), 0)
            }}
          >
            <input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
              placeholder={selectedTags.length === 0 ? placeholder : "添加更多标签..."}
            />
          </div>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-[300px]" align="start">
          <Command>
            <CommandInput placeholder="搜索标签..." value={inputValue} onValueChange={setInputValue} />
            <CommandList>
              <CommandEmpty>
                {inputValue ? (
                  <button className="flex w-full items-center gap-2 p-2 text-sm hover:bg-accent" onClick={createNewTag}>
                    <Plus className="h-4 w-4" />
                    创建 "{inputValue}" 标签
                  </button>
                ) : (
                  <p className="p-2 text-sm text-center text-muted-foreground">没有找到标签</p>
                )}
              </CommandEmpty>
              <CommandGroup>
                {filteredTags.map((tag) => (
                  <CommandItem
                    key={tag}
                    value={tag}
                    onSelect={() => {
                      addTag(tag)
                      setOpen(false)
                    }}
                  >
                    <div className="flex items-center gap-2">
                      {tag}
                      {selectedTags.includes(tag) && <Check className="h-4 w-4 text-primary" />}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}

