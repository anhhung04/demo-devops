import React, { useEffect } from "react";
import { apiCall } from "./util";
import queryString from "query-string";
const OAuthHandler = () => {
    const { location } = window;
    const { code, state, error } = queryString.parse(location.search);
    useEffect(() => {
        if (code) {
            const fetchToken = async () => {
                const response = await apiCall("/api/auth/oauth/cb", "POST", {
                    code,
                    state,
                    error,
                });
                if (response.code === 200) {
                    window.opener.postMessage(
                        "success",
                        window.location.origin
                    );
                } else {
                    window.opener.postMessage(
                        "failure",
                        window.location.origin
                    );
                }
            };
            fetchToken();
        }
    }, [code, state, error]);
    return <div>Redirecting...</div>;
};

export default OAuthHandler;
