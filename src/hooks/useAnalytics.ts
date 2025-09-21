import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useAnalytics = () => {
  useEffect(() => {
    const trackPageView = async () => {
      const sessionId = Date.now().toString();
      
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        await supabase.from('site_analytics').insert({
          page_path: window.location.pathname,
          session_id: sessionId,
          user_id: user?.id || null,
          user_agent: navigator.userAgent
        });
      } catch (error) {
        console.error('Analytics tracking error:', error);
      }
    };

    trackPageView();
  }, []);
};

export const getAnalytics = async () => {
  try {
    const { data: totalViews } = await supabase
      .from('site_analytics')
      .select('id', { count: 'exact' });

    const { data: posts } = await supabase
      .from('posts')
      .select('id', { count: 'exact' })
      .eq('status', 'published');

    const { data: galleryImages } = await supabase
      .from('gallery_images')
      .select('id', { count: 'exact' });

    const { data: students } = await supabase
      .from('students')
      .select('id', { count: 'exact' });

    const { data: teachers } = await supabase
      .from('teachers')
      .select('id', { count: 'exact' });

    // Get monthly views
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    
    const { data: monthlyViews } = await supabase
      .from('site_analytics')
      .select('id', { count: 'exact' })
      .gte('visit_timestamp', oneMonthAgo.toISOString());

    return {
      totalViews: totalViews?.length || 0,
      publishedPosts: posts?.length || 0,
      galleryImages: galleryImages?.length || 0,
      totalStudents: students?.length || 0,
      totalTeachers: teachers?.length || 0,
      monthlyViews: monthlyViews?.length || 0
    };
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return {
      totalViews: 0,
      publishedPosts: 0,
      galleryImages: 0,
      totalStudents: 0,
      totalTeachers: 0,
      monthlyViews: 0
    };
  }
};