import { useEffect } from 'react';

// Critical resource preloader for performance optimization
export default function PerformanceOptimizer() {
  useEffect(() => {
    // Preload critical resources that will be needed soon
    const criticalResources = [
      // Critical font files - preload the most used weights
      'https://fonts.gstatic.com/s/inter/v19/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff2',
      // Hero image - most critical LCP resource
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=85'
    ];

    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      
      if (resource.includes('.woff2')) {
        link.as = 'font';
        link.type = 'font/woff2';
        link.crossOrigin = 'anonymous';
      } else if (resource.includes('images.unsplash.com')) {
        link.as = 'image';
        (link as any).fetchPriority = 'high';
      }
      
      link.href = resource;
      document.head.appendChild(link);
    });

    // Remove unused CSS after initial load
    const removeUnusedCSS = () => {
      const stylesheets = document.querySelectorAll('link[rel="stylesheet"]') as NodeListOf<HTMLLinkElement>;
      stylesheets.forEach(sheet => {
        if (sheet.href && sheet.href.includes('font-awesome')) {
          // Move FontAwesome to lower priority after initial load
          sheet.media = 'print';
          sheet.onload = () => {
            sheet.media = 'all';
          };
        }
      });
    };

    // Defer non-critical operations
    const timeoutId = setTimeout(removeUnusedCSS, 1000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return null; // This component doesn't render anything
}