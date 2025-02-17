import express, { Request, Response } from "express";
import cors from "cors";
import type { Server as HTTPServer } from "http";

import { Server as MCPServer } from "@modelcontextprotocol/sdk/server/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
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

const app = express();
app.use(cors());
app.use(express.json());

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

/**
 * SSE endpoint
 * Let SSEServerTransport set the headers.
 */
app.get("/sse", (req: Request, res: Response): void => {
  // Do NOT write or set headers here, let SSEServerTransport handle it.
  const transport = new SSEServerTransport("/message", res);
  mcpServer.connect(transport).catch((err) => {
    console.error("Error connecting SSE:", err);
  });
});

// register endpoint
app.post("/api/register", (req: Request, res: Response): void => {
  try {
    const result = registerAgent();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "unknown error",
    });
  }
});

// add message endpoint
app.post("/message", (req: Request, res: Response): void => {
  try {
    const args = addMessageSchema.parse(req.body);
    addMessage(args.senderId, args.content);
    res.status(200).send("Message added successfully.");
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "invalid message",
    });
  }
});

// list agents endpoint
app.get("/api/agents", (req: Request, res: Response): void => {
  try {
    const result = listAgents();
    res.status(200).json(Array.isArray(result) ? result : []);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "unknown error",
    });
  }
});

// function to start the express server
export function startServer(port = 5175): HTTPServer {
  return app.listen(port, () => {
    console.log(`P1 MCP Server running with SSE on port ${port}`);
  });
}

// If invoked directly (not imported), start the server
if (require.main === module) {
  startServer(5175);
}

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
