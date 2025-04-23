"use client"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Globe, Type } from "lucide-react"
import { Button } from "@/components/ui/button"

interface GeneralTabProps {
  fontSize: string
  language: string
  onFontSizeChange: (size: string) => void
  onLanguageChange: (language: string) => void
}

export default function GeneralTab({ fontSize, language, onFontSizeChange, onLanguageChange }: GeneralTabProps) {
  const fontSizes = [
    { id: "small", name: "小", factor: "0.9" },
    { id: "medium", name: "中", factor: "1" },
    { id: "large", name: "大", factor: "1.1" },
    { id: "xlarge", name: "特大", factor: "1.2" },
  ]

  const languages = [
    { id: "zh", name: "中文" },
    { id: "en", name: "English" },
  ]

  return (
    <div className="space-y-4 py-4">
      <div className="space-y-4">
        <div className="flex items-center">
          <Globe className="mr-2 h-5 w-5" />
          <h3 className="text-sm font-medium">语言</h3>
        </div>

        <div className="flex gap-2">
          {languages.map((lang) => (
            <Button
              key={lang.id}
              variant={language === lang.id ? "default" : "outline"}
              onClick={() => onLanguageChange(lang.id)}
              className="flex items-center gap-2"
            >
              <Globe className="h-4 w-4" />
              <span>{lang.name}</span>
            </Button>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t"></div>

      <div className="space-y-4">
        <div className="flex items-center">
          <Type className="mr-2 h-5 w-5" />
          <h3 className="text-sm font-medium">字体大小</h3>
        </div>

        <RadioGroup value={fontSize} onValueChange={onFontSizeChange} className="grid grid-cols-2 gap-2">
          {fontSizes.map((size) => (
            <div key={size.id} className="flex items-center space-x-2 rounded-md border p-3 cursor-pointer">
              <RadioGroupItem value={size.id} id={`font-${size.id}`} />
              <Label
                htmlFor={`font-${size.id}`}
                className="cursor-pointer flex-1"
                style={{ fontSize: `calc(1rem * ${size.factor})` }}
              >
                {size.name}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  )
}

