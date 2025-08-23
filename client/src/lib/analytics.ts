// Google Analytics conversion tracking utility
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

// Track Google Ads conversion event
export const trackConversion = () => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'conversion', {
      'send_to': 'AW-11443889137/L_xgCJG38ogbEPHH79Aq',
      'value': 1.0,
      'currency': 'AED'
    });
  }
};

// Track custom events for additional analytics
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, parameters);
  }
};