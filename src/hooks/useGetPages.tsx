import useSWR from "swr";
import { Database } from "../../database.types";

export type Pages = Database["public"]["Tables"]["page"]["Row"][];

export const useGetPages = (websiteId: number | null) : {
    pages: Pages | [];
    isLoading: boolean;
    error: Error | undefined;
} => {
    // Fetch pages from the API
    const { data, error, isLoading } = useSWR(
        websiteId ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/page?website_id=eq.${websiteId}&select=*` : null,
        {
        revalidateOnFocus: false,
        }
    );
    
    return {
        pages: data || [],
        isLoading,
        error,
    };
}