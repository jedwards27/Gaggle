import { describe, it, expect, beforeEach } from "@jest/globals";
import { registerAgent } from "../registerAgent.ts"; // Assuming the function is exported properly
import AgentStore from "../agentStore.ts"; // Assuming AgentStore with needed methods

describe("registerAgent", () => {
  beforeEach(() => {
    // Clear existing agents before each test if needed
    AgentStore.clearAgents();
  });

  it("should register a new agent with a unique ID", () => {
    const result = registerAgent();
    expect(result).toHaveProperty("agentId");
    expect(typeof result.agentId).toBe("string");
    expect(AgentStore.getAgentById(result.agentId)).not.toBeNull();
  });

  it("should assign a color to the new agent", () => {
    const result = registerAgent();
    expect(result).toHaveProperty("color");
    expect(typeof result.color).toBe("string");
  });

  it("should increment the agent count", () => {
    const initialCount = AgentStore.countAgents();
    registerAgent();
    expect(AgentStore.countAgents()).toBe(initialCount + 1);
  });
});
