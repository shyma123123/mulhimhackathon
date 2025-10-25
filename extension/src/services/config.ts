/**
 * Configuration Service for SmartShield Extension
 * Handles extension configuration and settings
 */

export interface ExtensionConfig {
  enabled: boolean;
  apiUrl: string;
  detectionThreshold: number;
  showNotifications: boolean;
  autoScan: boolean;
}

export class ConfigService {
  private static defaultConfig: ExtensionConfig = {
    enabled: true,
    apiUrl: 'http://localhost:4000',
    detectionThreshold: 0.7,
    showNotifications: true,
    autoScan: true
  };

  static async getConfig(): Promise<ExtensionConfig> {
    try {
      const result = await chrome.storage.local.get('config');
      return { ...this.defaultConfig, ...result.config };
    } catch (error) {
      console.error('Config get error:', error);
      return this.defaultConfig;
    }
  }

  static async setConfig(config: Partial<ExtensionConfig>): Promise<void> {
    try {
      const currentConfig = await this.getConfig();
      const newConfig = { ...currentConfig, ...config };
      await chrome.storage.local.set({ config: newConfig });
    } catch (error) {
      console.error('Config set error:', error);
    }
  }

  static async resetConfig(): Promise<void> {
    try {
      await chrome.storage.local.set({ config: this.defaultConfig });
    } catch (error) {
      console.error('Config reset error:', error);
    }
  }
}

