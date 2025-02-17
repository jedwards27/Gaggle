import { describe, it, expect, beforeEach } from "@jest/globals";
import { listAgents } from "../listAgents.ts"; // Assuming the function is exported properly
import AgentStore from "../agentStore.ts"; // Assuming AgentStore with needed methods

describe("listAgents", () => {
  beforeEach(() => {
    // Clear existing agents before each test if needed
    AgentStore.clearAgents();
  });

  it("should return an empty list when there are no agents", () => {
    const result = listAgents();
    expect(result.length).toBe(0);
  });

  it("should list all registered agents", () => {
    const agent1 = AgentStore.registerAgent();
    const agent2 = AgentStore.registerAgent();
    const result = listAgents();
    expect(result).toEqual(expect.arrayContaining([agent1, agent2]));
  });

  it("should maintain the order of registration", () => {
    const agent1 = AgentStore.registerAgent();
    const agent2 = AgentStore.registerAgent();
    const result = listAgents();
    expect(result[0].id).toBe(agent1.id);
    expect(result[1].id).toBe(agent2.id);
  });
});
