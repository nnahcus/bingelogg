import { useQuery } from "@tanstack/react-query";
import { SearchMedia } from "./searchmedia";

export function useSearchMedia(query: string) {
    return useQuery({
        queryKey: ['searchMedia', query],
        queryFn: () => SearchMedia(query),
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
    });
}