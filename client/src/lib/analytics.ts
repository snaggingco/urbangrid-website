import { apiRequest } from "./queryClient";

// Google Analytics conversion tracking utility
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

// Track Google Ads conversion event
export const trackConversion = (type: string = 'conversion') => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'conversion', {
      'send_to': 'AW-11443889137/L_xgCJG38ogbEPHH79Aq',
      'value': 1.0,
      'currency': 'AED'
    });
  }
  
  // Also track in our own database
  try {
    apiRequest('POST', '/api/track-conversion', {
      conversionType: type,
      path: window.location.pathname + window.location.search
    }).catch(err => console.error('Failed to log conversion to DB:', err));
  } catch (err) {
    console.error('Error calling apiRequest for conversion:', err);
  }
};

// Track custom events for additional analytics
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, parameters);
  }
};