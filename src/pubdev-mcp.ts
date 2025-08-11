#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import fetch from "node-fetch";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

interface PackageInfo {
  name: string;
  version: string;
  description?: string;
  homepage?: string;
  repository?: string;
  publishedAt: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

interface PackageVersion {
  version: string;
  publishedAt: string;
  description?: string;
  changelog?: string;
}

interface DocumentationChange {
  type: 'readme' | 'changelog' | 'example' | 'api_docs';
  content: string;
  lastModified?: string;
}

class PubDevMCPServer {
  private server: Server;
  private packageCache: Map<string, { data: any; timestamp: number }> = new Map(); // Changed to 'any' to be more flexible
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  constructor() {
    this.server = new Server(
      {
        name: "pubdev-mcp-server",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: "get_package_info",
            description: "Get detailed information about a Dart/Flutter package from pub.dev",
            inputSchema: {
              type: "object",
              properties: {
                packageName: {
                  type: "string",
                  description: "Name of the package to retrieve information for"
                }
              },
              required: ["packageName"]
            }
          },
          {
            name: "check_package_updates",
            description: "Check for updates to a specific package or compare versions",
            inputSchema: {
              type: "object",
              properties: {
                packageName: {
                  type: "string",
                  description: "Name of the package to check for updates"
                },
                currentVersion: {
                  type: "string",
                  description: "Current version to compare against (optional)"
                }
              },
              required: ["packageName"]
            }
          },
          {
            name: "get_package_versions",
            description: "Get all available versions of a package with their release dates",
            inputSchema: {
              type: "object",
              properties: {
                packageName: {
                  type: "string",
                  description: "Name of the package to get versions for"
                },
                limit: {
                  type: "number",
                  description: "Maximum number of versions to return (default: 10)"
                }
              },
              required: ["packageName"]
            }
          },
          {
            name: "get_documentation_changes",
            description: "Get documentation content and detect changes for a package",
            inputSchema: {
              type: "object",
              properties: {
                packageName: {
                  type: "string",
                  description: "Name of the package to get documentation for"
                },
                version: {
                  type: "string",
                  description: "Specific version (optional, defaults to latest)"
                },
                docType: {
                  type: "string",
                  enum: ["readme", "changelog", "example", "api_docs"],
                  description: "Type of documentation to retrieve"
                }
              },
              required: ["packageName"]
            }
          },
          {
            name: "compare_package_versions",
            description: "Compare two versions of a package and show differences",
            inputSchema: {
              type: "object",
              properties: {
                packageName: {
                  type: "string",
                  description: "Name of the package to compare"
                },
                fromVersion: {
                  type: "string",
                  description: "Source version to compare from"
                },
                toVersion: {
                  type: "string",
                  description: "Target version to compare to"
                }
              },
              required: ["packageName", "fromVersion", "toVersion"]
            }
          },
          {
            name: "search_packages",
            description: "Search for packages on pub.dev with filters",
            inputSchema: {
              type: "object",
              properties: {
                query: {
                  type: "string",
                  description: "Search query"
                },
                sort: {
                  type: "string",
                  enum: ["top", "text", "created", "updated", "popularity", "points", "likes"],
                  description: "Sort order for results"
                },
                page: {
                  type: "number",
                  description: "Page number for pagination (default: 1)"
                }
              },
              required: ["query"]
            }
          }
        ] as Tool[]
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      // Add null check for args
      if (!args) {
        throw new Error('Arguments are required');
      }

      try {
        switch (name) {
          case "get_package_info":
            return await this.getPackageInfo(args.packageName as string);
          
          case "check_package_updates":
            return await this.checkPackageUpdates(
              args.packageName as string,
              args.currentVersion as string
            );
          
          case "get_package_versions":
            return await this.getPackageVersions(
              args.packageName as string,
              args.limit as number
            );
          
          case "get_documentation_changes":
            return await this.getDocumentationChanges(
              args.packageName as string,
              args.version as string,
              args.docType as string
            );
          
          case "compare_package_versions":
            return await this.comparePackageVersions(
              args.packageName as string,
              args.fromVersion as string,
              args.toVersion as string
            );
          
          case "search_packages":
            return await this.searchPackages(
              args.query as string,
              args.sort as string,
              args.page as number
            );

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${error instanceof Error ? error.message : String(error)}`
            }
          ]
        };
      }
    });
  }

  private async fetchWithCache<T>(url: string, cacheKey: string): Promise<T> {
    const cached = this.packageCache.get(cacheKey);
    const now = Date.now();

    if (cached && (now - cached.timestamp) < this.CACHE_DURATION) {
      return cached.data as T;
    }

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'MCP-PubDev-Server/1.0.0',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json() as T;
    this.packageCache.set(cacheKey, { data, timestamp: now });
    return data;
  }

  private async getPackageInfo(packageName: string) {
    const url = `https://pub.dev/api/packages/${packageName}`;
    const data = await this.fetchWithCache<any>(url, `package-${packageName}`);

    const packageInfo: PackageInfo = {
      name: data.name,
      version: data.latest.version,
      description: data.latest.pubspec?.description,
      homepage: data.latest.pubspec?.homepage,
      repository: data.latest.pubspec?.repository,
      publishedAt: data.latest.published,
      dependencies: data.latest.pubspec?.dependencies,
      devDependencies: data.latest.pubspec?.dev_dependencies
    };

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            package: packageInfo,
            stats: {
              likes: data.likes,
              points: data.points,
              popularity: data.popularity
            },
            publishers: data.publishers,
            uploaders: data.uploaders
          }, null, 2)
        }
      ]
    };
  }

  private async checkPackageUpdates(packageName: string, currentVersion?: string) {
    const url = `https://pub.dev/api/packages/${packageName}`;
    const data = await this.fetchWithCache<any>(url, `package-${packageName}`);
    
    const latestVersion = data.latest.version;
    const latestPublished = data.latest.published;
    
    let updateStatus = {
      packageName,
      currentVersion: currentVersion || 'unknown',
      latestVersion,
      latestPublished,
      updateAvailable: false,
      versionsBehind: 0
    };

    if (currentVersion) {
      updateStatus.updateAvailable = this.compareVersions(currentVersion, latestVersion) < 0;
      
      // Get version history to count versions behind
      const versionsUrl = `https://pub.dev/api/packages/${packageName}/versions`;
      const versionsData = await this.fetchWithCache<any>(versionsUrl, `versions-${packageName}`);
      
      const currentIndex = versionsData.versions.findIndex((v: any) => v.version === currentVersion);
      const latestIndex = versionsData.versions.findIndex((v: any) => v.version === latestVersion);
      
      if (currentIndex > -1 && latestIndex > -1) {
        updateStatus.versionsBehind = currentIndex - latestIndex;
      }
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(updateStatus, null, 2)
        }
      ]
    };
  }

  private async getPackageVersions(packageName: string, limit: number = 10) {
    const url = `https://pub.dev/api/packages/${packageName}/versions`;
    const data = await this.fetchWithCache<any>(url, `versions-${packageName}`);
    
    const versions: PackageVersion[] = data.versions
      .slice(0, limit)
      .map((v: any) => ({
        version: v.version,
        publishedAt: v.published,
        description: v.pubspec?.description
      }));

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            packageName,
            totalVersions: data.versions.length,
            versions
          }, null, 2)
        }
      ]
    };
  }

  private async getDocumentationChanges(packageName: string, version?: string, docType: string = 'readme') {
    let baseUrl: string;
    
    if (version) {
      baseUrl = `https://pub.dev/packages/${packageName}/versions/${version}`;
    } else {
      baseUrl = `https://pub.dev/packages/${packageName}`;
    }

    let docUrl: string;
    let contentType: string;

    switch (docType) {
      case 'readme':
        docUrl = `${baseUrl}/readme`;
        contentType = 'README';
        break;
      case 'changelog':
        docUrl = `${baseUrl}/changelog`;
        contentType = 'CHANGELOG';
        break;
      case 'example':
        docUrl = `${baseUrl}/example`;
        contentType = 'Example';
        break;
      case 'api_docs':
        docUrl = `https://pub.dev/documentation/${packageName}/${version || 'latest'}/`;
        contentType = 'API Documentation';
        break;
      default:
        throw new Error(`Unsupported documentation type: ${docType}`);
    }

    try {
      const response = await fetch(docUrl);
      let content: string;
      
      if (response.ok) {
        content = await response.text();
        
        // Extract meaningful content from HTML if needed
        if (docType !== 'api_docs') {
          content = this.extractTextFromHtml(content);
        }
      } else {
        content = `${contentType} not available for this package/version`;
      }

      const docChange: DocumentationChange = {
        type: docType as any,
        content: content.substring(0, 5000), // Limit content size
        lastModified: response.headers.get('last-modified') || undefined
      };

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              packageName,
              version: version || 'latest',
              documentationType: docType,
              documentation: docChange
            }, null, 2)
          }
        ]
      };
    } catch (error) {
      throw new Error(`Failed to fetch documentation: ${error}`);
    }
  }

  private async comparePackageVersions(packageName: string, fromVersion: string, toVersion: string) {
    const versionsUrl = `https://pub.dev/api/packages/${packageName}/versions`;
    const data = await this.fetchWithCache<any>(versionsUrl, `versions-${packageName}`);
    
    const fromVersionData = data.versions.find((v: any) => v.version === fromVersion);
    const toVersionData = data.versions.find((v: any) => v.version === toVersion);
    
    if (!fromVersionData || !toVersionData) {
      throw new Error('One or both versions not found');
    }

    const comparison = {
      packageName,
      comparison: {
        from: {
          version: fromVersion,
          published: fromVersionData.published,
          dependencies: fromVersionData.pubspec?.dependencies || {},
          devDependencies: fromVersionData.pubspec?.dev_dependencies || {}
        },
        to: {
          version: toVersion,
          published: toVersionData.published,
          dependencies: toVersionData.pubspec?.dependencies || {},
          devDependencies: toVersionData.pubspec?.dev_dependencies || {}
        }
      },
      changes: {
        dependencyChanges: this.compareDependencies(
          fromVersionData.pubspec?.dependencies || {},
          toVersionData.pubspec?.dependencies || {}
        ),
        devDependencyChanges: this.compareDependencies(
          fromVersionData.pubspec?.dev_dependencies || {},
          toVersionData.pubspec?.dev_dependencies || {}
        )
      }
    };

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(comparison, null, 2)
        }
      ]
    };
  }

  private async searchPackages(query: string, sort: string = 'top', page: number = 1) {
    const params = new URLSearchParams({
      q: query,
      sort: sort,
      page: page.toString()
    });
    
    const url = `https://pub.dev/api/search?${params}`;
    const data = await this.fetchWithCache<any>(url, `search-${query}-${sort}-${page}`);
    
    const results = {
      query,
      sort,
      page,
      totalResults: data.count,
      packages: data.packages.map((pkg: any) => ({
        name: pkg.package,
        version: pkg.latest.version,
        description: pkg.latest.pubspec?.description,
        points: pkg.points,
        likes: pkg.likes,
        popularity: pkg.popularity,
        publishedAt: pkg.latest.published
      }))
    };

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(results, null, 2)
        }
      ]
    };
  }

  private compareVersions(version1: string, version2: string): number {
    const v1Parts = version1.split('.').map(Number);
    const v2Parts = version2.split('.').map(Number);
    
    for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
      const v1Part = v1Parts[i] || 0;
      const v2Part = v2Parts[i] || 0;
      
      if (v1Part < v2Part) return -1;
      if (v1Part > v2Part) return 1;
    }
    
    return 0;
  }

  private compareDependencies(oldDeps: Record<string, string>, newDeps: Record<string, string>) {
    const changes = {
      added: [] as string[],
      removed: [] as string[],
      updated: [] as { package: string; from: string; to: string }[]
    };

    // Find added dependencies
    for (const [pkg, version] of Object.entries(newDeps)) {
      if (!(pkg in oldDeps)) {
        changes.added.push(`${pkg}: ${version}`);
      }
    }

    // Find removed and updated dependencies
    for (const [pkg, oldVersion] of Object.entries(oldDeps)) {
      if (!(pkg in newDeps)) {
        changes.removed.push(`${pkg}: ${oldVersion}`);
      } else if (newDeps[pkg] !== oldVersion) {
        changes.updated.push({
          package: pkg,
          from: oldVersion,
          to: newDeps[pkg]
        });
      }
    }

    return changes;
  }

  private extractTextFromHtml(html: string): string {
    // Simple HTML tag removal - in production, consider using a proper HTML parser
    return html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]*>/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  async start() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("Pub.dev MCP Server running on stdio");
  }
}

// Start the server
const server = new PubDevMCPServer();
server.start().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});

export default PubDevMCPServer;