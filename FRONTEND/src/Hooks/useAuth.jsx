import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMe, getUserInfo, login, logout, signup, updateInfo } from "../Api/Auth";
import { useLocation } from "react-router-dom";

export const useUser = () => {
    const location = useLocation();

    return useQuery({
        queryKey: ['user'],
        queryFn: getMe,
        enabled: !["/login", "/signup"].includes(location.pathname),
        retry: false,
    })
}
export const useUserInfo = () => {
    return useQuery({
        queryKey: ['userInfo'],
        queryFn: getUserInfo,
        // enabled: !["/login", "/signup"].includes(location.pathname)
    })
}

export const useSignup = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: signup,
        onSuccess: (data) => {
            queryClient.setQueryData(
                ['user'],
                data.user
            )
        }
    })
}

export const useLogin = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: login,
        onSuccess: async (data) => {
            queryClient.setQueryData(
                ['user'],
                data.user
            )
        },
    });
};

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateInfo,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['user']
            });
            queryClient.invalidateQueries({
                queryKey: ['userInfo']
            });
        },
    });
};

export const useLogout = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: logout,
        onSuccess: () => {
            queryClient.removeQueries({
                queryKey: ['user'],
            });
        },
    });
};