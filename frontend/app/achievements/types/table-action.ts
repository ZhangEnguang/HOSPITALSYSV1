import { Achievement } from './achievement'

export interface TableAction {
  id: string;
  key: string;
  label: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary';
  onClick: (item: Achievement) => void;
}

export interface TableActionHandler {
  (selectedRows: Achievement[], action: TableAction): Promise<void>
}

export interface BatchActionResult {
  success: boolean
  message: string
} 