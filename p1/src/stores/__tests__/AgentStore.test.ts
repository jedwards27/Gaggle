import { describe, it, expect, beforeEach } from "@jest/globals";
import AgentStore from "../AgentStore.ts";

/**
 * Test AgentStore
 */
describe("AgentStore", () => {
  beforeEach(() => {
    // Clear existing agents before each test
    AgentStore.clearAgents();
  });

  it("should register and store an agent", () => {
    const agent = AgentStore.registerAgent();
    const agents = AgentStore.listAgents();
    expect(agents.length).toBe(1);
    expect(agents[0]).toEqual(agent);
  });

  it("should retrieve any agent by id", () => {
    const agent1 = AgentStore.registerAgent();
    const agent2 = AgentStore.registerAgent();
    const agent3 = AgentStore.registerAgent();

    expect(AgentStore.getAgent(agent1.id)).toEqual(agent1);
    expect(AgentStore.getAgent(agent2.id)).toEqual(agent2);
    expect(AgentStore.getAgent(agent3.id)).toEqual(agent3);
  });

  it("should list all agents", () => {
    const agent1 = AgentStore.registerAgent();
    const agent2 = AgentStore.registerAgent();
    const agent3 = AgentStore.registerAgent();
    expect(AgentStore.listAgents().length).toBe(3);
    expect(AgentStore.listAgents()).toEqual([agent1, agent2, agent3]);
  });

  it("should return the correct number of agents", () => {
    AgentStore.registerAgent();
    AgentStore.registerAgent();
    expect(AgentStore.listAgents().length).toBe(2);
  });

  it("should clear all agents", () => {
    AgentStore.registerAgent();
    AgentStore.registerAgent();
    AgentStore.registerAgent();
    AgentStore.clearAgents();
    const agents = AgentStore.listAgents();
    expect(agents.length).toBe(0);
  });
});
