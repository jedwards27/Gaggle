import fetch from "node-fetch";
import * as AC from "abort-controller";
import type { Server } from "http";
import { startServer } from "../index.ts";

let server: Server;

beforeAll(() => {
  server = startServer(5175);
});

afterAll(() => {
  server.close();
});

describe("MCP Server Integration Tests", () => {
  const baseURL = "http://localhost:5175";

  test("should connect to the server via SSE", async () => {
    const ac = new AC.AbortController();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await fetch(`${baseURL}/sse`, { signal: ac.signal as any });
    expect(response.ok).toBeTruthy();

    // Now abort the fetch.
    ac.abort();
  });

  test("should register, list agents, and add a message", async () => {
    // Register Agent
    const registerResponse = await fetch(`${baseURL}/api/register`, {
      method: "POST",
    });
    expect(registerResponse.ok).toBeTruthy();

    const registeredAgent = await registerResponse.json();

    expect(registeredAgent).toHaveProperty("agentId");
    expect(registeredAgent).toHaveProperty("color");

    // List Agents
    const agentsResponse = await fetch(`${baseURL}/api/agents`);
    expect(agentsResponse.ok).toBeTruthy();
    const agents = await agentsResponse.json();

    expect(agents.length).toBeGreaterThan(0);

    // Add Message
    const messageResponse = await fetch(`${baseURL}/message`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        senderId: registeredAgent.agentId,
        content: "Hello, MCP!",
      }),
    });

    expect(messageResponse.ok).toBeTruthy();
  });
});
