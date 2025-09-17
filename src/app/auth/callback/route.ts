import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') ?? '/admin';

  if (code) {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    try {
      await supabase.auth.exchangeCodeForSession(code);
      return NextResponse.redirect(new URL(next, request.url));
    } catch (error) {
      console.error('Error exchanging code for session:', error);
      return NextResponse.redirect(new URL('/auth/auth-code-error', request.url));
    }
  }

  // If no code, redirect to a client-side handler that can process URL fragments
  return NextResponse.redirect(new URL('/auth/callback-handler', request.url));
}
