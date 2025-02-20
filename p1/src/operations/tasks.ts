import TaskStore from "../stores/TaskStore.ts";
import AgentStore from "../stores/AgentStore.ts";
import { Task } from "../common/types.js";

interface AssignTaskParams {
  taskId: string;
  agentId: string;
}

/**
 * Add Task
 * @param description
 */
export const addTask = (description: string): { id: string } => {
  if (!description) {
    throw new Error("Task description is required");
  }

  return TaskStore.addTask(description);
};

/**
 * List Tasks
 */
export const listTasks = (): Task[] => {
  return TaskStore.listTasks();
};

/**
 * Assign Task
 * @param taskId
 * @param agentId
 */
export const assignTask = ({ taskId, agentId }: AssignTaskParams): void => {
  if (!taskId || !agentId) {
    throw new Error("Task ID and Agent ID are required");
  }

  const task = TaskStore.getTask(taskId);
  const agent = AgentStore.getAgent(agentId);

  if (!task) {
    throw new Error(`Task with ID ${taskId} not found`);
  }

  if (!agent) {
    throw new Error(`Agent with ID ${agentId} not found`);
  }

  TaskStore.updateTask(taskId, { agentId: agentId });
};

/**
 * Complete Task
 * @param taskId
 */
export const completeTask = (taskId: string): void => {
  if (!taskId) {
    throw new Error("Task ID and Agent ID are required");
  }

  const task = TaskStore.getTask(taskId);

  if (!task) {
    throw new Error(`Task with ID ${taskId} not found`);
  }

  TaskStore.updateTask(taskId, { status: "completed" });
};
