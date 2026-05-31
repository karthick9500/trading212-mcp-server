import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Trading212Service, T212Environment } from "./services/trading212.js";
import { registerToolHandlers } from "./tools/index.js";
import { registerResourceHandlers } from "./resources/index.js";
import { registerPromptHandlers } from "./prompts/index.js";

dotenv.config();

const API_KEY = process.env.TRADING212_API_KEY;
const ENV = (process.env.TRADING212_ENV as T212Environment) || 'demo';
const TRANSPORT = process.env.TRANSPORT || 'sse'; // 'sse' or 'stdio'

if (!API_KEY) {
  console.error("ERROR: TRADING212_API_KEY is not set.");
}

const t212Service = new Trading212Service(API_KEY || '', ENV);

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
registerToolHandlers(server, t212Service, API_KEY);
registerResourceHandlers(server, t212Service, API_KEY);
registerPromptHandlers(server);

async function startServer() {
  if (TRANSPORT === 'stdio') {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Trading 212 MCP Server running on stdio");
  } else {
    const app = express();
    app.use(cors());
    app.use(express.json());

    let transport: SSEServerTransport | null = null;

    app.get("/sse", async (req, res) => {
      console.log("New SSE connection established");
      transport = new SSEServerTransport("/message", res);
      await server.connect(transport);
      
      req.on("close", () => {
        console.log("SSE connection closed");
        transport = null;
      });
    });

    app.post("/message", async (req, res) => {
      if (transport) {
        await transport.handlePostMessage(req, res);
      } else {
        res.status(400).send("No active SSE transport");
      }
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.error(`Trading 212 MCP Server (SSE) running on port ${PORT}`);
      console.error(`SSE endpoint: http://localhost:${PORT}/sse`);
      console.error(`Message endpoint: http://localhost:${PORT}/message`);
    });

    // Basic error handling for the Express app
    app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
      console.error(err.stack);
      res.status(500).send("Something went wrong!");
    });
  }
}

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});

export { server };