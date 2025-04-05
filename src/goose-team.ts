  import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
  } from "@modelcontextprotocol/sdk/types.js";
  import { zodToJsonSchema } from "zod-to-json-schema";
  import { Server } from "@modelcontextprotocol/sdk/server/index.js";
  import {
    noArgSchema,
    addTaskSchema,
    agentWaitSchema,
    agentLeaveSchema,
    assignTaskSchema,
    addMessageSchema,
    completeTaskSchema,
    addProjectSchema,
  } from "./common/schemas";

  import { VERSION } from "./common/version";
  import {
    registerAgent,
    listAgents,
    agentWait,
    agentLeave,
  } from "./operations/agents";
  import {
    recentMessages,
    addMessage,
    listMessages,
    clearMessages,
  } from "./operations/messages";
  import {
    addProject,
    listProjects,
    clearProjects,
  } from "./operations/projects";
  import {
    addTask,
    listTasks,
    assignTask,
    completeTask,
  } from "./operations/tasks";

import type { MessageAddNotificationSchema } from './common/types';

  export const createServer = () => {

    // Instantiate the MCP server
    const server = new Server(
      {
        name: "goose-team",
        version: VERSION,
      },
      {
        capabilities: {
          resources: {},
          prompts: {},
          tools: {},
          logging: {
            level: "notice",
          },
        },
      },
    );

    // Register MCP request handlers
    server.setRequestHandler(ListToolsRequestSchema, async () => {
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
            name: "agent_leave",
            description: "Allow an agent to leave the team",
            inputSchema: zodToJsonSchema(agentLeaveSchema),
          },
          {
            name: "agent_wait",
            description: "Wait for a specified number of seconds",
            inputSchema: zodToJsonSchema(agentWaitSchema),
          },
          {
            name: "add_message",
            description: "Add a new message",
            inputSchema: zodToJsonSchema(addMessageSchema),
          },
          {
            name: "recent_messages",
            description: "Retrieve recent messages",
            inputSchema: zodToJsonSchema(noArgSchema),
          },
          {
            name: "list_messages",
            description: "Retrieve all messages",
            inputSchema: zodToJsonSchema(noArgSchema),
          },
          {
            name: "clear_messages",
            description: "Clear all messages",
            inputSchema: zodToJsonSchema(noArgSchema),
          },
          {
            name: "add_project",
            description: "Add a new project",
            inputSchema: zodToJsonSchema(addProjectSchema),
          },
          {
            name: "list_projects",
            description: "Retrieve all projects",
            inputSchema: zodToJsonSchema(noArgSchema),
          },
          {
            name: "clear_projects",
            description: "Clear all projects",
            inputSchema: zodToJsonSchema(noArgSchema),
          },
          {
            name: "add_task",
            description: "Add a new task",
            inputSchema: zodToJsonSchema(addTaskSchema),
          },
          {
            name: "assign_task",
            description: "Assign a task to an agent",
            inputSchema: zodToJsonSchema(assignTaskSchema),
          },
          {
            name: "list_tasks",
            description: "List all tasks",
            inputSchema: zodToJsonSchema(noArgSchema),
          },
          {
            name: "complete_task",
            description: "Complete a task",
            inputSchema: zodToJsonSchema(completeTaskSchema),
          },
        ],
      };
    });

    server.setRequestHandler(CallToolRequestSchema, async (request) => {
      try {
        const startTime = Date.now();
        let result;
        
        switch (request.params.name) {
          case "register_agent": {
            result = registerAgent();
            server.notification({
              method: "notifications/tool/call",
              params: {
                tool: request.params.name,
                timestamp: startTime,
                arguments: request.params.arguments,
                result,
              }
            });
            return {
              content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
            };
          }
          case "list_agents": {
            result = listAgents();
            server.notification({
              method: "notifications/tool/call",
              params: {
                tool: request.params.name,
                timestamp: startTime,
                arguments: request.params.arguments,
                result,
              }
            });
            return {
              content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
            };
          }
          case "agent_leave": {
            const args = agentLeaveSchema.parse(request.params.arguments);
            agentLeave(args.id);
            server.notification({
              method: "notifications/tool/call",
              params: {
                tool: request.params.name,
                timestamp: startTime,
                arguments: args,
              }
            });
            return {
              content: [{ type: "text", text: `Agent ${args.id} has left.` }],
            };
          }
          case "agent_wait": {
            const args = agentWaitSchema.parse(request.params.arguments);
            await agentWait(args.seconds);
            server.notification({
              method: "notifications/tool/call",
              params: {
                tool: request.params.name,
                timestamp: startTime,
                arguments: args,
              }
            });
            return {
              content: [
                { type: "text", text: `Waited for ${args.seconds} seconds.` },
              ],
            };
          }
          case "add_message": {
            const args = addMessageSchema.parse(request.params.arguments);
            const messageId = addMessage(args.senderId, args.content);

            server.sendLoggingMessage({
              level: "notice",
              data: {
                tool: request.params.name,
                timestamp: startTime,
                arguments: args,
                result: { messageId },
              }
            });

            return {
              content: [
                { type: "text", text: `Message ${messageId} added successfully.` },
              ],
            };
          }
          case "recent_messages": {
            result = recentMessages();
            server.notification({
              method: "notifications/tool/call",
              params: {
                tool: request.params.name,
                timestamp: startTime,
                result,
              }
            });
            return {
              content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
            };
          }
          case "list_messages": {
            result = listMessages();
            server.notification({
              method: "notifications/tool/call",
              params: {
                tool: request.params.name,
                timestamp: startTime,
                result,
              }
            });
            return {
              content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
            };
          }
          case "clear_messages": {
            clearMessages();
            server.notification({
              method: "notifications/tool/call",
              params: {
                tool: request.params.name,
                timestamp: startTime,
              }
            });
            return {
              content: [
                { type: "text", text: `Message queue successfully cleared.` },
              ],
            };
          }
          case "add_project": {
            const args = addProjectSchema.parse(request.params.arguments);
            const projectId = addProject(args.name);
            
            server.notification({
              method: "notifications/tool/call",
              params: {
                tool: request.params.name,
                timestamp: startTime,
                arguments: args,
                result: { projectId },
              }
            });
            
            // Send the message-specific notification that the client is listening for
            server.notification({
              method: "notifications/project/add",
              params: {
                project: {
                  name: args.name,
                  timestamp: new Date(startTime).toISOString(),
                }
              }
            });
            
            return {
              content: [
                { type: "text", text: `Project ${projectId} added successfully.` },
              ],
            };
          }
          case "list_projects": {
            result = listProjects();
            server.notification({
              method: "notifications/tool/call",
              params: {
                tool: request.params.name,
                timestamp: startTime,
                result,
              }
            });
            return {
              content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
            };
          }
          case "clear_projects": {
            clearProjects();
            server.notification({
              method: "notifications/tool/call",
              params: {
                tool: request.params.name,
                timestamp: startTime,
                result,
              }
            });
            return {
              content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
            };
          }
          case "add_task": {
            const args = addTaskSchema.parse(request.params.arguments);
            const { id } = addTask(args.description);
            server.notification({
              method: "notifications/tool/call",
              params: {
                tool: request.params.name,
                timestamp: startTime,
                arguments: args,
                result: { id },
              }
            });
            return {
              content: [{ type: "text", text: `Task ${id} added successfully.` }],
            };
          }
          case "assign_task": {
            const args = assignTaskSchema.parse(request.params.arguments);
            assignTask({ ...args });
            server.notification({
              method: "notifications/tool/call",
              params: {
                tool: request.params.name,
                timestamp: startTime,
                arguments: args,
              }
            });
            return {
              content: [
                {
                  type: "text",
                  text: `Task ${args.taskId} assigned successfully to Agent ${args.agentId}.`,
                },
              ],
            };
          }
          case "list_tasks": {
            const allTasks = listTasks();
            server.notification({
              method: "notifications/tool/call",
              params: {
                tool: request.params.name,
                timestamp: startTime,
                result: allTasks,
              }
            });
            return {
              content: [{ type: "text", text: JSON.stringify(allTasks, null, 2) }],
            };
          }
          case "complete_task": {
            const args = completeTaskSchema.parse(request.params.arguments);
            const taskId = args.taskId;
            completeTask(taskId);
            server.notification({
              method: "notifications/tool/call",
              params: {
                tool: request.params.name,
                timestamp: startTime,
                arguments: args,
              }
            });
            return {
              content: [
                { type: "text", text: `Task ${taskId} completed successfully.` },
              ],
            };
          }
          default:
            throw new Error(`Unknown tool: ${request.params.name}`);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "unknown error";
        server.notification({
          method: "notifications/tool/call",
          params: {
            tool: request.params.name,
            timestamp: Date.now(),
            arguments: request.params.arguments,
            error: errorMessage,
          }
        });
        throw new Error(`Error processing request: ${errorMessage}`);
      }
    });

    return { server };
  }
