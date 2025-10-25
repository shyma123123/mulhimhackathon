/**
 * Analytics Service for SmartShield Extension
 * Handles analytics tracking and reporting
 */

export class AnalyticsService {
  static async trackEvent(eventType: string, data: any = {}): Promise<void> {
    try {
      const event = {
        type: eventType,
        data,
        timestamp: new Date().toISOString(),
        url: (await chrome.tabs.query({ active: true, currentWindow: true }))[0]?.url || 'unknown'
      };

      // Store locally
      const events = await this.getStoredEvents();
      events.push(event);
      
      // Keep only last 100 events
      if (events.length > 100) {
        events.splice(0, events.length - 100);
      }
      
      await chrome.storage.local.set({ analytics: events });
      
      // Send to backend if available
      await this.sendToBackend(event);
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  }

  static async getStoredEvents(): Promise<any[]> {
    try {
      const result = await chrome.storage.local.get('analytics');
      return result.analytics || [];
    } catch (error) {
      console.error('Analytics get error:', error);
      return [];
    }
  }

  static async sendToBackend(event: any): Promise<void> {
    try {
      // Try to send to backend API
      const response = await fetch('http://localhost:4000/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event)
      });
      
      if (!response.ok) {
        console.log('Backend not available for analytics');
      }
    } catch (error) {
      // Backend not available - this is expected in development
      console.log('Analytics: Backend not available');
    }
  }
}

