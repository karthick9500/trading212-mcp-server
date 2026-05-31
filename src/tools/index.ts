import { 
  ListToolsRequestSchema, 
  CallToolRequestSchema,
  McpError,
  ErrorCode
} from "@modelcontextprotocol/sdk/types.js";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { Trading212Service } from "../services/trading212.js";

export const tools = [
  {
    name: "t212_get_account_info",
    description: "Retrieve fundamental account metadata including the unique Account ID and the primary account currency (e.g., USD, GBP, EUR). Use this as a first step to understand the user's base currency before placing orders.",
    inputSchema: { type: "object", properties: {} }
  },
  {
    name: "t212_get_account_cash",
    description: "Get a real-time detailed breakdown of account liquidity. This includes total equity, free cash available for trading, blocked cash for pending orders, and current unrealized profit/loss. Use this tool to verify if the user has sufficient funds before recommending or placing a trade.",
    inputSchema: { type: "object", properties: {} }
  },
  {
    name: "t212_get_positions",
    description: "Fetch a complete list of all currently held assets in the user's portfolio. Includes ticker symbols, quantities, average fill prices, and current market value. Use this to analyze the user's current exposure or when they ask 'What do I own?'",
    inputSchema: { type: "object", properties: {} }
  },
  {
    name: "t212_get_instruments",
    description: "Access the master list of all tradable instruments on the platform. Use this to verify the correct ticker format (e.g., AAPL_US_EQ) or to find available stocks, ETFs, and exchanges.",
    inputSchema: { type: "object", properties: {} }
  },
  {
    name: "t212_place_market_order",
    description: "Execute an immediate trade at the best available current market price. Use this for urgent execution. Note: Quantity must be positive for BUY orders and negative for SELL orders. Always check cash balance first.",
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
    description: "Place a trade that only executes if the market price reaches a specific price or better. Use this for precise entry/exit strategies. Note: Quantity must be positive for BUY and negative for SELL.",
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
    description: "Immediately cancel an existing pending (unfilled) order. You will need the orderId which can be found using the t212_get_historical_orders tool.",
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
    description: "Search through the history of all past trades and current pending orders. This is the primary tool for checking the status of a trade or finding an orderId to cancel. Supports pagination via 'cursor'.",
    inputSchema: {
      type: "object",
      properties: {
        cursor: { type: "string", description: "The token used for fetching the next page of results." },
        limit: { type: "number", description: "Number of orders to return (default 20, max 50)." }
      }
    }
  }
];

export function registerToolHandlers(server: Server, t212Service: Trading212Service, apiKey: string | undefined) {
  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    if (!apiKey) {
      throw new McpError(ErrorCode.InvalidRequest, "TRADING212_API_KEY environment variable is required.");
    }

    try {
      switch (request.params.name) {
        case "t212_get_account_info":
          return { content: [{ type: "text", text: JSON.stringify(await t212Service.getAccountInfo(), null, 2) }] };
        case "t212_get_account_cash":
          return { content: [{ type: "text", text: JSON.stringify(await t212Service.getAccountCash(), null, 2) }] };
        case "t212_get_positions":
          return { content: [{ type: "text", text: JSON.stringify(await t212Service.getAllPositions(), null, 2) }] };
        case "t212_get_instruments":
          return { content: [{ type: "text", text: JSON.stringify(await t212Service.getAllInstruments(), null, 2) }] };
        case "t212_place_market_order": {
          const { ticker, quantity } = request.params.arguments as any;
          return { content: [{ type: "text", text: JSON.stringify(await t212Service.placeMarketOrder(ticker, quantity), null, 2) }] };
        }
        case "t212_place_limit_order": {
          const { ticker, quantity, limitPrice } = request.params.arguments as any;
          return { content: [{ type: "text", text: JSON.stringify(await t212Service.placeLimitOrder(ticker, quantity, limitPrice), null, 2) }] };
        }
        case "t212_cancel_order": {
          const { orderId } = request.params.arguments as any;
          return { content: [{ type: "text", text: JSON.stringify(await t212Service.cancelOrder(orderId), null, 2) }] };
        }
        case "t212_get_historical_orders": {
          const { cursor, limit } = request.params.arguments as any;
          return { content: [{ type: "text", text: JSON.stringify(await t212Service.getHistoricalOrders(cursor, limit), null, 2) }] };
        }
        default:
          throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${request.params.name}`);
      }
    } catch (error: any) {
      return {
        content: [{ type: "text", text: `Error: ${error.message}` }],
        isError: true
      };
    }
  });
}