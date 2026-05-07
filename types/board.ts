export interface User {
  id: string;
  name: string;
  avatar?: string;
  email?: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
}

export interface Card {
  id: string;
  title: string;
  description: string;
  labels: string[];
  assignees: string[];
  dueDate?: string;
  priority?: "low" | "medium" | "high";
  attachments?: Attachment[];
  comments?: Comment[];
  // Cliente vinculado
  clientId?: string;
  clientName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Column {
  id: string;
  title: string;
  color?: string; // Cor da coluna (opcional)
  cards: Card[];
}

export interface Board {
  id: string;
  title: string;
  columns: Column[];
  members: User[];
  availableLabels: string[];
}
