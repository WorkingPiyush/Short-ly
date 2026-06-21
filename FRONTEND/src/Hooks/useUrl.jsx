/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-refresh/only-export-components */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteUrl, getShortUrl, getUrl, getUrlAnalytics, updateUrl } from "../Api/Url";
import { useUrlFilter } from "../Context/StatusFilterContext";


export const useUrl = () => {
    const { filter } = useUrlFilter();

    return useQuery({
        queryKey: ['url', filter],
        queryFn: () => getUrl(filter),
    })
}

export const useshortUrl = (shortCode) => {
    return useQuery({
        queryKey: ['short', shortCode],
        queryFn: () => getShortUrl(shortCode),
        enabled: Boolean(shortCode),
    })
}

export const useUpdateUrl = () => {
    const queryClient = useQueryClient();
    const { filter } = useUrlFilter();

    return useMutation({
        mutationFn: updateUrl,
        onSuccess: () => {
            queryClient.refetchQueries({
                queryKey: ['url', filter],
                refetchType: "active",
            })
            queryClient.refetchQueries({
                queryKey: ['short'],
                refetchType: "active",
            })
        },
    });
};

export const UseDeleteUrl = () => {
    const queryClient = useQueryClient();
    const { filter } = useUrlFilter();

    return useMutation({
        mutationFn: deleteUrl,
        onSuccess: () => {
            queryClient.refetchQueries({
                queryKey: ['url', filter],
                refetchType: "active",
            })
        }
    })
};

export const useShortAnalytics = (shortCode, period) => {
    return useQuery({
        queryKey: ['analytics', shortCode, period],
        queryFn: () => getUrlAnalytics(shortCode, period),
        enabled: Boolean(shortCode),
    })
}