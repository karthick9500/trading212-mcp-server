import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { Trading212Service } from "../services/trading212.js";
export declare const tools: ({
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            ticker?: undefined;
            quantity?: undefined;
            limitPrice?: undefined;
            orderId?: undefined;
            cursor?: undefined;
            limit?: undefined;
        };
        required?: undefined;
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            ticker: {
                type: string;
                description: string;
            };
            quantity: {
                type: string;
                description: string;
            };
            limitPrice?: undefined;
            orderId?: undefined;
            cursor?: undefined;
            limit?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            ticker: {
                type: string;
                description: string;
            };
            quantity: {
                type: string;
                description: string;
            };
            limitPrice: {
                type: string;
                description: string;
            };
            orderId?: undefined;
            cursor?: undefined;
            limit?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            orderId: {
                type: string;
                description: string;
            };
            ticker?: undefined;
            quantity?: undefined;
            limitPrice?: undefined;
            cursor?: undefined;
            limit?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            cursor: {
                type: string;
                description: string;
            };
            limit: {
                type: string;
                description: string;
            };
            ticker?: undefined;
            quantity?: undefined;
            limitPrice?: undefined;
            orderId?: undefined;
        };
        required?: undefined;
    };
})[];
export declare function registerToolHandlers(server: Server, t212Service: Trading212Service, apiKey: string | undefined): void;
