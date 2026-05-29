import { api } from "./client";

export const createUrl = async (data) => {
    const res = await api.post("/url/short", data);
    return res.data.url;
}