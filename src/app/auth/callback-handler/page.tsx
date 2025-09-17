"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../superbase-client';

export default function AuthCallbackHandler() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          router.push('/signin?error=auth_callback_failed');
          return;
        }

        if (data.session) {
          console.log('Session found in callback:', data.session);
          
          // Save Google tokens
          const { provider_token, provider_refresh_token } = data.session;
          
          if (provider_token) {
            localStorage.setItem('google_access_token', provider_token);
            console.log('Google access token saved in callback:', provider_token.substring(0, 20) + '...');
          }
          
          if (provider_refresh_token) {
            localStorage.setItem('google_refresh_token', provider_refresh_token);
            console.log('Google refresh token saved in callback');
          }

          // Redirect to admin dashboard
          router.push('/admin');
        } else {
          console.log('No session found in callback');
          router.push('/signin');
        }
      } catch (error) {
        console.error('Callback handler error:', error);
        router.push('/signin?error=callback_error');
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Completing sign-in...</p>
      </div>
    </div>
  );
}
