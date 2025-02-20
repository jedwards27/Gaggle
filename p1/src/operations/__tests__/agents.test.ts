import { describe, it, expect, beforeEach } from "@jest/globals";
import { listAgents, agentWait, registerAgent, agentLeave } from "../agents.ts";
import AgentStore from "../../stores/AgentStore.ts";

/**
 * Test registerAgent
 */
describe("registerAgent", () => {
  beforeEach(() => {
    AgentStore.clearAgents();
  });

  it("should register a new agent with a unique ID", () => {
    const result = registerAgent();
    expect(result).toHaveProperty("agentId");
    expect(typeof result.agentId).toBe("string");
    expect(AgentStore.getAgent(result.agentId)).not.toBeNull();
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

/**
 * Test listAgents
 */
describe("listAgents", () => {
  beforeEach(() => {
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

/**
 * Test agentWait
 */
describe("agentWait", () => {
  beforeEach(() => {
    AgentStore.clearAgents();
  });

  it("should wait for the specified number of seconds", async () => {
    const start = Date.now();
    const waitTime = 2;
    await agentWait(waitTime);
    const end = Date.now();
    const elapsed = (end - start) / 1000;
    expect(elapsed).toBeGreaterThan(waitTime - 0.5);
    expect(elapsed).toBeLessThan(waitTime + 0.5);
  });
});

/**
 * Test agentWait
 */
describe("agentLeave", () => {
  beforeEach(() => {
    AgentStore.clearAgents();
  });

  it("should remove just the leaving agent from the list", async () => {
    const agent1 = AgentStore.registerAgent();
    const agent2 = AgentStore.registerAgent();
    const agent3 = AgentStore.registerAgent();
    const agent4 = AgentStore.registerAgent();
    agentLeave(agent1.id);
    const agents = listAgents();
    expect(agents.length).toBe(3);
    expect(agents.find((agent) => agent.id === agent1.id)).toBeFalsy();
    expect(agents.find((agent) => agent.id === agent2.id)).toBeTruthy();
    expect(agents.find((agent) => agent.id === agent3.id)).toBeTruthy();
    expect(agents.find((agent) => agent.id === agent4.id)).toBeTruthy();
  });
});
