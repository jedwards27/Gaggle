import { describe, it, expect, beforeEach } from "@jest/globals";
import AgentStore from "../agentStore.ts"; // Assuming AgentStore is a class with needed methods

describe("agentStore", () => {
  beforeEach(() => {
    // Clear existing agents before each test
    AgentStore.clearAgents();
  });

  it("should store and retrieve an agent", () => {
    const agent = AgentStore.registerAgent();
    const agents = AgentStore.getAgents();
    expect(agents.length).toBe(1);
    expect(agents[0]).toEqual(agent);
  });

  it("should clear all agents", () => {
    AgentStore.registerAgent();
    AgentStore.clearAgents();
    const agents = AgentStore.getAgents();
    expect(agents.length).toBe(0);
  });

  it("should return the correct number of agents", () => {
    AgentStore.registerAgent();
    AgentStore.registerAgent();
    expect(AgentStore.getAgents().length).toBe(2);
  });
});
