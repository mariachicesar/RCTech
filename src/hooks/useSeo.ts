import useSWR from "swr";
import { Database } from "../../database.types";

type SeoData = Database["public"]["Tables"]["seo_metadata"]["Row"];

export const useGetSeo = (id: number | null): {
    seoData: SeoData | null;
    isLoading: boolean;
    error: Error | undefined;
} => {
    // Fetch SEO data based on the page ID
    const { data, error, isLoading } = useSWR(
        id ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/seo_metadata?page_id=eq.${id}&select=*` : null,
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