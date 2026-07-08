import { api } from "./client";


export const createUrl = async (data) => {
    const res = await api.post("/url/short", data);
    return res.data.url;
};

export const getUrl = async (filter) => {
    const res = await api.get("/url/", {
        params: { status: filter },
    });
    return res.data.url;
};

export const getShortUrl = async (shortCode) => {
    const res = await api.get(`/url/${shortCode}`);
    return res.data.url;
};

export const updateUrl = async ({ shortCode, ...data }) => {
    const res = await api.patch(`/url/${shortCode}`, data);
    return res.data.success;
};

export const deleteUrl = async (shortCode) => {
    const res = await api.delete(`/url/${shortCode}`);
    return res.data.success;
};

export const searchUrl = async (query) => {
    const response = await api.get(`/url/search/${query}`);
    return response.data.response;
};

export const getProtectedUrl = async (ShortCode, data) => {
    const res = await api.post(`/url/${ShortCode}/verify-password`, data);
    return res.data;
};

export const getUrlAnalytics = async (ShortCode, period) => {
    const res = await api.get(`/url/${ShortCode}/analytics`, {
        params: { period }
    });
    return res.data.url;
};
export const AllAnalytics = async (period) => {
    const res = await api.get(`/url/analytics`, { params: period });
    return res.data;
};

export const createBulkUrl = async (data) => {
    const res = await api.post("/url/bulk", data);
    return res.data.url;
};

export const addTags = async (tags, shortCode) => {
    // if (tags.length >= 0) return;
    const res = await api.patch(`/url/${shortCode}`, { tags });
    return res.data
}