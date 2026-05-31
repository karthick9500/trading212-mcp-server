# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2026-05-31

### Added
- Initial release of the Trading 212 MCP Server.
- Support for HTTP/SSE transport for remote connectivity.
- Comprehensive tool suite for Account, Market Data, Trading, and History.
- Resource support for Account Summary and Portfolio Positions.
- Prompt templates for Portfolio Analysis and Trade Review.
- Token pruning utility to optimize LLM context usage.
- Unit test suite for API service and data trimming.
- Documentation and example remote client.

### Security
- Credentials handled exclusively via environment variables.
- Explicit pruning of sensitive or redundant API fields.