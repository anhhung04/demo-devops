import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import './Home.css';
import callAPI from "@utils/api";

export default function HomePage(){
    const [userInfo, setUserInfo] = useState({});
    useEffect(() => {
        if (!userInfo.id) {
            callAPI("/api/user/me").then((res) => {
                if (!res.data) {
                    window.location.href = "/";
                }
                setUserInfo(res.data);
            });
        }
    }, [userInfo, setUserInfo]);
    return (
    <div>
        <h1>THIS IS THE HOMEPAGE</h1>
        {userInfo.id ? <h2>Welcome {userInfo.username}</h2>: null}
        {userInfo.id ? <h3>Your email is {userInfo.email}</h3> : null}
        <div className="button-div"> 
            <Link to="/login">
                <button type="button"> Login </button>
            </Link>
            <Link to="/register">
                <button type="button"> Register </button>
            </Link>

            {userInfo.id ? <button type="button" onClick={handleLogout}> Logout </button> : null}
        </div>
    </div>
    )
}