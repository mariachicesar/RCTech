import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(400).json({ error: 'Refresh token is required' });
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
            return res.status(400).json({ error: 'Failed to refresh token' });
        }

        const { access_token } = await response.json();
        
        return res.status(200).json({ accessToken: access_token });
    } catch (error) {
        console.error('Error refreshing Google token:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
