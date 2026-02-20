import useSWR from "swr";
import { UserTable } from "./useSearchUser";
import { getApiBaseUrl } from "@/lib/api";

export const useUser = (userId: number | null) => {
    const res = useSWR<UserTable | null>(userId ? `${getApiBaseUrl()}/users/${userId}` : null, {
        revalidateOnFocus: false,
        shouldRetryOnError: false,
    });
    return {
        user: res.data,
        isLoading: !res.error && !res.data,
        error: res.error,
    };
}