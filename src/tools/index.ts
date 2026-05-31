import { 
  ListToolsRequestSchema, 
  CallToolRequestSchema,
  McpError,
  ErrorCode
} from "@modelcontextprotocol/sdk/types.js";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { Trading212Service, T212Credentials, T212Environment } from "../services/trading212.js";

export const tools = [
  {
    name: "t212_get_account_info",
    description: "Retrieve fundamental account metadata including the unique Account ID and the primary account currency.",
    inputSchema: { type: "object", properties: {} }
  },
  {
    name: "t212_get_account_cash",
    description: "Get a real-time detailed breakdown of account liquidity. Includes total equity, free cash, and P&L.",
    inputSchema: { type: "object", properties: {} }
  },
  {
    name: "t212_get_positions",
    description: "Fetch a complete list of all currently held assets in the user's portfolio.",
    inputSchema: { type: "object", properties: {} }
  },
  {
    name: "t212_get_instruments",
    description: "Access the master list of all tradable instruments on the platform.",
    inputSchema: { type: "object", properties: {} }
  },
  {
    name: "t212_place_market_order",
    description: "Execute an immediate trade at the best available current market price.",
    inputSchema: {
      type: "object",
      properties: {
        ticker: { type: "string", description: "The platform-specific ticker symbol (e.g., AAPL_US_EQ)" },
        quantity: { type: "number", description: "Number of shares. Positive for BUY, Negative for SELL." }
      },
      required: ["ticker", "quantity"]
    }
  },
  {
    name: "t212_place_limit_order",
    description: "Place a trade that only executes if the market price reaches a specific price or better.",
    inputSchema: {
      type: "object",
      properties: {
        ticker: { type: "string", description: "The platform-specific ticker symbol" },
        quantity: { type: "number", description: "Number of shares. Positive for BUY, Negative for SELL." },
        limitPrice: { type: "number", description: "The maximum price you are willing to pay (BUY) or the minimum price you are willing to accept (SELL)." }
      },
      required: ["ticker", "quantity", "limitPrice"]
    }
  },
  {
    name: "t212_cancel_order",
    description: "Immediately cancel an existing pending (unfilled) order.",
    inputSchema: {
      type: "object",
      properties: {
        orderId: { type: "string", description: "The unique identifier of the pending order to cancel." }
      },
      required: ["orderId"]
    }
  },
  {
    name: "t212_get_historical_orders",
    description: "Search through the history of all past trades and current pending orders.",
    inputSchema: {
      type: "object",
      properties: {
        cursor: { type: "string", description: "The token used for fetching the next page of results." },
        limit: { type: "number", description: "Number of orders to return (default 20, max 50)." }
      }
    }
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

export function registerToolHandlers(server: Server) {
  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    try {
      const creds = getCredentials(request);

      switch (request.params.name) {
        case "t212_get_account_info":
          return { content: [{ type: "text", text: JSON.stringify(await Trading212Service.getAccountInfo(creds), null, 2) }] };
        case "t212_get_account_cash":
          return { content: [{ type: "text", text: JSON.stringify(await Trading212Service.getAccountCash(creds), null, 2) }] };
        case "t212_get_positions":
          return { content: [{ type: "text", text: JSON.stringify(await Trading212Service.getAllPositions(creds), null, 2) }] };
        case "t212_get_instruments":
          return { content: [{ type: "text", text: JSON.stringify(await Trading212Service.getAllInstruments(creds), null, 2) }] };
        case "t212_place_market_order": {
          const { ticker, quantity } = request.params.arguments as any;
          return { content: [{ type: "text", text: JSON.stringify(await Trading212Service.placeMarketOrder(creds, ticker, quantity), null, 2) }] };
        }
        case "t212_place_limit_order": {
          const { ticker, quantity, limitPrice } = request.params.arguments as any;
          return { content: [{ type: "text", text: JSON.stringify(await Trading212Service.placeLimitOrder(creds, ticker, quantity, limitPrice), null, 2) }] };
        }
        case "t212_cancel_order": {
          const { orderId } = request.params.arguments as any;
          return { content: [{ type: "text", text: JSON.stringify(await Trading212Service.cancelOrder(creds, orderId), null, 2) }] };
        }
        case "t212_get_historical_orders": {
          const { cursor, limit } = request.params.arguments as any;
          return { content: [{ type: "text", text: JSON.stringify(await Trading212Service.getHistoricalOrders(creds, cursor, limit), null, 2) }] };
        }
        default:
          throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${request.params.name}`);
      }
    } catch (error: any) {
      return {
        content: [{ type: "text", text: error instanceof McpError ? error.message : `Error: ${error.message}` }],
        isError: true
      };
    }
  });
}