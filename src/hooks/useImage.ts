import useSWR, { SWRResponse } from "swr";
import { Database } from "../../database.types";
import { fetcher } from "./fetcher";

export type Image = Database["public"]["Tables"]["image"]["Row"];
export type Asset = Database["public"]["Tables"]["asset"]["Row"] & {
    image: Image;
};

export const useGetAssets = (
    websiteId: number | null,
    page: number = 0,
    pageSize: number = 10
): {
    assets: Asset[] | null;
    isLoading: boolean;
    error: Error | undefined;
} => {
    const rangeStart = page * pageSize;
    const rangeEnd = rangeStart + pageSize - 1;
    
    const res: SWRResponse = useSWR(
        websiteId ? [`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/asset?website_id=eq.${websiteId}&select=*,image(*)`] : null,
        ([url]) => fetcher(url, "GET", process.env.NEXT_PUBLIC_SUPABASE_KEY as string, undefined,  { Range: `${rangeStart}-${rangeEnd}` } ),
        {
            revalidateOnFocus: false,
        }
    );
    return {
        assets: res?.data || null,
        isLoading: !res.error && !res.data,
        error: res.error,
    };

}
