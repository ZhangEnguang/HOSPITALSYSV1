export enum FieldType {
  TEXT = "text",
  NUMBER = "number",
  SELECT = "select",
  DATE = "date",
  BOOLEAN = "boolean",
  DATETIME = "datetime",
  FILE = "file",
  TEXTAREA = "textarea",
  TAGS = "tags",
  RATING = "rating",
  USER = "user",
  STATUS = "status",
}

export interface FilterOption {
  label: string
  value: string | number | boolean
}

export interface FilterModel {
  name: string
  label: string
  type: FieldType
  options?: FilterOption[]
  defaultValue?: any
}

