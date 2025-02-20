import { z } from "zod";

export const noArgSchema = z.object({});

export const addMessageSchema = z.object({
  senderId: z.string().nonempty("Sender ID is required"),
  content: z.string().nonempty("Content is required"),
});

export const agentWaitSchema = z.object({ seconds: z.number().min(0) });

export const agentLeaveSchema = z.object({
  id: z.string().nonempty("Agent ID is required"),
});

export const addTaskSchema = z.object({
  description: z.string(),
});

export const completeTaskSchema = z.object({
  taskId: z.string(),
});

export const assignTaskSchema = z.object({
  taskId: z.string(),
  agentId: z.string(),
});
