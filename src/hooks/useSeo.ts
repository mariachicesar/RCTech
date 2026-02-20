import useSWR from "swr";
import { Database } from "../../database.types";
import { getApiBaseUrl } from "@/lib/api";

type SeoData = Database["public"]["Tables"]["seo_metadata"]["Row"];

export const useGetSeo = (id: number | null): {
    seoData: SeoData | null;
    isLoading: boolean;
    error: Error | undefined;
} => {
    // Fetch SEO data based on the page ID
    const { data, error, isLoading } = useSWR(
        id ? `${getApiBaseUrl()}/seo-metadata?page_id=${id}` : null,
        {
            revalidateOnFocus: false,
        }
    );

    return {
        seoData: data ? data[0] : null,
        isLoading,
        error,
    };
}