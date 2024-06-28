import React from "react";
import callAPI from "@utils/api";

export default async function handleLogout(){
    await callAPI("/api/auth/logout").then((res) => {
        if (res.code === 200) {
            window.location = "/";
        } else {
            alert("Failed to logout");
        }
    }).catch((err) => {
        alert("Failed to logout");
    });
    return null;
}