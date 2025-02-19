# GooseTeam: Collaborative MCP Server Project

Welcome to the GooseTeam project, where we're exploring collaborative servers designed for agent-based communication and collaboration.

Specifically, our work focuses on creating scalable, modular servers that facilitate agent interaction using [codename goose](https://block.github.io/goose/) and the [Model Context Protocol](https://modelcontextprotocol.io/) (MCP).

* **codename goose** is a locally-run, extensible, autonomous agent that can use a wide array of remote or local LLMs.
* **Model Context Protocol** is a 
* 
## Project Structure

The project is currently organized into iterative phases (p0, p1,..). Each phase is a standalone proof-of concept or building block to gradually evolve server capabilities.

### [Phase 0](./p0/README.md)

- **Purpose:** Set up a simple server that facilitates basic agent coordination.
  - Iterating from Aaron Goldsmith's Gist [here](https://gist.github.com/AaronGoldsmith/114c439ae67e4f4c47cc33e829c82fac).
  - Watch Aaron's "[Building a team of AI agents](https://www.youtube.com/watch?v=9HJy4uqMW74)" talk about his initial experiment.
- **Components:**
  - **Protocol:** Detailed in `agent_communication_protocol.md` for websocket-based interactions.
  - **Instructions:** Defined expectations in `instructions.md`.
  - **Server:** Came with `simple_server.py`, ported to `simple_server.js`
  - **Message Viewer:** A `message_viewer.html` file allows browser-based communication with the server.

### [Phase 1](./p1/README.md)

- **Purpose:** Iterate on prototype by implementing the websocket server as an MCP server.
- **Features:**
  - **Documentation, Protocol, and Unit Tests**
  - **Agent Registration:** Facilitates agent registration with unique ID assignments and message sending.
  - **Message Management:** Stores messages from agents, making them available for retrieval.
  - **Shared Server:** With an MCP Proxy, multiple agents can connect to the same MCP server, necessary for collaboration.
  - **Tools Exposed:**
    - **register_agent:** Register a new agent and provide a unique ID and color.
    - **list_agents:** Display currently registered agents.
    - **recent_messages:** Retrieve the recent agent-submitted messages.
    - **add_message:** Allow agents to send messages to the server.
    - **agent_wait:** Allow agents to wait for a specified number of seconds.
  

## Links

- **MCP Specification:** The complete Model Context Protocol specifications can be found [here](https://github.com/modelcontextprotocol/specification/tree/main).
- **Server Reference:** We follow a simple but modular approach demonstrated in the [GitHub MCP server](../mcp-servers/src/github).

## Getting Started

1. **Navigate** to `p1` or `p0` folder to delve into each iteration's specific features and configurations.
2. **Run the Server:** Follow the setup instructions in their respective directories to start the server and explore the features.
3. **Contribute:** We welcome contributions and feedback to keep expanding the capabilities and reach of the GooseTeam project.

Feel free to explore each iteration and engage with our ongoing development process.
