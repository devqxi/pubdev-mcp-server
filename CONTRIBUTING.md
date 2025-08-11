# Contributing to Pub.dev MCP Server

Thank you for your interest in contributing to the Pub.dev MCP Server! This document provides guidelines and information for contributors.

## Code of Conduct

Please be respectful and constructive in all interactions. We're all here to build something useful together.

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm or yarn
- Git
- TypeScript knowledge
- Basic understanding of Model Context Protocol (MCP)

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/your-username/pubdev-mcp-server.git
   cd pubdev-mcp-server
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Build the Project**
   ```bash
   npm run build
   ```

4. **Test Your Setup**
   ```bash
   npm run dev
   ```

## Project Structure

```
pubdev-mcp-server/
├── src/
│   └── pubdev-mcp.ts          # Main server implementation
├── dist/                      # Compiled output (generated)
├── test/                      # Test files
├── .github/                   # GitHub Actions workflows
├── package.json               # Project configuration
├── tsconfig.json             # TypeScript configuration
├── README.md                 # Main documentation
├── INSTALLATION.md           # Installation guide
├── CONTRIBUTING.md           # This file
└── LICENSE                   # MIT License
```

## Development Workflow

### Making Changes

1. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/issue-description
   ```

2. **Make Your Changes**
   - Edit files in the `src/` directory
   - Follow the existing code style
   - Add comments for complex logic

3. **Test Your Changes**
   ```bash
   # Build the project
   npm run build
   
   # Test manually
   npm run dev
   
   # Test with MCP Inspector
   npx @modelcontextprotocol/inspector npm run dev
   ```

4. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   # or
   git commit -m "fix: resolve issue with xyz"
   ```

### Commit Message Format

Use conventional commits format:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Examples:
```
feat: add package comparison tool
fix: handle undefined package versions
docs: update installation instructions
refactor: improve caching mechanism
```

## Types of Contributions

### 🐛 Bug Reports

When reporting bugs, please include:

1. **Clear Description**: What happened vs. what you expected
2. **Steps to Reproduce**: Detailed steps to recreate the issue
3. **Environment**: OS, Node.js version, package version
4. **Error Messages**: Full error output and logs
5. **Additional Context**: Any other relevant information

**Template:**
```markdown
**Bug Description**
A clear description of the bug.

**To Reproduce**
Steps to reproduce:
1. Configure server with...
2. Call tool '...' with parameters...
3. See error

**Expected Behavior**
What you expected to happen.

**Environment**
- OS: [e.g., Windows 11, Ubuntu 20.04]
- Node.js: [e.g., 18.17.0]
- Package Version: [e.g., 1.0.0]

**Error Output**
```
paste error messages here
```
```

### 💡 Feature Requests

For new features:

1. **Use Case**: Describe why this feature would be useful
2. **Proposed Solution**: How you envision it working
3. **Alternatives**: Other approaches you've considered
4. **Implementation**: Any thoughts on how to implement it

### 🔧 Code Contributions

#### Areas for Contribution

1. **New Tools**: Add new MCP tools for pub.dev functionality
2. **Performance**: Improve caching, reduce API calls
3. **Error Handling**: Better error messages and recovery
4. **Documentation**: Improve or fix documentation
5. **Testing**: Add automated tests
6. **Code Quality**: Refactoring and optimization

#### Pull Request Process

1. **Before Starting**: Check if there's an existing issue or discussion
2. **Small Changes**: For minor fixes, feel free to submit directly
3. **Large Changes**: Open an issue to discuss first

#### Pull Request Checklist

- [ ] Code follows the existing style
- [ ] Build passes (`npm run build`)
- [ ] Manual testing completed
- [ ] Documentation updated (if needed)
- [ ] Commit messages follow conventional format
- [ ] No breaking changes (unless discussed)

## Testing

### Manual Testing

1. **Basic Functionality**
   ```bash
   npm run build
   npm run dev
   ```

2. **With MCP Inspector**
   ```bash
   npx @modelcontextprotocol/inspector npm run dev
   ```

3. **Test Scenarios**
   - Search for packages
   - Get package information
   - Check for updates
   - Compare versions
   - Get documentation

### Adding Tests

We welcome contributions to improve test coverage:

1. **Unit Tests**: Test individual functions
2. **Integration Tests**: Test API interactions
3. **End-to-End Tests**: Test complete workflows

## API Guidelines

### Adding New Tools

When adding new MCP tools:

1. **Follow Pattern**: Look at existing tools for structure
2. **Input Schema**: Define clear, typed parameters
3. **Error Handling**: Handle all error cases gracefully
4. **Documentation**: Update README with new tool info
5. **Caching**: Use caching for expensive operations

### Example Tool Structure

```typescript
{
  name: "tool_name",
  description: "Clear description of what the tool does",
  inputSchema: {
    type: "object",
    properties: {
      requiredParam: {
        type: "string",
        description: "What this parameter does"
      },
      optionalParam: {
        type: "number",
        description: "Optional parameter with default"
      }
    },
    required: ["requiredParam"]
  }
}
```

## Documentation

### Writing Documentation

- **Clear and Concise**: Use simple language
- **Examples**: Include practical examples
- **Up-to-Date**: Keep docs synchronized with code changes
- **User-Focused**: Write from the user's perspective

### Documentation Types

1. **README.md**: Main project documentation
2. **INSTALLATION.md**: Setup and configuration
3. **CONTRIBUTING.md**: This file
4. **Code Comments**: Inline documentation
5. **GitHub Wiki**: Extended documentation

## Release Process

### Versioning

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR** (1.0.0): Breaking changes
- **MINOR** (0.1.0): New features, backward compatible
- **PATCH** (0.0.1): Bug fixes, backward compatible

### Release Checklist

1. Update version in `package.json`
2. Update CHANGELOG.md
3. Test thoroughly
4. Create GitHub release
5. NPM publish happens automatically

## Getting Help

### Questions?

- **GitHub Discussions**: General questions and ideas
- **GitHub Issues**: Bugs and feature requests
- **Code Review**: Submit PRs for feedback

### Resources

- [Model Context Protocol Specification](https://modelcontextprotocol.io/)
- [Pub.dev API Documentation](https://pub.dev/help/api)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## Recognition

Contributors will be recognized in:

- GitHub contributors list
- Release notes for significant contributions
- README acknowledgments section

Thank you for contributing to make this project better! 🚀