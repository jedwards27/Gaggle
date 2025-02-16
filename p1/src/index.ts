#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { registerAgent } from "./operations/registerAgent.js";
import { listAgents } from "./operations/listAgents.js";
import { recentMessages, addMessage } from "./operations/recentMessages.js";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

const server = new Server(
  {
    name: "p1-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  },
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "register_agent",
        description: "Register a new agent",
        inputSchema: zodToJsonSchema(z.object({})), // Add specific input schema here
      },
      {
        name: "list_agents",
        description: "List all registered agents",
        inputSchema: zodToJsonSchema(z.object({})), // Add specific input schema here
      },
      {
        name: "recent_messages",
        description: "Retrieve recent messages",
        inputSchema: zodToJsonSchema(z.object({})), // Add specific input schema here
      },
      {
        name: "add_message",
        description: "Add a new message",
        inputSchema: zodToJsonSchema(
          z.object({
            senderId: z.string(),
            content: z.string(),
          }),
        ),
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    if (!request.params.arguments) {
      throw new Error("Arguments are required");
    }

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
        const args = z
          .object({
            senderId: z.string(),
            content: z.string(),
          })
          .parse(request.params.arguments);

        addMessage(args.senderId, args.content);
        return {
          content: [{ type: "text", text: "Message added successfully." }],
        };
      }

      default:
        throw new Error(`Unknown tool: ${request.params.name}`);
    }
  } catch (error) {
    throw new Error(`Error processing request: ${error.message}`);
  }
});

async function runServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("P1 MCP Server running on stdio");
}

runServer().catch((err) => {
  const error = err as Error;
  console.error("Fatal error in main():", error.message);
  process.exit(1);
});
