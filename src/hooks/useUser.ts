import useSWR from "swr";
import { UserTable } from "./useSearchUser";

export const useUser = (userId: number | null) => {
    const res = useSWR<UserTable | null>(userId ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/user?id=eq.${userId}` : null, {
        revalidateOnFocus: false,
        shouldRetryOnError: false,
    });
    return {
        user: res.data,
        isLoading: !res.error && !res.data,
        error: res.error,
    };
}