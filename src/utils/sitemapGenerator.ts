import { supabase } from "@/integrations/supabase/client";

export interface SitemapUrl {
  loc: string;
  lastmod: string;
  priority: number;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
}

export const generateSitemap = async (): Promise<string> => {
  const baseUrl = 'https://ogrcs.com';
  const urls: SitemapUrl[] = [];

  // Static pages with SEO-optimized priorities and change frequencies
  const staticPages = [
    { path: '/', priority: 1.0, changefreq: 'daily' as const },
    { path: '/about', priority: 0.9, changefreq: 'monthly' as const },
    { path: '/admissions', priority: 0.95, changefreq: 'weekly' as const },
    { path: '/contact', priority: 0.8, changefreq: 'monthly' as const },
    { path: '/gallery', priority: 0.85, changefreq: 'weekly' as const },
    { path: '/library', priority: 0.7, changefreq: 'monthly' as const },
    { path: '/school-fees', priority: 0.8, changefreq: 'monthly' as const },
    { path: '/e-learning', priority: 0.8, changefreq: 'weekly' as const },
    { path: '/portals', priority: 0.6, changefreq: 'monthly' as const },
    { path: '/blog', priority: 0.9, changefreq: 'daily' as const },
  ];

  // Add static pages
  staticPages.forEach(page => {
    urls.push({
      loc: `${baseUrl}${page.path}`,
      lastmod: new Date().toISOString().split('T')[0],
      priority: page.priority,
      changefreq: page.changefreq
    });
  });

  try {
    // Fetch published blog posts
    const { data: posts } = await supabase
      .from('posts')
      .select('id, slug, updated_at, created_at, title')
      .eq('published', true)
      .order('created_at', { ascending: false });

    if (posts) {
      posts.forEach(post => {
        urls.push({
          loc: `${baseUrl}/blog/${post.slug || post.id}`,
          lastmod: post.updated_at ? post.updated_at.split('T')[0] : post.created_at.split('T')[0],
          priority: 0.85,
          changefreq: 'weekly'
        });
      });
    }

    // Fetch gallery images for dynamic lastmod
    const { data: galleryImages } = await supabase
      .from('gallery_images')
      .select('id, created_at')
      .order('created_at', { ascending: false })
      .limit(1);

    if (galleryImages && galleryImages.length > 0) {
      // Update gallery page with latest image date
      const latestImageDate = galleryImages[0].created_at.split('T')[0];
      const galleryIndex = urls.findIndex(url => url.loc.includes('/gallery'));
      if (galleryIndex !== -1) {
        urls[galleryIndex].lastmod = latestImageDate;
      }
    }

    // Fetch homepage content for dynamic lastmod
    const { data: homepageContent } = await supabase
      .from('homepage_content')
      .select('updated_at')
      .eq('is_visible', true)
      .order('updated_at', { ascending: false })
      .limit(1);

    if (homepageContent && homepageContent.length > 0) {
      const latestContentDate = homepageContent[0].updated_at.split('T')[0];
      const homeIndex = urls.findIndex(url => url.loc === baseUrl + '/');
      if (homeIndex !== -1) {
        urls[homeIndex].lastmod = latestContentDate;
      }
    }
  } catch (error) {
    console.error('Error fetching content for sitemap:', error);
  }

  // Sort URLs by priority (highest first) for better SEO
  urls.sort((a, b) => b.priority - a.priority);

  // Generate XML with proper schema and encoding
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <priority>${url.priority.toFixed(1)}</priority>
    <changefreq>${url.changefreq}</changefreq>
  </url>`).join('\n')}
</urlset>`;

  return xml;
};

export const updateSitemap = async (): Promise<void> => {
  try {
    const sitemapXml = await generateSitemap();
    
    // Save to localStorage for demo purposes (in production, this would be saved to the server)
    localStorage.setItem('generatedSitemap', sitemapXml);
    console.log('Sitemap generated successfully with', sitemapXml.split('<url>').length - 1, 'URLs');
  } catch (error) {
    console.error('Error updating sitemap:', error);
  }
};