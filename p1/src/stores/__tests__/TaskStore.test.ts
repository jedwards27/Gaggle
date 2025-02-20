import TaskStore from "../TaskStore.ts";
import { Task } from "../../common/types.ts";

/**
 * Test TaskStore
 */
describe("TaskStore", () => {
  let desc1 = "Test Task 1";
  let desc2 = "Test Task 2";

  beforeEach(() => {
    TaskStore.clearTasks();
  });

  it("should add a task, assigning an id and status", () => {
    const task: Task = TaskStore.addTask(desc1);
    expect(task.id).toBeDefined();
    expect(task.description).toEqual(desc1);
    expect(task.status).toEqual("open");
  });

  it("should get a task by id", () => {
    const task1 = TaskStore.addTask(desc1);
    const task2 = TaskStore.addTask(desc2);
    expect(TaskStore.getTask(task1.id)).toEqual(task1);
    expect(TaskStore.getTask(task2.id)).toEqual(task2);
  });

  it("should update a task", () => {
    const task = TaskStore.addTask(desc1);
    TaskStore.updateTask(task.id, { status: "completed" });
    expect(TaskStore.getTask(task.id)?.status).toEqual("completed");
  });

  it("should delete a task", () => {
    const task = TaskStore.addTask(desc1);
    TaskStore.deleteTask(task.id);
    expect(TaskStore.getTask(task.id)).toBeUndefined();
  });

  it("should list all tasks", () => {
    const task1 = TaskStore.addTask(desc1);
    const task2 = TaskStore.addTask(desc2);
    expect(TaskStore.listTasks()).toEqual([task1, task2]);
  });

  it("should clear all tasks", () => {
    TaskStore.addTask(desc1);
    TaskStore.addTask(desc2);
    TaskStore.clearTasks();
    expect(TaskStore.countTasks()).toEqual(0);
  });
});
