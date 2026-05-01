import { logEvent, setUserId, setUserProperties } from 'firebase/analytics';
import type { UserRole } from '../types';
import { getFirebaseAnalytics } from './firebase';

type AnalyticsPayload = Record<string, string | number | boolean | undefined>;

export async function trackEvent(eventName: string, payload: AnalyticsPayload = {}) {
  try {
    const analytics = await getFirebaseAnalytics();
    if (!analytics) return;
    logEvent(analytics, eventName, payload);
  } catch (error) {
    console.error('Analytics event failed', error);
  }
}

export async function identifyUser(userIdValue: string, role: UserRole) {
  try {
    const analytics = await getFirebaseAnalytics();
    if (!analytics) return;
    setUserId(analytics, userIdValue);
    setUserProperties(analytics, { role });
  } catch (error) {
    console.error('Analytics identify failed', error);
  }
}
