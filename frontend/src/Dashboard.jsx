import React, { useEffect, useState } from "react";
import { apiCall } from "./util";
const Dashboard = () => {
    const [userInfo, setUserInfo] = useState({});
    useEffect(() => {
        if (!userInfo.id) {
            apiCall("/api/user/me").then((res) => {
                if (!res.data) {
                    window.location.href = "/";
                }
                setUserInfo(res.data);
            });
        }
    }, [userInfo, setUserInfo]);
    return (
        <>
            <div className="dashboard">
                <h2>Dashboard</h2>
                <p>Welcome to your dashboard!</p>
                <p>
                    <strong>Display Name:</strong> {userInfo.display_name}
                </p>
                <p>
                    <strong>Email:</strong> {userInfo.email}
                </p>
            </div>
        </>
    );
};

export default Dashboard;
