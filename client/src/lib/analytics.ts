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
    // Lead Form Submission
    if (type === 'lead_form') {
      window.gtag('event', 'conversion', {
        'send_to': 'AW-11443889137/L_xgCJG38ogbEPHH79Aq',
        'value': 1.0,
        'currency': 'AED'
      });
    }
    
    // Call Click
    if (type === 'call_click') {
      window.gtag('event', 'conversion', {
        'send_to': 'AW-11443889137/k-VpCJ7S4YAbEPHH79Aq',
        'value': 1.0,
        'currency': 'AED'
      });
    }

    // WhatsApp Click
    if (type === 'whatsapp_click') {
      window.gtag('event', 'conversion', {
        'send_to': 'AW-11443889137/L_xgCJG38ogbEPHH79Aq', // Using the active lead label as requested or fallback
        'value': 1.0,
        'currency': 'AED'
      });
    }

    // Backup: Send a generic event that GTM can also listen for
    window.gtag('event', type, {
      'event_category': 'engagement',
      'event_label': type
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