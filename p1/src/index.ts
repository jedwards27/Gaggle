import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { Server as MCPServer } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { VERSION } from "./common/version.js";
import { registerAgent } from "./operations/registerAgent.ts";
import { listAgents } from "./operations/listAgents.ts";
import { recentMessages, addMessage } from "./operations/recentMessages.ts";
import { agentWait } from "./operations/agentWait.ts";
import {addMessageSchema, agentWaitSchema, noArgSchema} from "./common/types.js"


// Instantiate the MCP server
const mcpServer = new MCPServer(
  {
    name: "p1-mcp-server",
    version: VERSION,
  },
  {
    capabilities: {
      tools: {},
    },
  },
);

// Register MCP request handlers
mcpServer.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "register_agent",
        description: "Register a new agent",
        inputSchema: zodToJsonSchema(noArgSchema),
      },
      {
        name: "list_agents",
        description: "List all registered agents",
        inputSchema: zodToJsonSchema(noArgSchema),
      },
      {
        name: "recent_messages",
        description: "Retrieve recent messages",
        inputSchema: zodToJsonSchema(noArgSchema),
      },
      {
        name: "add_message",
        description: "Add a new message",
        inputSchema: zodToJsonSchema(addMessageSchema),
      },
      {
        name: "agent_wait",
        description: "Wait for a specified number of seconds",
        inputSchema: zodToJsonSchema(agentWaitSchema),
      },
    ],
  };
});

mcpServer.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    switch (request.params.name) {
      case "register_agent": {
        const result = registerAgent();
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      }
      case "list_agents": {
        const result = listAgents();
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      }
      case "recent_messages": {
        const result = recentMessages();
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      }
      case "add_message": {
        const args = addMessageSchema.parse(request.params.arguments);
        addMessage(args.senderId, args.content);
        return {
          content: [{ type: "text", text: "Message added successfully." }],
        };
      }
      case "agent_wait": {
        const args = agentWaitSchema.parse(request.params.arguments);
        await agentWait(args.seconds);
        return {
          content: [{ type: "text", text: `Waited for ${args.seconds} seconds.` }],
        };
      }
      default:
        throw new Error(`Unknown tool: ${request.params.name}`);
    }
  } catch (error) {
    throw new Error(
      `Error processing request: ${
        error instanceof Error ? error.message : "unknown error"
      }`,
    );
  }
});

async function runServer() {
  const transport = new StdioServerTransport();
  await mcpServer.connect(transport);
  console.error("GooseTeam MCP Server running on stdio");
}

runServer().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});