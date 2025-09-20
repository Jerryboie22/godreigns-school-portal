import { useEffect } from 'react';
import { updateSitemap } from '@/utils/sitemapGenerator';

export const useSitemapUpdate = (dependencies: any[] = []) => {
  useEffect(() => {
    // Update sitemap when dependencies change
    const timer = setTimeout(() => {
      updateSitemap();
    }, 1000);

    return () => clearTimeout(timer);
  }, dependencies);
};