export interface Itask {
  tasks: Task[];
  meta: Meta;
}

export interface Meta {
  totalCount: number;
  lastUpdated: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate: string;
  assignee: Assignee;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  isOverdue?: boolean;
  completedAt?: string;
}

export interface Assignee {
  id: string;
  name: string;
  avatar: string;
  email: string;
}
