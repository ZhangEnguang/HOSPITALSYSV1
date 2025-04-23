export enum AchievementType {
  Personal = 'personal',
  Team = 'team',
  Department = 'department'
}

export enum AchievementStatus {
  Pending = 'pending',
  Approved = 'approved',
  Rejected = 'rejected'
}

export interface Achievement {
  id: string;
  name: string;
  type: AchievementType;
  status: AchievementStatus;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FilterOption {
  id: string;
  label: string;
  value: string;
  category: string;
  options: {
    id: string;
    label: string;
    value: string;
  }[];
}

export interface TableAction {
  id: string;
  label: string;
  variant: 'default' | 'destructive' | 'outline' | 'secondary';
  onClick: () => void;
} 