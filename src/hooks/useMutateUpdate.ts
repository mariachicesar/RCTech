import { mutate } from 'swr';
import { fetcher } from './fetcher';

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
    const fullPath = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1${path}`;
    console.log('mutateUpdate - Full URL:', fullPath);
    console.log('mutateUpdate - Method:', method);
    console.log('mutateUpdate - Payload:', payload);
    
    try {
        const res = await fetcher(fullPath, method, process.env.NEXT_PUBLIC_SUPABASE_KEY as string, payload, additionalHeaders);
        if (mutateKey) {
            void mutate(mutateKey);
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
