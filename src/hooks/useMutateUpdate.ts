import { mutate } from 'swr';
import { fetcher } from './fetcher';

// Define the type for the user table in the Database
type UpdateType = {
    path: string | null;
    method: 'PATCH' | 'PUT' | 'POST' | 'DELETE';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    payload?: any;
    mutateKey?: string;
}

type UseMutateUpdateResponse = {
    response: unknown | null;
    error: unknown | null;
};

export async function mutateUpdate({ path, method, payload, mutateKey }: UpdateType): Promise<UseMutateUpdateResponse> {
    const fullPath = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1${path}`;
    try {
        const res = await fetcher(fullPath, method, process.env.NEXT_PUBLIC_SUPABASE_KEY as string, payload);
        if (mutateKey) {
            void mutate(mutateKey);
        }
        return { response: res, error: null };
    } catch (error) {
        console.error('Error in mutateUpdate:', error);

        // Return a structured error response
        return { response: null, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}
