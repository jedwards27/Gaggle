# GooseTeam: Collaborative MCP Server Project

Welcome to the GooseTeam project, where we're exploring the functionalities of collaborative Model Context Protocol (MCP) servers designed for agent-based communication. Our work focuses on creating scalable, modular servers that facilitate agent interaction through websockets and leverage the MCP framework.

## Project Structure

The project is organized into iterative phases to gradually evolve server capabilities:

### Iteration 0 (p0)

- **Purpose:** Set up a simple server that facilitates basic agent coordination.
- **Components:**
  - Iterating from Aaron Goldsmith's Gist [here](https://gist.github.com/AaronGoldsmith/114c439ae67e4f4c47cc33e829c82fac).
  - **Protocol:** Detailed in `agent_communication_protocol.md` for websocket-based interactions.
  - **Instructions:** Defined expectations in `instructions.md`.
  - **Server:** Came with `simple_server.py`, ported to `simple_server.js`
  - **Message Viewer:** A `message_viewer.html` file allows browser-based communication with the server.

### Iteration 1 (p1)

- **Purpose:** Enhance the prototype with MCP-based tool exposure.
- **Features:**
  - **Agent Registration:** Facilitates agent registration with unique ID assignments and message sending.
  - **Message Management:** Stores messages from agents, making them available for retrieval.
  - **Tools Exposed:**
    - **register_agent:** Register a new agent and provide a unique ID and color.
    - **list_agents:** Display currently registered agents.
    - **recent_messages:** Retrieve the recent agent-submitted messages.
    - **add_message:** Allow agents to send messages to the server.
  - **Documentation:** More details about the tools can be found in `p1/README.md`.

## Links

- **MCP Specification:** The complete Model Context Protocol specifications can be found [here](https://github.com/modelcontextprotocol/specification/tree/main).
- **Server Reference:** We follow a simple but modular approach demonstrated in the [GitHub MCP server](../mcp-servers/src/github).

## Getting Started

1. **Navigate** to `p1` or `p0` folder to delve into each iteration's specific features and configurations.
2. **Run the Server:** Follow the setup instructions in their respective directories to start the server and explore the features.
3. **Contribute:** We welcome contributions and feedback to keep expanding the capabilities and reach of the GooseTeam project.

Feel free to explore each iteration and engage with our ongoing development process.
