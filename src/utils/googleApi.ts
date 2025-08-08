export const getStoredGoogleTokens = () => {
  if (typeof window === 'undefined') return null;
  
  return {
    access_token: localStorage.getItem('google_access_token'),
    refresh_token: localStorage.getItem('google_refresh_token')
  };
};

export const makeGoogleApiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const tokens = getStoredGoogleTokens();
  
  if (!tokens.access_token) {
    throw new Error('No Google access token available');
  }

  const response = await fetch(endpoint, {
    ...options,
    headers: {
      'Authorization': `Bearer ${tokens.access_token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`Google API request failed: ${response.statusText}`);
  }

  return response.json();
};

// Example: Get user's Google profile
export const getGoogleUserProfile = async () => {
  return makeGoogleApiRequest('https://www.googleapis.com/oauth2/v2/userinfo');
};
