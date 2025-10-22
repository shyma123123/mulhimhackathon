/**
 * Analytics Service for Chrome Extension
 * 
 * Handles analytics data collection and transmission
 */

import { StorageService } from './storage';

export interface AnalyticsEvent {
  event: string;
  data: Record<string, any>;
  timestamp?: number;
}

export class AnalyticsService {
  private static pendingEvents: AnalyticsEvent[] = [];

  /**
   * Track an analytics event
   */
  static async trackEvent(event: string, data: Record<string, any> = {}): Promise<void> {
    try {
      const analyticsEvent: AnalyticsEvent = {
        event,
        data: {
          ...data,
          url: window.location?.href || 'unknown',
          userAgent: navigator.userAgent,
          timestamp: Date.now()
        },
        timestamp: Date.now()
      };

      // Store locally first
      await this.storeEvent(analyticsEvent);

      // Try to send to backend
      try {
        await this.sendEvent(analyticsEvent);
      } catch (error) {
        console.warn('Failed to send analytics event, will retry later:', error);
        this.pendingEvents.push(analyticsEvent);
      }

    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  }

  /**
   * Store event locally
   */
  private static async storeEvent(event: AnalyticsEvent): Promise<void> {
    try {
      const events = await StorageService.get('analytics_events') || [];
      events.push(event);
      
      // Keep only last 100 events
      if (events.length > 100) {
        events.splice(0, events.length - 100);
      }
      
      await StorageService.set('analytics_events', events);
    } catch (error) {
      console.error('Failed to store analytics event:', error);
    }
  }

  /**
   * Send event to backend
   */
  private static async sendEvent(event: AnalyticsEvent): Promise<void> {
    try {
      // This would send to the backend API
      // For now, just log the event
      console.log('Analytics event:', event);
      
      // In a real implementation:
      // await fetch('http://localhost:4000/api/analytics', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(event)
      // });
      
    } catch (error) {
      console.error('Failed to send analytics event:', error);
      throw error;
    }
  }

  /**
   * Sync pending events
   */
  static async syncPendingEvents(): Promise<void> {
    try {
      const events = [...this.pendingEvents];
      this.pendingEvents = [];

      for (const event of events) {
        try {
          await this.sendEvent(event);
        } catch (error) {
          console.warn('Failed to sync event, re-queuing:', error);
          this.pendingEvents.push(event);
        }
      }

    } catch (error) {
      console.error('Failed to sync pending events:', error);
    }
  }

  /**
   * Get analytics summary
   */
  static async getSummary(): Promise<any> {
    try {
      const events = await StorageService.get('analytics_events') || [];
      
      const summary = {
        totalEvents: events.length,
        eventTypes: {},
        lastEvent: events[events.length - 1]?.timestamp || null
      };

      // Count event types
      events.forEach(event => {
        summary.eventTypes[event.event] = (summary.eventTypes[event.event] || 0) + 1;
      });

      return summary;
    } catch (error) {
      console.error('Failed to get analytics summary:', error);
      return null;
    }
  }
}
