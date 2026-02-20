import { mutate } from 'swr';
import { fetcher } from './fetcher';
import { toApiUrl, methodToBackendMethod } from '@/lib/api';

// Define the type for the user table in the Database
type UpdateType = {
    path: string | null;
    method: 'PATCH' | 'PUT' | 'POST' | 'DELETE' | 'GET';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    payload?: any;
    mutateKey?: string;
    additionalHeaders?: Record<string, string>;
}

type UseMutateUpdateResponse = {
    response: unknown | null;
    error: unknown | null;
};

export async function mutateUpdate({ path, method, mutateKey, payload, additionalHeaders }: UpdateType): Promise<UseMutateUpdateResponse> {
    if (!path) {
        return { response: null, error: 'Path is required' };
    }

    let fullPath = toApiUrl(path);
    const normalizedMethod = methodToBackendMethod(method);

    if (normalizedMethod === 'PUT') {
        const pathUrl = new URL(fullPath);

        if (pathUrl.pathname.endsWith('/users')) {
            const userId = pathUrl.searchParams.get('id');
            if (userId?.startsWith('eq.')) {
                fullPath = `${pathUrl.origin}${pathUrl.pathname}/${userId.replace('eq.', '')}`;
            }
        }

        if (pathUrl.pathname.endsWith('/business-listings')) {
            const businessId = pathUrl.searchParams.get('id');
            const websiteId = pathUrl.searchParams.get('website_id');

            if (businessId?.startsWith('eq.')) {
                fullPath = `${pathUrl.origin}${pathUrl.pathname}/${businessId.replace('eq.', '')}`;
            } else if (websiteId) {
                const websiteResponse = await fetcher<Array<{ id: number }>>(
                    `${pathUrl.origin}${pathUrl.pathname}?website_id=${websiteId.replace('eq.', '')}`,
                    'GET'
                );

                if (!websiteResponse || websiteResponse.length === 0) {
                    return { response: null, error: 'Business listing not found for website' };
                }

                fullPath = `${pathUrl.origin}${pathUrl.pathname}/${websiteResponse[0].id}`;
            }
        }
    }

    console.log('mutateUpdate - Full URL:', fullPath);
    console.log('mutateUpdate - Method:', normalizedMethod);
    console.log('mutateUpdate - Payload:', payload);
    
    try {
        const res = await fetcher(fullPath, normalizedMethod, undefined, payload, additionalHeaders);
        if (mutateKey) {
            void mutate(toApiUrl(mutateKey));
        }
        console.log('mutateUpdate - Success response:', res);
        return { response: res, error: null };
    } catch (error) {
        console.error('Error in mutateUpdate:', error);
        console.error('Error details:', {
            path,
            method,
            payload,
            fullPath,
            additionalHeaders
        });

        // Return a structured error response
        return { response: null, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}
