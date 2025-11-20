import { useEffect, useRef } from 'react';
import { useMutation } from 'react-query';
import { useAuthStore } from '../store/authStore';
import apiService from '../services/api.service';
import { API_ENDPOINTS } from '../config/api.config';

/**
 * Hook to track post views
 */
export const usePostView = (postId: string) => {
  const hasTracked = useRef(false);
  const trackTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const trackViewMutation = useMutation(() =>
    apiService.post(`${API_ENDPOINTS.VIEWS?.TRACK || '/api/views'}`, { postId })
  );

  useEffect(() => {
    if (!postId || hasTracked.current) return;

    // Wait 3 seconds before tracking (ensure user actually viewed the post)
    trackTimeout.current = setTimeout(() => {
      if (!hasTracked.current) {
        trackViewMutation.mutate();
        hasTracked.current = true;
      }
    }, 3000);

    return () => {
      if (trackTimeout.current) {
        clearTimeout(trackTimeout.current);
      }
    };
  }, [postId]);

  return { tracked: hasTracked.current };
};

