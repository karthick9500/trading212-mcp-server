# Trading 212 MCP Server

An open-source Model Context Protocol (MCP) server that provides a robust interface to the Trading 212 platform. Built with TypeScript and designed for remote, public hosting using HTTP/Server-Sent Events (SSE).

## 🚀 Features

- **SSE Transport:** Specifically designed for remote/public hosting. Connect from anywhere in the world.
- **Full API Coverage:** Supports Account info, Instruments, Market Data, Trading (Market, Limit, Stop orders), Portfolio, and History.
- **Token Efficiency:** Automatically prunes API responses to minimize token usage for LLMs without losing valuable financial data.
- **Enterprise Ready:** Strictly typed, fully tested, and uses standard environment variable configuration.
- **Security First:** No credentials stored on the server; everything is passed via environment variables.

## 🔐 Authentication & Multi-Tenancy

This server is designed for **Enterprise Multi-Tenancy**. A single hosted instance can serve multiple users securely. 

### How to Pass Credentials
The server looks for credentials in the following order of priority:

1.  **Request Metadata (`_meta`):** (Recommended for Public Hosting)
    MCP clients can pass credentials dynamically in every request. This allows your server to be stateless and serve many different Trading 212 accounts simultaneously.
    
    ```json
    {
      "method": "tools/call",
      "params": {
        "name": "t212_get_account_info",
        "arguments": {},
        "_meta": {
          "TRADING212_API_KEY": "user_api_key",
          "TRADING212_API_SECRET": "user_api_secret",
          "TRADING212_ENV": "live"
        }
      }
    }
    ```

2.  **Server Environment Variables:** (Recommended for Private Hosting)
    If no credentials are found in the request, the server falls back to the variables defined in its own `.env` file or system environment.

### Environment Variable Names
| Variable | Description |
| --- | --- |
| `TRADING212_API_KEY` | Your Trading 212 API Key. |
| `TRADING212_API_SECRET` | Your Trading 212 API Secret. |
| `TRADING212_ENV` | `live` or `demo` (default is `demo`). |
| `TRANSPORT` | `sse` (default) or `stdio`. |
| `PORT` | Port for SSE server (default 3000). |

## 🚀 Running the Server

### Remote/Public Hosting
Start the server in production mode:
```bash
npm start
```
The server will be available at:
- SSE Endpoint: `http://localhost:3000/sse`
- Message Endpoint: `http://localhost:3000/message`

### Local Execution
If you want to run the server locally for development or private use:

#### Option 1: Local SSE (Recommended for browser-based tools)
Follow the same steps as public hosting. You can access the endpoints on your `localhost`.

#### Option 2: Using with Claude Desktop (Local via stdio)
To use this server with Claude Desktop locally using the standard `stdio` transport, add the following to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "trading212": {
      "command": "node",
      "args": ["/path/to/trading212-mcp-server/dist/index.js"],
      "env": {
        "TRANSPORT": "stdio",
        "TRADING212_API_KEY": "your_api_key",
        "TRADING212_ENV": "demo"
      }
    }
  }
}
```

#### Option 3: Local SSE
You can also run it locally in SSE mode (the default) by setting `TRANSPORT=sse` (or leaving it unset). This is useful if you want to connect multiple local tools to the same server instance.

## 🔗 Connecting a Client

To connect an MCP client (like Claude Desktop or a custom implementation):

### Remote SSE Connection Example
You can host this server on a public URL (e.g., using Fly.io, Railway, or a VPS). Clients can then connect using the SSE transport.

See `examples/client.js` for a working implementation of a remote client.

## 🛠 Available Tools

| Tool | Description |
| --- | --- |
| `t212_get_account_info` | Get ID, currency, and basic account metadata. |
| `t212_get_account_cash` | Get real-time cash balance, equity, and P&L. |
| `t212_get_positions` | List all open positions in your portfolio. |
| `t212_get_instruments` | Search metadata for tradable stocks and ETFs. |
| `t212_place_market_order` | Instantly buy or sell at market price. |
| `t212_place_limit_order` | Execute trades at a specific price or better. |
| `t212_cancel_order` | Cancel any pending orders. |
| `t212_get_historical_orders` | Retrieve paginated trade history. |

## 📊 Resources & Prompts

### Resources
- `trading212://account/summary`: A live JSON snapshot of your account.
- `trading212://portfolio/positions`: A real-time view of your current holdings.

### Prompts
- **Analyze Portfolio:** Ask the AI to evaluate your diversification and risk.
- **Review Recent Trades:** Get an AI-driven post-mortem on your recent trading performance.

## 🧪 Testing

Run the comprehensive test suite:
```bash
npm test
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
*Disclaimer: Trading stocks and shares involves risk. This software is for educational and integration purposes. Use at your own risk.*