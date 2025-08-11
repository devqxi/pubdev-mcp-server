# Pub.dev MCP Server

A **Model Context Protocol (MCP)** server for [pub.dev](https://pub.dev), the official package repository for Dart and Flutter.  
It allows AI assistants to **search**, **analyze**, and **retrieve** detailed information about Dart/Flutter packages.

---

## ✨ Features
- 🔍 **Package Search** – Advanced filtering & sorting  
- 📦 **Package Information** – Metadata, dependencies, statistics  
- 🔄 **Version Management** – Check updates, compare versions, track history  
- 📚 **Documentation Access** – README, changelog, examples, API docs  
- ⚡ **Caching** – Built-in 5-minute intelligent cache  
- 🛠 **Dependency Analysis** – Compare dependencies between versions  

---

## 📦 Installation

### NPM (Recommended)
```bash
npm install -g @devqxi/pubdev-mcp-server
```

### From Source
```bash
git clone https://github.com/devqxi/pubdev-mcp-server.git
cd pubdev-mcp-server
npm install
npm run build
npm run start
```

---

## ⚙️ Configuration

### Claude Desktop
1. Locate your configuration file:  
   - **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`  
   - **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`  
   - **Linux**: `~/.config/Claude/claude_desktop_config.json`

2. Add:
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

3. Restart Claude Desktop.

**Local Build Example**:
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

**Other MCP Clients**:
```bash
npx @devqxi/pubdev-mcp-server
```

---

## 🛠 Available Tools

| Tool | Description | Key Parameters |
|------|-------------|----------------|
| **get_package_info** | Retrieve package metadata, stats, dependencies, publishers | `packageName` |
| **search_packages** | Search with filters and sorting | `query`, `sort`, `page` |
| **check_package_updates** | Check if updates are available | `packageName`, `currentVersion` |
| **get_package_versions** | Get version history | `packageName`, `limit` |
| **get_documentation_changes** | Get README, changelog, examples, API docs | `packageName`, `version`, `docType` |
| **compare_package_versions** | Compare dependencies & changes between versions | `packageName`, `fromVersion`, `toVersion` |

---

## 📖 Example Commands

- **Search Packages**  
  _"Search for state management packages sorted by popularity"_

- **Package Details**  
  _"Get information about the flutter_bloc package"_

- **Check Updates**  
  _"Check if provider has updates from version 6.0.0"_

- **Get Docs**  
  _"Get the changelog for dio version 4.0.0"_

- **Compare Versions**  
  _"Compare dependencies between http 2.0.0 and 3.0.0"_

---

## 💻 Development

```bash
git clone https://github.com/devqxi/pubdev-mcp-server.git
cd pubdev-mcp-server
npm install
npm run build
npm run start
```

**Test with MCP Inspector**:
```bash
npx @modelcontextprotocol/inspector npx @devqxi/pubdev-mcp-server
```

---

## 🌐 API Reference
- `https://pub.dev/api/packages/{package}`
- `https://pub.dev/api/search`
- `https://pub.dev/api/packages/{package}/versions`
- `https://pub.dev/packages/{package}/{version}/{doc-type}`

---

## 🛡 Error Handling
- Graceful handling of network & API failures  
- Clear errors for invalid/non-existent packages  
- Built-in delays for respectful rate limiting  
- Detailed validation messages for malformed requests  

---

## 🤝 Contributing
1. Fork & branch (`git checkout -b feature/amazing-feature`)  
2. Install deps (`npm install`)  
3. Build & test (`npm run build && npm test`)  
4. Commit & push (`git commit -m 'Add feature' && git push`)  
5. Open a Pull Request  

---

## 📜 License
MIT – See [LICENSE](LICENSE)

---

## 📢 Support
- [GitHub Issues](https://github.com/devqxi/pubdev-mcp-server/issues)  
- [Wiki](https://github.com/devqxi/pubdev-mcp-server/wiki)  
- [Discussions](https://github.com/devqxi/pubdev-mcp-server/discussions)  

---

## 🆕 Changelog
**v1.0.0**
- Initial release  
- All major pub.dev API endpoints supported  
- Caching & error handling implemented  
- Full MCP protocol compliance  
