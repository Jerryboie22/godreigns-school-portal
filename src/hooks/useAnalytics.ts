import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useAnalytics = () => {
  useEffect(() => {
    const trackPageView = async () => {
      try {
        // Simple page tracking without database storage
        console.log('Page view tracked:', window.location.pathname);
      } catch (error) {
        console.error('Analytics tracking error:', error);
      }
    };

    trackPageView();
  }, []);
};

export const getAnalytics = async () => {
  try {
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

    return {
      totalViews: 0,
      publishedPosts: posts?.length || 0,
      galleryImages: galleryImages?.length || 0,
      totalStudents: students?.length || 0,
      totalTeachers: teachers?.length || 0,
      monthlyViews: 0
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