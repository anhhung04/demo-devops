import cfg from "./config";

export async function apiCall(
    path = "/api",
    method = "GET",
    body = null,
) {
    try {
        const headers = {};
        if (body) {
            headers["Content-Type"] = "application/json";
        }
        const res = await fetch(cfg.BE_URL + path, {
            method,
            headers,
            credentials: "include",
            body: body ? JSON.stringify(body) : null,
        });
        return await res.json();
    } catch (err) {
        return null;
    }
}