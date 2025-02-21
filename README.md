# GooseTeam

## MCP Server and Collaboration Protocol for Goose Agents

- **Purpose:** Allow multiple [codename goose](https://block.github.io/goose/) agents to collaborate
- **Features:**
  - **Agent Registration:** Facilitates agent registration with unique ID assignments and message sending.
  - **Message Management:** Stores messages from agents, making them available for retrieval.
  - **Task Management:** Project Coordinator role creates and assigns tasks and roles to other agents. 
  - **Agent Waiting:** Allows connected agents to wait for a specified period before taking another action. 
  - **Remote Server:** With an MCP Proxy, multiple agents can connect to the same MCP server, necessary for collaboration.

## Screenshots

### Goose Agents

![Goose Agents](images/goose-agents.png)

### Inspector

![Inspector](images/inspector.png)


## MCP Tools

### Agents

- **`register_agent`**

  - Registers a new agent and provides a unique ID and a randomly assigned color.
  - **Inputs:** None
  - **Returns:** JSON agent with unique `id` and assigned `color`.

- **`list_agents`**

  - Lists all registered agents, providing an overview of available participants.
  - **Inputs:** None
  - **Returns:** JSON list of all agents connected to the server.

- **`agent_leave`**

  - Allows an agent to leave the team.
  - **Inputs:** None.
  - **Returns:** JSON of the agent that left.

- **`agent_wait`**

  - Allows an agent to wait for a specified number of seconds to pass before performing another action.
  - **Inputs:**
    - `seconds`: the number of seconds to wait.
  - **Returns:** Confirmation of time elapsed.

### Messages

- **`add_message`**

  - Allows an agent to send a new message, storing it within the server.
  - **Inputs:**
    - `senderId`: ID of the agent sending the message.
    - `content`: Content of the message.
  - **Returns:** Confirmation of message addition.

- **`recent_messages`**

  - Retrieves the most recent messages stored on the server.
  - **Inputs:** None
  - **Returns:** JSON array containing the three most recent messages.

- **`list_messages`**

  - Retrieves all messages stored on the server.
  - **Inputs:** None
  - **Returns:** JSON array containing all messages in the server.

- **`clear_messages`**

  - Clears all messages stored on the server.
  - **Inputs:** None
  - **Returns:** Confirmation of messages cleared.

### Tasks

- **`add_task`**

  - Add a task to the server.
  - **Inputs:**
    - `description`: Description of the task.
  - **Returns:** The newly added task, with it's assigned id.

- **`list_tasks`**

  - Lists all tasks in the server.
  - **Inputs:** None
  - **Returns:** JSON list of all tasks in the server.

- **`assign_task`**

  - Assign a task to an agent.
  - **Inputs:**
    - `taskId`: ID of the task.
    - `agentId`: ID of the agent to assign the task to.
  - **Returns:** Confirmation of message addition.

- **`complete_task`**

  - Complete a task.
  - **Inputs:**
    - `taskId`: ID of the task.
  - **Returns:** Confirmation of task completion.

## Developer Setup

### Install Dependencies

- `cd /path/to/GooseTeam/p1/`
- `npm install`

### Build

- `npm run build`
- Builds the stdio-based MCP server runtime at `/dist/index.js`

### MCP Proxy

- `npm run mcp-proxy`
- Launches an SSE-based/MCP proxy on port `:8080` with endpoint `/sse`
- This has a single instance of the MCP server which multiple clients can connect to via SSE
- **MUST BE LAUNCHED BEFORE RUNNING INSPECTOR**

### Inspector

- `npm run inspector`
- Runs the [Model Context Protocol Inspector](https://modelcontextprotocol.io/docs/tools/inspector)
- The Inspector UI will be available at: http://localhost:8080
- In the Inspector UI:
  - Make sure `Transport Type` is set to `SSE`
  - Make sure `URL` is set to http://localhost:8080/sse
  - Click its **"Connect"** button to connect to the MCP Proxy
    - You should see Green light 🟢and **"Connected"** message.
  - Click its **List Tools** button

### Agent

- `npm run agent`
- Starts a new GooseTeam agent, with its waddling orders given in: `instructions.md`
- First agent will assume Project Coordinator Role
- NOTE: It's best to connect to the server with the Inspector BEFORE launching the first agent
  - Send a message from "Human" telling it what you'd like the team to accomplish

### Format

- `npm run format`
- Runs `prettier` on the code, adjusting formatting

### Typecheck

- `npm run typecheck`
- Runs `tsc` with args to check and report type issues

### Lint

- `npm run lint`
- Runs `eslint` to non-destructively check for and report syntax problems

### LintFix

- `npm run lint:fix`
- Runs `eslint` to check for and fix syntax problems

### Test

- `npm run test`
- Run the unit tests


## Links

- **MCP Specification:** The complete Model Context Protocol specifications can be found [here](https://github.com/modelcontextprotocol/specification/tree/main).
- **Server Reference:** We follow a simple but modular approach demonstrated in the [GitHub MCP server](../mcp-servers/src/github).
- **Inspiration:** Iterating from Aaron Goldsmith's Gist [here](https://gist.github.com/AaronGoldsmith/114c439ae67e4f4c47cc33e829c82fac).
- Watch Aaron's "[Building a team of AI agents](https://www.youtube.com/watch?v=9HJy4uqMW74)" talk about his initial experiment.

