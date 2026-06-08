import { api } from "./client";


export const createUrl = async (data) => {
    const res = await api.post("/url/short", data);
    return res.data.url;
};

export const getUrl = async (filter) => {
    const res = await api.get("/url/myUrl", {
        params: { status: filter },
    });
    return res.data.url;
};

export const getShortUrl = async (shortCode) => {
    const res = await api.get("/url/", {
        params: { shortCode },
    });
    return res.data.url;
};

export const updateUrl = async ({ shortCode, ...data }) => {
    const res = await api.patch("/url/", data, {
        params: { shortCode },
    });
    return res.data.success;
};

export const deleteUrl = async ( shortCode ) => {
    const res = await api.delete("/url/", {params: { shortCode }});
    return res.data.success;
}