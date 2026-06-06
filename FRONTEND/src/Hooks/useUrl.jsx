import { useQuery } from "@tanstack/react-query";
import { getUrl } from "../Api/Url";
import { useUrlFilter } from "../Context/StatusFilterContext";


export const useUrl = () => {
    const { filter } = useUrlFilter();
    
    return useQuery({
        queryKey: ['url', filter],
        queryFn: () => getUrl(filter),
    })
}