import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useAnalytics = () => {
  useEffect(() => {
    const trackPageView = async () => {
      const sessionId = Date.now().toString();
      
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        // Analytics tracking disabled - table not available
        console.log('Page view:', window.location.pathname);
      } catch (error) {
        console.error('Analytics tracking error:', error);
      }
    };

    trackPageView();
  }, []);
};

export const getAnalytics = async () => {
  try {
    // Analytics data disabled - table not available
    const totalViews = { length: 0 };

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
    
    // Monthly analytics data disabled - table not available
    const monthlyViews = { length: 0 };

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