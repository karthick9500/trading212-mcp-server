import { ListResourcesRequestSchema, ReadResourceRequestSchema, McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";
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
export function registerResourceHandlers(server, t212Service, apiKey) {
    server.setRequestHandler(ListResourcesRequestSchema, async () => ({
        resources
    }));
    server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
        if (!apiKey)
            throw new McpError(ErrorCode.InvalidRequest, "API Key required");
        if (request.params.uri === "trading212://account/summary") {
            const data = await t212Service.getAccountCash();
            return {
                contents: [{
                        uri: request.params.uri,
                        mimeType: "application/json",
                        text: JSON.stringify(data, null, 2)
                    }]
            };
        }
        if (request.params.uri === "trading212://portfolio/positions") {
            const data = await t212Service.getAllPositions();
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
//# sourceMappingURL=index.js.map