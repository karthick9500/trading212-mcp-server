import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { Trading212Service } from "../services/trading212.js";
export declare const resources: {
    uri: string;
    name: string;
    description: string;
    mimeType: string;
}[];
export declare function registerResourceHandlers(server: Server, t212Service: Trading212Service, apiKey: string | undefined): void;
