import React from "react";
import config from "@utils/config";
const callAPI = async (
    path = "/api",
    method = "GET",
    body = null,
) => {
    try {
        const headers = {};
        if (body) {
            headers["Content-Type"] = "application/json";
        }
        const res = await fetch(
            config.BE_URL + path,
            {
                method,
                headers,
                credentials : "include",
                body: body ? JSON.stringify(body) : null,
            }
        );
        return await res.json()
    } catch (err){
        return null;
    }
}
export default callAPI;