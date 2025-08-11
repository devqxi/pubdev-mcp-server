# Pub.dev MCP Server

A Model Context Protocol (MCP) server that provides comprehensive access to pub.dev, the official package repository for Dart and Flutter. This server enables AI assistants to search, analyze, and retrieve detailed information about Dart/Flutter packages.

## Features

- 🔍 **Package Search**: Search for packages with advanced filtering and sorting
- 📦 **Package Information**: Get detailed package metadata, dependencies, and statistics
- 🔄 **Version Management**: Check for updates, compare versions, and track version history
- 📚 **Documentation Access**: Retrieve README, changelog, examples, and API documentation
- ⚡ **Caching**: Built-in caching system for improved performance
- 🛠️ **Dependency Analysis**: Compare dependencies between package versions

## Installation

### NPM Installation (Recommended)

```bash
npm install -g @devqxi/pubdev-mcp-server
```

### From Source

```bash
git clone https://github.com/devqxi/pubdev-mcp-server.git
cd pubdev-mcp-server
npm install
npm run build
```

## Configuration

### Claude Desktop

Add the following to your Claude Desktop configuration file:

**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Linux**: `~/.config/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "pubdev": {
      "command": "npx",
      "args": ["@devqxi/pubdev-mcp-server"]
    }
  }
}
```

### Alternative Configuration (Local Installation)

If you've installed from source or want to use a local build:

```json
{
  "mcpServers": {
    "pubdev": {
      "command": "node",
      "args": ["/path/to/pubdev-mcp-server/dist/pubdev-mcp.js"]
    }
  }
}
```

### Other MCP Clients

For other MCP-compatible clients, use:

```bash
npx @devqxi/pubdev-mcp-server
```

## Available Tools

### 1. get_package_info

Retrieve comprehensive information about a specific package.

**Parameters:**
- `packageName` (string, required): Name of the package

**Example Usage:**
```
Get information about the "http" package
```

**Response includes:**
- Package metadata (name, version, description, homepage, repository)
- Statistics (likes, points, popularity)
- Dependencies and dev dependencies
- Publishers and uploaders

### 2. search_packages

Search for packages with advanced filtering options.

**Parameters:**
- `query` (string, required): Search query
- `sort` (string, optional): Sort order - "top", "text", "created", "updated", "popularity", "points", "likes"
- `page` (number, optional): Page number for pagination (default: 1)

**Example Usage:**
```
Search for state management packages sorted by popularity
```

### 3. check_package_updates

Check if a package has available updates.

**Parameters:**
- `packageName` (string, required): Name of the package
- `currentVersion` (string, optional): Current version to compare against

**Example Usage:**
```
Check if there are updates available for the "flutter" package from version "3.16.0"
```

### 4. get_package_versions

Get version history for a package.

**Parameters:**
- `packageName` (string, required): Name of the package
- `limit` (number, optional): Maximum number of versions to return (default: 10)

**Example Usage:**
```
Get the last 5 versions of the "provider" package
```

### 5. get_documentation_changes

Retrieve documentation content for a package.

**Parameters:**
- `packageName` (string, required): Name of the package
- `version` (string, optional): Specific version (defaults to latest)
- `docType` (string, optional): Type of documentation - "readme", "changelog", "example", "api_docs"

**Example Usage:**
```
Get the README for the latest version of the "dio" package
```

### 6. compare_package_versions

Compare two versions of a package to see differences.

**Parameters:**
- `packageName` (string, required): Name of the package
- `fromVersion` (string, required): Source version
- `toVersion` (string, required): Target version

**Example Usage:**
```
Compare version "1.0.0" to "2.0.0" of the "http" package
```

## Usage Examples

### Basic Package Search
```
Search for HTTP client packages sorted by popularity
```

### Package Analysis
```
Get detailed information about the "flutter_bloc" package including its dependencies
```

### Version Management
```
Check what updates are available for the "provider" package from version "6.0.0"
```

### Documentation Retrieval
```
Get the changelog for version "4.0.0" of the "dio" package
```

### Dependency Comparison
```
Compare the dependencies between version "2.0.0" and "3.0.0" of the "http" package
```

## Development

### Building from Source

```bash
git clone https://github.com/devqxi/pubdev-mcp-server.git
cd pubdev-mcp-server
npm install
npm run build
```

### Testing

Test with MCP Inspector:
```bash
npx @modelcontextprotocol/inspector npx @devqxi/pubdev-mcp-server
```

Run the server directly:
```bash
npm run start
```

### Project Structure

```
pubdev-mcp-server/
├── src/
│   └── pubdev-mcp.ts          # Main server implementation
├── dist/                      # Compiled JavaScript output
├── package.json
├── tsconfig.json
└── README.md
```

## API Reference

The server interacts with the official pub.dev API:
- Package Information: `https://pub.dev/api/packages/{package}`
- Package Search: `https://pub.dev/api/search`
- Version Information: `https://pub.dev/api/packages/{package}/versions`
- Documentation: `https://pub.dev/packages/{package}/{version}/{doc-type}`

## Caching

The server implements intelligent caching:
- **Cache Duration**: 5 minutes per request
- **Cache Keys**: Unique per API endpoint and parameters
- **Memory Efficient**: Automatic cleanup of expired entries

## Error Handling

The server provides comprehensive error handling:
- **Network Errors**: Graceful handling of pub.dev API failures
- **Invalid Packages**: Clear error messages for non-existent packages
- **Rate Limiting**: Respectful API usage with built-in delays
- **Malformed Requests**: Detailed validation error messages

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Setup

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Install dependencies (`npm install`)
4. Make your changes
5. Build and test (`npm run build && npm test`)
6. Commit your changes (`git commit -m 'Add some amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- **Issues**: [GitHub Issues](https://github.com/devqxi/pubdev-mcp-server/issues)
- **Documentation**: [GitHub Wiki](https://github.com/devqxi/pubdev-mcp-server/wiki)
- **Discussions**: [GitHub Discussions](https://github.com/devqxi/pubdev-mcp-server/discussions)

## Changelog

### v1.0.0
- Initial release
- Support for all major pub.dev API endpoints
- Caching implementation
- Comprehensive error handling
- Full MCP protocol compliance

---

Made with ❤️ by [@devqxi](https://github.com/devqxi)

*This project is not affiliated with or endorsed by the Dart or Flutter teams.*
