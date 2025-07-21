import { Database } from './../../database.types';
import useSWR, { SWRResponse } from "swr";

// Define the type for the user table in the Database
export type UserTable = Database["public"]["Tables"]["user"]["Row"];

// Define the type for the SWR response data
interface UseSearchUserResponse {
    data: UserTable[] | undefined;
    error: Error | null;
    isLoading: boolean;
}

export const useSearchUser = (searchValue: string): UseSearchUserResponse => {
    // Fetch user data based on the search value
    const swrResponse: SWRResponse<UserTable[], Error> = useSWR(
        searchValue
            ? `https://ghojojqkptplppuiikqm.supabase.co/rest/v1/user?email=like.${searchValue}*&select=*`
            : null,
        {
            revalidateOnFocus: false,
        }
    );

    return {
        data: swrResponse.data,
        error: swrResponse.error ?? null, // Convert undefined to null
        isLoading: !swrResponse.error && !swrResponse.data,
    };
};
