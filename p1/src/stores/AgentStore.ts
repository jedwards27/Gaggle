import { Agent } from "../common/types.ts";
import { createId } from "../common/utils.ts";

class AgentStore {
  /**
   * Register an agent
   */
  static registerAgent(): Agent {
    const agentId = createId("agent");
    const color: string =
      this.agents.length === 0 ? "black" : AgentStore.getRandomColor();
    const newAgent: Agent = { id: agentId, color, role: "", tasks: [] };
    this.agents.push(newAgent);
    return newAgent;
  }

  /**
   * List all agents
   */
  static listAgents(): Agent[] {
    return AgentStore.agents;
  }

  /**
   * Clear all agents
   */
  static clearAgents() {
    AgentStore.agents = [];
  }

  /**
   * Get an agent by id
   * @param id
   */
  static getAgent(id: string): Agent | undefined {
    return AgentStore.agents.find((agent) => agent.id === id);
  }

  /**
   * Remove an agent by id
   * @param id
   * @returns Agent - the agent that was removed
   */
  static removeAgent(id: string): Agent | undefined {
    const agent: Agent | undefined = AgentStore.getAgent(id);
    if (agent) {
      AgentStore.agents = AgentStore.agents.filter((agent) => agent.id !== id);
    }
    return agent;
  }

  /**
   * Get a count of all agents
   * @returns number
   */
  static countAgents(): number {
    return AgentStore.agents.length;
  }

  /**
   * Get a random color
   * @protected
   */
  protected static getRandomColor() {
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
  }

  // Singleton Agent Store
  protected static agents: Agent[] = [];
}

export default AgentStore;
