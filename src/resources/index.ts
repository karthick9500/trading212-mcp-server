import { 
  ListResourcesRequestSchema, 
  ReadResourceRequestSchema,
  McpError,
  ErrorCode
} from "@modelcontextprotocol/sdk/types.js";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { Trading212Service, T212Credentials, T212Environment } from "../services/trading212.js";

export const resources = [
  {
    uri: "trading212://account/summary",
    name: "Account Summary",
    description: "Live snapshot of account balance and currency",
    mimeType: "application/json"
  },
  {
    uri: "trading212://portfolio/positions",
    name: "Current Positions",
    description: "Real-time overview of all open positions",
    mimeType: "application/json"
  }
];

function getCredentials(request: any): T212Credentials {
  const apiKey = request.params._meta?.TRADING212_API_KEY || process.env.TRADING212_API_KEY;
  const apiSecret = request.params._meta?.TRADING212_API_SECRET || process.env.TRADING212_API_SECRET;
  const environment = (request.params._meta?.TRADING212_ENV || process.env.TRADING212_ENV || 'demo') as T212Environment;

  if (!apiKey || !apiSecret) {
    throw new McpError(ErrorCode.InvalidRequest, "Authentication failed: Both TRADING212_API_KEY and TRADING212_API_SECRET must be provided.");
  }

  return { apiKey, apiSecret, environment };
}

export function registerResourceHandlers(server: Server) {
  server.setRequestHandler(ListResourcesRequestSchema, async () => ({
    resources
  }));

  server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    const creds = getCredentials(request);

    if (request.params.uri === "trading212://account/summary") {
      const data = await Trading212Service.getAccountSummary(creds);
      return {
        contents: [{
          uri: request.params.uri,
          mimeType: "application/json",
          text: JSON.stringify(data, null, 2)
        }]
      };
    }

    if (request.params.uri === "trading212://portfolio/positions") {
      const data = await Trading212Service.getAllPositions(creds);
      return {
        contents: [{
          uri: request.params.uri,
          mimeType: "application/json",
          text: JSON.stringify(data, null, 2)
        }]
      };
    }

    throw new McpError(ErrorCode.InvalidRequest, `Unknown resource: ${request.params.uri}`);
  });
}