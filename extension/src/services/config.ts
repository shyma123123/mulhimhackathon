// Configuration service for Chrome extension
export interface ExtensionConfig {
  apiEndpoint: string;
  autoScan: boolean;
  notifications: boolean;
  strictMode: boolean;
  debugMode: boolean;
  enabled: boolean;
  dataRetentionDays: number;
}

export class ConfigService {
  private static instance: ConfigService;
  private config: ExtensionConfig = {
    apiEndpoint: 'http://localhost:3001',
    autoScan: true,
    notifications: true,
    strictMode: false,
    debugMode: false,
    enabled: true,
    dataRetentionDays: 30
  };

  static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService();
    }
    return ConfigService.instance;
  }

  async loadConfig(): Promise<ExtensionConfig> {
    try {
      const result = await chrome.storage.sync.get(['settings']);
      if (result.settings) {
        this.config = { ...this.config, ...result.settings };
      }
    } catch (error) {
      console.error('Failed to load config:', error);
    }
    return this.config;
  }

  async saveConfig(config: Partial<ExtensionConfig>): Promise<void> {
    try {
      this.config = { ...this.config, ...config };
      await chrome.storage.sync.set({ settings: this.config });
    } catch (error) {
      console.error('Failed to save config:', error);
    }
  }

  getConfig(): ExtensionConfig {
    return { ...this.config };
  }

  getApiEndpoint(): string {
    return this.config.apiEndpoint;
  }

  isAutoScanEnabled(): boolean {
    return this.config.autoScan;
  }

  areNotificationsEnabled(): boolean {
    return this.config.notifications;
  }

  isStrictModeEnabled(): boolean {
    return this.config.strictMode;
  }

  isDebugModeEnabled(): boolean {
    return this.config.debugMode;
  }
}
