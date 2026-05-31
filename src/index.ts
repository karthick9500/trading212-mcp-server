import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { registerToolHandlers } from "./tools/index.js";
import { registerResourceHandlers } from "./resources/index.js";
import { registerPromptHandlers } from "./prompts/index.js";

dotenv.config();

const TRANSPORT = process.env.TRANSPORT || 'sse';

const server = new Server(
  {
    name: "trading212-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
      resources: {},
      prompts: {},
    },
  }
);

// Register Handlers
registerToolHandlers(server);
registerResourceHandlers(server);
registerPromptHandlers(server);

async function startServer() {
  if (TRANSPORT === 'stdio') {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Trading 212 MCP Server running on stdio");
  } else {
    const app = express();
    app.use(cors());

    const sessions = new Map<string, SSEServerTransport>();

    app.get("/", (req, res) => {
      res.json({ status: "running", sessions: sessions.size });
    });

    app.get("/sse", async (req, res) => {
      const transport = new SSEServerTransport("/message", res);
      
      try {
        await server.connect(transport);
        const sessionId = transport.sessionId;
        sessions.set(sessionId, transport);
        console.error(`Session started: ${sessionId}`);

        req.on("close", () => {
          sessions.delete(sessionId);
          console.error(`Session ended: ${sessionId}`);
        });
      } catch (err) {
        console.error("Connect error:", err);
        res.end();
      }
    });

    const handleMessage = async (req: express.Request, res: express.Response) => {
      const sessionId = req.query.sessionId as string;
      const transport = sessions.get(sessionId);

      if (transport) {
        await transport.handlePostMessage(req, res);
      } else {
        res.status(404).send("Session not found");
      }
    };

    app.post("/message", handleMessage);
    app.post("/sse", handleMessage);
    app.post("/register", handleMessage);

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.error(`Trading 212 MCP Server (SSE) running on port ${PORT}`);
      console.error(`URL: http://localhost:${PORT}/sse`);
    });
  }
}

startServer().catch(console.error);