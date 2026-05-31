import { ListToolsRequestSchema, CallToolRequestSchema, McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";
export const tools = [
    {
        name: "t212_get_account_info",
        description: "Get basic account information (ID, currency, etc.)",
        inputSchema: { type: "object", properties: {} }
    },
    {
        name: "t212_get_account_cash",
        description: "Get current cash balance and equity",
        inputSchema: { type: "object", properties: {} }
    },
    {
        name: "t212_get_positions",
        description: "Get all open positions in the portfolio",
        inputSchema: { type: "object", properties: {} }
    },
    {
        name: "t212_get_instruments",
        description: "Get metadata for all tradable instruments",
        inputSchema: { type: "object", properties: {} }
    },
    {
        name: "t212_place_market_order",
        description: "Place a market order (immediate execution at current price)",
        inputSchema: {
            type: "object",
            properties: {
                ticker: { type: "string", description: "The ticker symbol (e.g., AAPL_US_EQ)" },
                quantity: { type: "number", description: "Quantity to buy (positive) or sell (negative)" }
            },
            required: ["ticker", "quantity"]
        }
    },
    {
        name: "t212_place_limit_order",
        description: "Place a limit order (execution at or better than a specified price)",
        inputSchema: {
            type: "object",
            properties: {
                ticker: { type: "string", description: "The ticker symbol" },
                quantity: { type: "number", description: "Quantity to buy/sell" },
                limitPrice: { type: "number", description: "The limit price" }
            },
            required: ["ticker", "quantity", "limitPrice"]
        }
    },
    {
        name: "t212_cancel_order",
        description: "Cancel a pending order",
        inputSchema: {
            type: "object",
            properties: {
                orderId: { type: "string", description: "The ID of the order to cancel" }
            },
            required: ["orderId"]
        }
    },
    {
        name: "t212_get_historical_orders",
        description: "Get historical orders with pagination",
        inputSchema: {
            type: "object",
            properties: {
                cursor: { type: "string", description: "Pagination cursor" },
                limit: { type: "number", description: "Number of records (max 50)" }
            }
        }
    }
];
export function registerToolHandlers(server, t212Service, apiKey) {
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
                    const { ticker, quantity } = request.params.arguments;
                    return { content: [{ type: "text", text: JSON.stringify(await t212Service.placeMarketOrder(ticker, quantity), null, 2) }] };
                }
                case "t212_place_limit_order": {
                    const { ticker, quantity, limitPrice } = request.params.arguments;
                    return { content: [{ type: "text", text: JSON.stringify(await t212Service.placeLimitOrder(ticker, quantity, limitPrice), null, 2) }] };
                }
                case "t212_cancel_order": {
                    const { orderId } = request.params.arguments;
                    return { content: [{ type: "text", text: JSON.stringify(await t212Service.cancelOrder(orderId), null, 2) }] };
                }
                case "t212_get_historical_orders": {
                    const { cursor, limit } = request.params.arguments;
                    return { content: [{ type: "text", text: JSON.stringify(await t212Service.getHistoricalOrders(cursor, limit), null, 2) }] };
                }
                default:
                    throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${request.params.name}`);
            }
        }
        catch (error) {
            return {
                content: [{ type: "text", text: `Error: ${error.message}` }],
                isError: true
            };
        }
    });
}
//# sourceMappingURL=index.js.map