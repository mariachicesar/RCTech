export const fetcher = async <T>(url: string, method: string, token: string, payload?: T) => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_KEY) {
        console.error('Supabase Key is missing. Please set NEXT_PUBLIC_SUPABASE_KEY in your environment variables.');
        throw new Error('Supabase Key is missing');
    }

    const res = await fetch(url, {
        method: method,
        headers: {
            'apikey': process.env.NEXT_PUBLIC_SUPABASE_KEY,
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_KEY}`,
        },
        body: payload ? JSON.stringify(payload) : null,
    });

    if (!res.ok) {
        throw new Error('Network response was not ok');
    }

    // Check if the response body is empty
    const text = await res.text();
    return text ? JSON.parse(text) : null;
};