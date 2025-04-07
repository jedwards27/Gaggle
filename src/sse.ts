import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { createServer } from "./goose-team";
import express from "express";
import { exec } from "child_process";
import bodyParser from "body-parser";

// Create the SSE server
const { server } = createServer();

// Create the express app
const app = express();

app.use(bodyParser.json());

const transports: Map<string, SSEServerTransport> = new Map<string, SSEServerTransport>();

app.get("/sse", async (req, res) => {
  let transport;
  if (req?.query?.sessionId) {
    const sessionId =  req?.query?.sessionId as string || "none";
    transport = transports.get(sessionId) as SSEServerTransport;
    console.log("Client Reconnecting? ", transport.sessionId)
  } else {
    // Create and store transport for new session
    transport =  new SSEServerTransport("/message", res);
    transports.set(transport.sessionId, transport);

    // Connect server to transport
    await server.connect(transport);
    console.log("Client Connected: ", transport.sessionId)
  }

  // Handle close of connection
  server.onclose = async () => {
    console.log("Client Disconnected: ", transport.sessionId);
    transports.delete(transport.sessionId);
  };
});

app.post("/message", async (req, res) => {
  const sessionId =  req?.query?.sessionId as string || "none";
  const transport = transports.get(sessionId);
  if (transport) {
    console.log("Client Message from", sessionId);
    await transport.handlePostMessage(req, res);
  }
});

// Route to run "npm run agent:text" in the local filesystem
app.post("/run-agent-text", async (req, res) => {
  exec("npm run agent:text", (error, stdout, stderr) => {
    if (error) {
      console.error("Error running 'npm run agent:text'", stderr);
      return res.status(500).json({ error: stderr });
    }
    console.log("Successfully ran 'npm run agent:text':", stdout);
    return res.status(200).json({ output: stdout });
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
