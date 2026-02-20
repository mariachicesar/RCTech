import useSWR, { SWRResponse } from "swr";
import { getApiBaseUrl } from "@/lib/api";


export const useGetBusinessByWebsiteId = (websiteId: number | null) => {
    const res: SWRResponse = useSWR(
        websiteId ? `${getApiBaseUrl()}/business-listings?website_id=${websiteId}` : null,
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