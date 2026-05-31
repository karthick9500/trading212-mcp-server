/**
 * Example Remote Client for Trading 212 MCP Server (SSE)
 * 
 * This client demonstrates how to connect to a publicly hosted 
 * Trading 212 MCP server and invoke tools.
 */

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import { CallToolRequestSchema } from "@modelcontextprotocol/sdk/types.js";

async function main() {
  const serverUrl = new URL("http://localhost:3000/sse");
  const transport = new SSEClientTransport(serverUrl);
  
  const client = new Client(
    {
      name: "example-client",
      version: "1.0.0",
    },
    {
      capabilities: {},
    }
  );

  console.log("Connecting to Trading 212 MCP Server...");
  await client.connect(transport);
  console.log("Connected successfully!");

  try {
    console.log("Fetching account information...");
    const result = await client.request(
      {
        method: "tools/call",
        params: {
          name: "t212_get_account_info",
          arguments: {}
        }
      },
      CallToolRequestSchema
    );

    console.log("Account Info Result:");
    console.log(JSON.stringify(result, null, 2));

  } catch (error) {
    console.error("Error calling tool:", error);
  } finally {
    process.exit(0);
  }
}

main().catch(console.error);