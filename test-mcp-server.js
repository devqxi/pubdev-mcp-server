import { spawn } from 'child_process';
import { createInterface } from 'readline';

// Test messages to send to your MCP server
const testMessages = [
  // Initialize
  {
    jsonrpc: "2.0",
    id: 1,
    method: "initialize",
    params: {
      protocolVersion: "2024-11-05",
      capabilities: {},
      clientInfo: { name: "test-client", version: "1.0.0" }
    }
  },
  // List available tools
  {
    jsonrpc: "2.0",
    id: 2,
    method: "tools/list",
    params: {}
  },
  // Test getting package info for a popular Flutter package
  {
    jsonrpc: "2.0",
    id: 3,
    method: "tools/call",
    params: {
      name: "get_package_info",
      arguments: {
        packageName: "flutter"
      }
    }
  },
  // Test searching for packages
  {
    jsonrpc: "2.0",
    id: 4,
    method: "tools/call",
    params: {
      name: "search_packages",
      arguments: {
        query: "http",
        sort: "top",
        page: 1
      }
    }
  }
];

async function testMCPServer() {
  console.log('Starting MCP Server test...\n');
  
  // Spawn your MCP server
  const serverProcess = spawn('node', ['dist/pubdev-mcp.js'], {
    stdio: ['pipe', 'pipe', 'pipe']
  });

  // Handle server output
  serverProcess.stdout.on('data', (data) => {
    const response = data.toString().trim();
    if (response) {
      console.log('Server Response:');
      try {
        const parsed = JSON.parse(response);
        console.log(JSON.stringify(parsed, null, 2));
      } catch (e) {
        console.log(response);
      }
      console.log('\n' + '='.repeat(50) + '\n');
    }
  });

  serverProcess.stderr.on('data', (data) => {
    console.error('Server Error:', data.toString());
  });

  // Send test messages with delay
  for (let i = 0; i < testMessages.length; i++) {
    const message = testMessages[i];
    console.log(`Sending test ${i + 1}: ${message.method}`);
    console.log(JSON.stringify(message, null, 2));
    console.log('\n');
    
    serverProcess.stdin.write(JSON.stringify(message) + '\n');
    
    // Wait a bit between messages
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  // Clean up
  setTimeout(() => {
    serverProcess.kill();
    process.exit(0);
  }, 5000);
}

testMCPServer().catch(console.error);