// Performance utilities for optimizing load times and reducing render blocking

export const preloadCriticalResources = () => {
  const resources = [
    {
      href: 'https://fonts.gstatic.com/s/inter/v19/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff2',
      as: 'font',
      type: 'font/woff2',
      crossorigin: true
    },
    {
      href: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=85',
      as: 'image',
      fetchpriority: 'high'
    }
  ];

  resources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource.href;
    link.as = resource.as;
    
    if (resource.type) link.type = resource.type;
    if (resource.crossorigin) link.crossOrigin = 'anonymous';
    if (resource.fetchpriority) (link as any).fetchPriority = resource.fetchpriority;
    
    document.head.appendChild(link);
  });
};

export const optimizeNonCriticalResources = () => {
  // Defer non-critical CSS
  const fontAwesome = document.querySelector('link[href*="font-awesome"]');
  if (fontAwesome && fontAwesome instanceof HTMLLinkElement) {
    fontAwesome.media = 'print';
    fontAwesome.onload = () => {
      fontAwesome.media = 'all';
    };
  }
};

export const scheduleNonCriticalWork = (callback: () => void, delay: number = 2000) => {
  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(callback);
  } else {
    setTimeout(callback, delay);
  }
};

// Intersection Observer for lazy loading
export const createLazyObserver = (callback: (entry: IntersectionObserverEntry) => void) => {
  if ('IntersectionObserver' in window) {
    return new IntersectionObserver(
      (entries) => {
        entries.forEach(callback);
      },
      {
        rootMargin: '50px',
        threshold: 0.1
      }
    );
  }
  return null;
};

// Performance monitoring
export const measurePerformance = () => {
  if ('performance' in window && 'getEntriesByType' in performance) {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paint = performance.getEntriesByType('paint');
    
    return {
      domContentLoaded: navigation?.domContentLoadedEventEnd - (navigation as any)?.navigationStart,
      firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime,
      largestContentfulPaint: paint.find(p => p.name === 'largest-contentful-paint')?.startTime
    };
  }
  return null;
};