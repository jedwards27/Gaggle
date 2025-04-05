import type { Task } from "../common/types";
import { createId } from "../common/utils";

class TaskStore {
  /**
   * Add a task
   * - Assigns an id and color
   * @param description
   * @returns Task
   */
  public static addTask(description: string): Task {
    const task: Task = {
      id: createId("task"),
      description,
      status: "open",
    };
    TaskStore.tasks.push(task);
    return task;
  }

  /**
   * Get a task by id
   * @param id
   * @returns Task
   */
  public static getTask(id: string): Task | undefined {
    return TaskStore.tasks.find((task) => task.id === id);
  }

  /**
   * Update a task
   * @param id
   * @param updatedTask
   */
  public static updateTask(id: string, updatedTask: Partial<Task>): void {
    TaskStore.tasks = TaskStore.tasks.map((task) =>
      task.id === id ? { ...task, ...updatedTask } : task,
    );
  }

  /**
   * Delete a task
   * @param id
   */
  public static deleteTask(id: string): void {
    TaskStore.tasks = TaskStore.tasks.filter((task) => task.id !== id);
  }

  /**
   * List all tasks
   */
  public static listTasks(): Task[] {
    return TaskStore.tasks;
  }

  /**
   * Clear all tasks
   */
  public static clearTasks(): void {
    TaskStore.tasks = [];
  }

  /**
   * Get a count of all tasks
   */
  public static countTasks(): number {
    return TaskStore.tasks.length;
  }

  // Singleton task store
  protected static tasks: Task[] = [];
}

export default TaskStore;
