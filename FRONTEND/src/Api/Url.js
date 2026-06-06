import { api } from "./client";


export const createUrl = async (data) => {
    const res = await api.post("/url/short", data);
    return res.data.url;
}

export const getUrl = async (filter) => {
    const res = await api.get("/url/myUrl", {
        params: { status: filter },
    });
    return res.data.url;
}