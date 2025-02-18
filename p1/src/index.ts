import { Server as MCPServer } from "@modelcontextprotocol/sdk/server/index.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { registerAgent } from "./operations/registerAgent.ts";
import { listAgents } from "./operations/listAgents.ts";
import { recentMessages, addMessage } from "./operations/recentMessages.ts";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

// Define schema for add_message tool
const addMessageSchema = z.object({
  senderId: z.string().nonempty("Sender ID is required"),
  content: z.string().nonempty("Content is required"),
});

// Instantiate the MCP server
const mcpServer = new MCPServer(
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

// Register MCP request handlers
mcpServer.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "register_agent",
        description: "Register a new agent",
        inputSchema: zodToJsonSchema(z.object({})),
      },
      {
        name: "list_agents",
        description: "List all registered agents",
        inputSchema: zodToJsonSchema(z.object({})),
      },
      {
        name: "recent_messages",
        description: "Retrieve recent messages",
        inputSchema: zodToJsonSchema(z.object({})),
      },
      {
        name: "add_message",
        description: "Add a new message",
        inputSchema: zodToJsonSchema(addMessageSchema),
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
