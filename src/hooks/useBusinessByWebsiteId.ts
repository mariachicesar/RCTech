import useSWR, { SWRResponse } from "swr";
import { Database } from "../../database.types";

/**
 * Represents a single row in the `business_listing` table.
 */
export type BusinessListingRow = Database["public"]["Tables"]["business_listing"]["Row"];

export const useBusinessByWebsiteId = (websiteId: number | null): {
    business: BusinessListingRow | null;
    isLoading: boolean;
    error: Error | undefined;
} => {
    const res: SWRResponse = useSWR(
        websiteId ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/business_listing?website_id=eq.${websiteId}` : null,
        {
            revalidateOnFocus: false,
        }
    );

    return {
        business: res?.data ? res.data[0] : null,
        isLoading: websiteId ? !res.error && !res.data : false,
        error: res.error,
    };
}