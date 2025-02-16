import AgentStore from "./agentStore.ts";

interface RegisterAgentResponse {
  agentId: string;
  color: string;
}

export function registerAgent(): RegisterAgentResponse {
  const agent = AgentStore.registerAgent();
  return { agentId: agent.id, color: agent.color };
}
