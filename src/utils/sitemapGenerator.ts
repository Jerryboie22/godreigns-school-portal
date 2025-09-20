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

  // Static pages with priorities
  const staticPages = [
    { path: '/', priority: 1.0, changefreq: 'daily' as const },
    { path: '/about', priority: 0.8, changefreq: 'monthly' as const },
    { path: '/admissions', priority: 0.9, changefreq: 'monthly' as const },
    { path: '/contact', priority: 0.7, changefreq: 'monthly' as const },
    { path: '/gallery', priority: 0.8, changefreq: 'weekly' as const },
    { path: '/library', priority: 0.6, changefreq: 'monthly' as const },
    { path: '/school-fees', priority: 0.7, changefreq: 'monthly' as const },
    { path: '/e-learning', priority: 0.8, changefreq: 'weekly' as const },
    { path: '/portals', priority: 0.7, changefreq: 'monthly' as const },
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
      .select('id, updated_at, created_at')
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (posts) {
      posts.forEach(post => {
        urls.push({
          loc: `${baseUrl}/blog/${post.id}`,
          lastmod: post.updated_at.split('T')[0],
          priority: 0.8,
          changefreq: 'weekly'
        });
      });
    }

    // Fetch gallery images
    const { data: galleryImages } = await supabase
      .from('gallery_images')
      .select('id, created_at')
      .order('created_at', { ascending: false });

    if (galleryImages && galleryImages.length > 0) {
      // Add gallery page with latest image date
      const latestImageDate = galleryImages[0].created_at.split('T')[0];
      const galleryIndex = urls.findIndex(url => url.loc.includes('/gallery'));
      if (galleryIndex !== -1) {
        urls[galleryIndex].lastmod = latestImageDate;
      }
    }
  } catch (error) {
    console.error('Error fetching content for sitemap:', error);
  }

  // Generate XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <priority>${url.priority}</priority>
    <changefreq>${url.changefreq}</changefreq>
  </url>`).join('\n')}
</urlset>`;

  return xml;
};

export const updateSitemap = async (): Promise<void> => {
  try {
    const sitemapXml = await generateSitemap();
    
    // In a real deployment, you would write this to public/sitemap.xml
    // For now, we'll create a function that can be called to generate the sitemap
    console.log('Sitemap generated successfully');
    
    // Save to localStorage for demo purposes (in production, this would be saved to the server)
    localStorage.setItem('generatedSitemap', sitemapXml);
  } catch (error) {
    console.error('Error updating sitemap:', error);
  }
};