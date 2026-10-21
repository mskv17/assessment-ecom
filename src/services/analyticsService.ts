import type { AnalyticsEventName, AnalyticsPayloads, AnalyticsEvent } from '@/types/analytics'

class AnalyticsService {
  private eventsLog: AnalyticsEvent[] = []
  private isLoggingEnabled: boolean

  constructor() {
    this.isLoggingEnabled = import.meta.env.VITE_ENABLE_ANALYTICS_LOGS === 'true'
  }

  /**
   * Tracks an e-commerce funnel event.
   * Does NOT collect personal data or transmit private secrets.
   */
  public trackEvent<K extends AnalyticsEventName>(
    name: K,
    payload: AnalyticsPayloads[K]
  ): void {
    const event: AnalyticsEvent<K> = {
      name,
      timestamp: new Date().toISOString(),
      payload,
    }

    this.eventsLog.push(event)

    if (this.isLoggingEnabled && import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.info(`[Analytics Track] %c${name}`, 'color: #10B981; font-weight: bold;', payload)
    }

    // Future integration point:
    // if (window.gtag) { window.gtag('event', name, payload); }
  }

  /**
   * Returns recent recorded events for debugging or automated testing.
   */
  public getRecordedEvents(): AnalyticsEvent[] {
    return [...this.eventsLog]
  }

  /**
   * Clears recorded events in test environments.
   */
  public clear(): void {
    this.eventsLog = []
  }
}

export const analytics = new AnalyticsService()
