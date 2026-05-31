import { ListPromptsRequestSchema, GetPromptRequestSchema, McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";
export const prompts = [
    {
        name: "analyze_portfolio",
        description: "Analyze your current portfolio for diversification and performance"
    },
    {
        name: "review_recent_trades",
        description: "Review your recent trading activity for patterns and execution quality"
    }
];
export function registerPromptHandlers(server) {
    server.setRequestHandler(ListPromptsRequestSchema, async () => ({
        prompts
    }));
    server.setRequestHandler(GetPromptRequestSchema, async (request) => {
        if (request.params.name === "analyze_portfolio") {
            return {
                messages: [
                    {
                        role: "user",
                        content: {
                            type: "text",
                            text: "Please analyze my current Trading 212 portfolio. Look at the diversification across sectors/regions and identify any high-risk concentrations."
                        }
                    }
                ]
            };
        }
        if (request.params.name === "review_recent_trades") {
            return {
                messages: [
                    {
                        role: "user",
                        content: {
                            type: "text",
                            text: "Review my recent orders on Trading 212. Are there any patterns in my winning or losing trades? How is my execution quality?"
                        }
                    }
                ]
            };
        }
        throw new McpError(ErrorCode.InvalidRequest, `Unknown prompt: ${request.params.name}`);
    });
}
//# sourceMappingURL=index.js.map