export const fetcher = async <T>(
  url: string,
  method: string,
  token: string,
  payload?: T,
  additionalHeaders?: Record<string, string>,
) => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_KEY) {
    console.error(
      "Supabase Key is missing. Please set NEXT_PUBLIC_SUPABASE_KEY in your environment variables.",
    );
    throw new Error("Supabase Key is missing");
  }

  console.log('Fetcher - Making request to:', url);
  console.log('Fetcher - Method:', method);
  console.log('Fetcher - Payload:', payload);

  const res = await fetch(url, {
    method: method,
    headers: {
      apikey: process.env.NEXT_PUBLIC_SUPABASE_KEY,
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_KEY}`,
      "Content-Type": "application/json",
      ...additionalHeaders, // Spread any additional headers passed in
    },
    body: payload ? JSON.stringify(payload) : null,
  });

  console.log('Fetcher - Response status:', res.status);
  console.log('Fetcher - Response ok:', res.ok);

  if (!res.ok) {
    const errorText = await res.text();
    console.error('Fetch error:', {
      status: res.status,
      statusText: res.statusText,
      url: url,
      method: method,
      errorText: errorText
    });
    throw new Error(`HTTP ${res.status}: ${res.statusText} - ${errorText}`);
  }

  // Check if the response body is empty
  const text = await res.text();
  console.log('Fetcher - Response text:', text);
  return text ? JSON.parse(text) : null;
};
