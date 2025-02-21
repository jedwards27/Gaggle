import { describe, it, expect, beforeEach } from "@jest/globals";
import { addTask, listTasks, assignTask, completeTask } from "../tasks.ts";
import TaskStore from "../../stores/TaskStore.ts";
import AgentStore from "../../stores/AgentStore.ts";

/**
 * Test addTask
 */
describe("addTask", () => {
  beforeEach(() => {
    TaskStore.clearTasks();
  });

  it("should add a new task with a unique ID", () => {
    const description = "Test task";
    const result = addTask(description);
    expect(result).toHaveProperty("id");
    expect(typeof result.id).toBe("string");
    expect(TaskStore.getTask(result.id)).not.toBeNull();
  });

  it("should throw an error if the description is empty", () => {
    expect(() => addTask("")).toThrowError("Task description is required");
  });
});

/**
 * Test listTasks
 */
describe("listTasks", () => {
  beforeEach(() => {
    TaskStore.clearTasks();
  });

  it("should return an empty list when there are no tasks", () => {
    const result = listTasks();
    expect(result.length).toBe(0);
  });

  it("should list all added tasks", () => {
    const task1 = TaskStore.addTask("Task 1");
    const task2 = TaskStore.addTask("Task 2");
    const result = listTasks();
    expect(result).toEqual(expect.arrayContaining([task1, task2]));
  });
});

/**
 * Test assignTask
 */
describe("assignTask", () => {
  beforeEach(() => {
    TaskStore.clearTasks();
    AgentStore.clearAgents();
  });

  it("should assign a task to an agent", () => {
    const task = TaskStore.addTask("Test task");
    const agent = AgentStore.registerAgent();
    assignTask({ taskId: task.id, agentId: agent.id });
    const updatedTask = TaskStore.getTask(task.id);
    expect(updatedTask?.agentId).toBe(agent.id);
  });

  it("should throw an error if taskId or agentId is missing", () => {
    const task = TaskStore.addTask("Test task");
    const agent = AgentStore.registerAgent();
    expect(() => assignTask({ taskId: "", agentId: agent.id })).toThrowError(
      "Task ID and Agent ID are required",
    );
    expect(() => assignTask({ taskId: task.id, agentId: "" })).toThrowError(
      "Task ID and Agent ID are required",
    );
  });

  it("should throw an error if task or agent is not found", () => {
    expect(() =>
      assignTask({ taskId: "nonexistent", agentId: "agent" }),
    ).toThrowError("Task with ID nonexistent not found");
    const task = TaskStore.addTask("Test task");
    expect(() =>
      assignTask({ taskId: task.id, agentId: "nonexistent" }),
    ).toThrowError("Agent with ID nonexistent not found");
  });
});

/**
 * Test completeTask
 */
describe("completeTask", () => {
  beforeEach(() => {
    TaskStore.clearTasks();
  });

  it("should complete a task", () => {
    const task = TaskStore.addTask("Test task");
    completeTask(task.id);
    const updatedTask = TaskStore.getTask(task.id);
    expect(updatedTask?.status).toBe("completed");
  });

  it("should throw an error if taskId is missing", () => {
    expect(() => completeTask("")).toThrowError(
      "Task ID and Agent ID are required",
    );
  });

  it("should throw an error if task is not found", () => {
    expect(() => completeTask("nonexistent")).toThrowError(
      "Task with ID nonexistent not found",
    );
  });
});
