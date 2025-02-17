import AgentStore from "./agentStore.ts";

export function listAgents(): { id: string; color: string }[] {
  return AgentStore.getAgents();
}
