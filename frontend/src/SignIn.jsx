import React, { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { apiCall } from "./util";

const SignIn = () => {
    const [authPage, setAuthPage] = useState(null);

    const onSubmit = async (event) => {
        event.preventDefault();
        const responseData = await apiCall("/api/auth/signin", "POST", {
            email: event.target.elements["formBasicEmail"].value,
            password: event.target.elements["formBasicPassword"].value,
        });
        const isSuccess = responseData && responseData["code"] === 200;
        if (isSuccess) {
            window.location.href = "/dashboard";
        } else {
            alert("Sign in failed!");
        }
    };

    const handleGoogleAuth = async () => {
        const responseData = await apiCall("/api/auth/oauth", "POST", {
            issuer: "google",
            redirect_url: "/dashboard",
        });
        const isSuccess = responseData && responseData["code"] === 200;
        if (isSuccess) {
            let authPage = window.open(
                responseData["data"]["authentication_url"]
            );
            setAuthPage(authPage);
        } else {
            alert("Sign in with Google failed!");
        }
    };

    useEffect(() => {
        if (authPage) {
            window.addEventListener("message", (event) => {
                if (event.origin === window.location.origin) {
                    if (event.data === "success") {
                        window.location.href = "/dashboard";
                        authPage.close();
                    }
                }
            });
        }
    }, [authPage]);

    return (
        <>
            <div className="form-container">
                <Form onSubmit={onSubmit}>
                    <h2>Sign In</h2>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter email"
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Password"
                            required
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Sign In
                    </Button>
                </Form>
                <Button variant="primary" onClick={handleGoogleAuth}>
                    Sign In With Google
                </Button>
            </div>
        </>
    );
};

export default SignIn;
