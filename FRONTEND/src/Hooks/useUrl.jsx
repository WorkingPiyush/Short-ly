import { useQuery } from "@tanstack/react-query";
import { getUrl } from "../Api/Url";

export const useUser = () => {
    return useQuery({
        queryKey: ['url'],
        queryFn: getUrl,
    })
}