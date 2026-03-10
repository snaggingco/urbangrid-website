import { apiRequest } from "./queryClient";

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

// Safe gtag wrapper — queues calls if script hasn't loaded yet
function safeGtag(...args: any[]) {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag === 'function') {
    window.gtag(...args);
  } else {
    // Push directly to dataLayer as a fallback queue
    window.dataLayer.push(args);
  }
}

export const trackConversion = (type: string = 'conversion') => {
  if (type === 'lead_form') {
    safeGtag('event', 'conversion', {
      send_to: 'AW-11443889137/L_xgCJG38ogbEPHH79Aq',
      value: 1.0,
      currency: 'AED'
    });
  }

  if (type === 'call_click') {
    safeGtag('event', 'conversion', {
      send_to: 'AW-11443889137/AAjKCJLTn4McEPHH79Aq',
      value: 1.0,
      currency: 'AED'
    });
  }

  if (type === 'whatsapp_click') {
    safeGtag('event', 'conversion', {
      send_to: 'AW-11443889137/L_xgCJG38ogbEPHH79Aq',
      value: 1.0,
      currency: 'AED'
    });
  }

  safeGtag('event', type, {
    event_category: 'engagement',
    event_label: type
  });

  try {
    apiRequest('POST', '/api/track-conversion', {
      conversionType: type,
      path: window.location.pathname + window.location.search
    }).catch(err => console.error('Failed to log conversion to DB:', err));
  } catch (err) {
    console.error('Error calling apiRequest for conversion:', err);
  }
};

export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  safeGtag('event', eventName, parameters);
};
