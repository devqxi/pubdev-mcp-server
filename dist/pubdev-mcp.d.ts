#!/usr/bin/env node
declare class PubDevMCPServer {
    private server;
    private packageCache;
    private readonly CACHE_DURATION;
    constructor();
    private setupToolHandlers;
    private fetchWithCache;
    private getPackageInfo;
    private checkPackageUpdates;
    private getPackageVersions;
    private getDocumentationChanges;
    private comparePackageVersions;
    private searchPackages;
    private compareVersions;
    private compareDependencies;
    private extractTextFromHtml;
    start(): Promise<void>;
}
export default PubDevMCPServer;
