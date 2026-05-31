import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
async function test() {
    console.error("Starting test client...");
    const transport = new SSEClientTransport(new URL("http://localhost:3001/sse"));
    const client = new Client({ name: "test-client", version: "1.0.0" }, { capabilities: {} });
    try {
        console.error("Connecting to server on port 3001...");
        await client.connect(transport);
        console.error("Connected! Fetching tools...");
        const response = await client.listTools();
        console.error("Success! Found tools:", response.tools.map(t => t.name).join(", "));
        process.exit(0);
    }
    catch (error) {
        console.error("Connection failed:", error);
        process.exit(1);
    }
}
test();
//# sourceMappingURL=test-connection.js.map