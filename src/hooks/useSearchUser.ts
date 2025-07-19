
import useSWR from "swr";


export const useSearchUser = (searchValue: string) => {
    const resp = useSWR(searchValue ? `https://ghojojqkptplppuiikqm.supabase.co/rest/v1/user?email=like.${searchValue}*&select=*` : null, {
        revalidateOnFocus: false,
    });
    return {
        data: resp.data,
        error: resp.error,
        isLoading: !resp.error && !resp.data
    };
}
