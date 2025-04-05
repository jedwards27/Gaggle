import { NotificationSchema } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

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

export interface Project {
  id: string;
  name: string;
  description?: string;
  createdAt: number;
}

// Define the schema for message notifications
export const MessageAddNotificationSchema = NotificationSchema.extend({
  method: z.literal('notifications/message/add'),
  params: z.object({
    message: z.object({
      senderId: z.string(),
      content: z.string(),
      timestamp: z.string().optional(),
      type: z.string().optional(),
      color: z.string().optional(),
      display_name: z.string().optional()
    })
  })
});