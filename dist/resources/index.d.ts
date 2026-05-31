import { Server } from "@modelcontextprotocol/sdk/server/index.js";
export declare const resources: {
    uri: string;
    name: string;
    description: string;
    mimeType: string;
}[];
export declare function registerResourceHandlers(server: Server): void;
