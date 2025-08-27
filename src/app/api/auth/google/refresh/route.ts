import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const { refreshToken } = await req.json();

    if (!refreshToken) {
        return NextResponse.json({ error: 'Refresh token is required' }, { status: 400 });
    }

    try {
        const response = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_id: process.env.GOOGLE_CLIENT_ID!,
                client_secret: process.env.GOOGLE_CLIENT_SECRET!,
                refresh_token: refreshToken,
                grant_type: 'refresh_token',
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Google refresh token error:', errorData);
            return NextResponse.json({ error: 'Failed to refresh token' }, { status: 400 });
        }

        const { access_token } = await response.json();
        
        return NextResponse.json({ accessToken: access_token });
    } catch (error) {
        console.error('Error refreshing Google token:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
