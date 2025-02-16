import AgentStore from "./agentStore.ts";

interface ListAgentsResponse {
  agents: { id: string; color: string }[];
}

export function listAgents(): ListAgentsResponse {
  const agents = AgentStore.getAgents();
  return { agents };
}
