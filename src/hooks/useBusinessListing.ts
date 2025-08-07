import useSWR, { SWRResponse } from "swr";


export const useGetBusinessByWebsiteId = (websiteId: number | null) => {
    const res: SWRResponse = useSWR(
        websiteId ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/business_listing?website_id=eq.${websiteId}&select=*` : null,
        {
            revalidateOnFocus: false,
        }
    );
    return {
        business: res?.data || null,
        isLoading: !res.error && !res.data,
        error: res.error,
    };
}