export interface Task {
  id: string;
  description: string;
  status: "open" | "in progress" | "completed";
  agentId?: string;
}

export interface Agent {
  id: string;
  color: string;
  role?: string;
  tasks?: Task[];
}

export interface Message {
  id: string;
  senderId: string;
  sender?: string;
  display_name?: string;
  timestamp: Date;
  content: string;
  type?: string;
}
