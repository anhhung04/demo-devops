import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { apiCall } from "./util";

const SignUp = () => {
    const [authPage, setAuthPage] = useState(null);

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
    const onSubmit = async (event) => {
        event.preventDefault();
        console.log(event.target.elements);
        const display_name =
            event.target.elements["formBasicDisplayName"].value;
        const email = event.target.elements["formBasicEmail"].value;
        const password = event.target.elements["formBasicPassword"].value;
        const responseData = await apiCall("/api/auth/signup", "POST", {
            display_name,
            email,
            password,
        });
        const isSuccess = responseData && responseData["code"] === 201;
        if (isSuccess) {
            window.location.href = "/signin";
        } else {
            alert(responseData["detail"]);
        }
    };

    return (
        <>
            <div className="form-container">
                <Form onSubmit={onSubmit}>
                    <h2>Sign Up</h2>
                    <Form.Group controlId="formBasicDisplayName">
                        <Form.Label>Display Name</Form.Label>
                        <Form.Control
                            type="display_name"
                            placeholder="Enter display name"
                            required
                        />
                    </Form.Group>
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
                        Sign Up
                    </Button>
                    <Button variant="primary" onClick={handleGoogleAuth}>
                        Sign Up With Google
                    </Button>
                </Form>
            </div>
        </>
    );
};

export default SignUp;
