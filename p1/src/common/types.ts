// types.ts - Define types for agent communication and server interaction

// Example type
import { z } from "zod";

export interface Agent {
  agent_id: string;
  color: string;
}

// Define other types as needed
export const noArgSchema = z.object({})

export const addMessageSchema = z.object({
  senderId: z.string().nonempty("Sender ID is required"),
  content: z.string().nonempty("Content is required"),
});

export const agentWaitSchema =
  z.object({ seconds: z.number().min(0) })
