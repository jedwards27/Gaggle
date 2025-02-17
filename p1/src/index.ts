#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import express from "express";
import cors from 'cors';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { registerAgent } from "./operations/registerAgent.js";
import { listAgents } from "./operations/listAgents.js";
import { recentMessages, addMessage } from "./operations/recentMessages.js";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

// Define schema for add_message tool
const addMessageSchema = z.object({
  senderId: z.string().nonempty("Sender ID is required"),
  content: z.string().nonempty("Content is required"),
});

const app = express();
app.use(cors()); // Enable CORS globally

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

let transport: SSEServerTransport;

app.get("/sse", async (req, res) => {
  transport = new SSEServerTransport("/message", res);
  await server.connect(transport);

  server.onclose = async () => {
    await server.close();
    process.exit(0);
  };
});

app.post("/message", async (req, res) => {
  await transport.handlePostMessage(req, res);
});

app.listen(5175, () => {
  console.log("P1 MCP Server running with SSE on port 5175");
});

server.setRequestHandler(ListToolsRequestSchema, async () => {
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

server.setRequestHandler(CallToolRequestSchema, async (request) => {
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
    throw new Error(`Error processing request: ${error instanceof Error ? error.message : 'unknown error'}`);
  }
});
