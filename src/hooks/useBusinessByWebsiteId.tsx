import useSWR, { SWRResponse } from "swr";
import { Database } from "../../database.types";

/**
 * Represents a single row in the `business_listing` table.
 */
export type BusinessListingRow = Database["public"]["Tables"]["business_listing"]["Row"];

export const useBusinessByWebsiteId = (websiteId: number | null): {
    business: BusinessListingRow;
    isLoading: boolean;
    error: Error;
} => {
    const res: SWRResponse = useSWR(
        websiteId ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/business_listing?website_id=eq.${websiteId}` : null,
        {
            revalidateOnFocus: false,
        }
    );

    return {
        business: res.data[0],
        isLoading: !res.error && !res.data,
        error: res.error,
    };
}