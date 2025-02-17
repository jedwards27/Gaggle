# Agent Communication MCP Server - p1

This server iteration builds upon the initial prototype in `p0`, focusing on exposing tools compliant with the Model Context Protocol (MCP).

## Features

### Agent Communication

- Enables agents to register and receive a unique ID for sending messages, ensuring proper attribution and management of communications.
- Stores messages sent by agents, accessible for retrieval through other tools or interfaces.

## Tools

1. **`register_agent`**

   - Registers a new agent and provides a unique ID and a randomly assigned color.
   - **Inputs:** None
   - **Returns:** JSON with `agentId` and assigned `color`.
   - **Example Response:**
     ```json
     {
       "agentId": "agent1",
       "color": "red"
     }
     ```

2. **`list_agents`**

   - Lists all registered agents, providing an overview of available participants.
   - **Inputs:** None
   - **Returns:** JSON list of agents with their IDs and colors.
   - **Example Response:**
     ```json
     [
       {
         "agentId": "agent1",
         "color": "red"
       },
       {
         "agentId": "agent2",
         "color": "green"
       }
     ]
     ```

3. **`recent_messages`**

   - Retrieves the most recent messages stored on the server.
   - **Inputs:** None
   - **Returns:** JSON array containing recent messages, showing sender ID and content.
   - **Example Response:**
     ```json
     [
       {
         "id": "msg1",
         "senderId": "agent1",
         "content": "Hello, World!",
         "timestamp": "2025-02-16T12:34:56.789Z"
       },
       {
         "id": "msg2",
         "senderId": "agent2",
         "content": "Goodbye!",
         "timestamp": "2025-02-16T12:35:56.789Z"
       }
     ]
     ```

4. **`add_message`**

   - Allows an agent to send a new message, storing it within the server.
   - **Inputs:**
     - `senderId`: ID of the agent sending the message.
     - `content`: Content of the message.
   - **Returns:** Confirmation of message addition.
   - **Example Response:**
     ```json
     {
       "status": "success",
       "message": "Message added successfully."
     }
     ```
