import axios from "axios";
import { api } from "./client";

export const signup = async (data) => {
    const res = await api.post("/auth/signup", data);
    return res.data;
}
export const login = async (data) => {
    const res = await api.post("/auth/login", data);
    return res.data;
}
export const logout = async () => {
    return (await api.post("/auth/logout")).data;
}
export const getMe = async () => {
    const res = await api.get("/auth/me");
    return res.data.user;
}
export const getUserInfo = async () => {
    const res = await api.get("/auth/getMe");
    return res.data.user;
}
export const updateInfo = async (data) => {
    const res = await api.put("/auth/update", data);
    return res.data.user;
}
export const forgetPassword = async (email) => {
    const res = await api.post("/auth/reset-password", email);
    return res.data;
}
export const updatePassword = async (data) => {
    try {
        const response = await api.post("/auth/match-password", data);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
              throw Error(error.response.data.message)
            }
        }
    }
}