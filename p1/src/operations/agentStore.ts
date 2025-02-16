interface Agent {
  id: string;
  color: string;
}

class AgentStore {
  private static agents: Agent[] = [];
  private static colors: string[] = [
    "red",
    "green",
    "blue",
    "orange",
    "purple",
  ];

  static registerAgent(): Agent {
    const agentId = `agent${this.agents.length + 1}`;
    const color = this.colors[this.agents.length % this.colors.length];
    const newAgent: Agent = { id: agentId, color };
    this.agents.push(newAgent);
    return newAgent;
  }

  static getAgents(): Agent[] {
    return this.agents;
  }

  static clearAgents() {
    this.agents = [];
  }

  static getAgentById(id: string): Agent | undefined {
    return this.agents.find((agent) => agent.id === id);
  }

  static countAgents(): number {
    return this.agents.length;
  }
}

export default AgentStore;
