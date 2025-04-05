import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";

// Create the SSE client transport
const transport = new SSEClientTransport(new URL("http://localhost:3001/sse"));

// Create the MCP client
export const client = new Client({
  name: "Gaggle",
  version: "0.0.1",
  capabilities: {
    resources: {},
    prompts: {},
    tools: {},
    logging: {
      level: "notice",
    },
  },
});

// Connect to the MCP server
export async function connectToServer() {
  try {
    await client.connect(transport);
    console.log("Connected to MCP server");
  } catch (error) {
    console.error("Failed to connect to MCP server:", error);
    throw error;
  }
} 