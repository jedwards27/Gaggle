import AgentStore from "../stores/AgentStore";
import type { Agent } from "../common/types";

interface RegisterAgentResponse {
  agentId: string;
  color: string;
}

/**
 * Register an agent
 */
export function registerAgent(): RegisterAgentResponse {
  const agent = AgentStore.registerAgent();
  return { agentId: agent.id, color: agent.color };
}

/**
 * List all agents
 */
export function listAgents(): { id: string; color: string }[] {
  return AgentStore.listAgents();
}

/**
 * Allow agent to wait
 * @param seconds
 */
export async function agentWait(seconds: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

/**
 * Allow agent to leave
 * @param agentId
 */
export function agentLeave(agentId: string): Agent | undefined {
  return AgentStore.removeAgent(agentId);
}
