// Analytics service for Chrome extension
export interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
  timestamp?: number;
}

export class AnalyticsService {
  private static instance: AnalyticsService;
  private events: AnalyticsEvent[] = [];

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  track(event: string, properties?: Record<string, any>): void {
    const analyticsEvent: AnalyticsEvent = {
      event,
      properties,
      timestamp: Date.now()
    };

    this.events.push(analyticsEvent);
    console.log('Analytics event:', analyticsEvent);

    // Send to backend if available
    this.sendToBackend(analyticsEvent);
  }

  private async sendToBackend(event: AnalyticsEvent): Promise<void> {
    try {
      const config = await this.getConfig();
      if (config?.apiEndpoint) {
        await fetch(`${config.apiEndpoint}/api/analytics`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(event)
        });
      }
    } catch (error) {
      console.error('Failed to send analytics to backend:', error);
    }
  }

  private async getConfig(): Promise<any> {
    try {
      const result = await chrome.storage.sync.get(['settings']);
      return result.settings;
    } catch (error) {
      console.error('Failed to get config:', error);
      return null;
    }
  }

  getEvents(): AnalyticsEvent[] {
    return [...this.events];
  }

  clearEvents(): void {
    this.events = [];
  }
}
