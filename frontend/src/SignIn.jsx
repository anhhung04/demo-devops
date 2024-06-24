import React from "react";
import { Form, Button } from "react-bootstrap";
import { apiCall } from "./util";

const SignIn = () => {
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
            </div>
        </>
    );
};

export default SignIn;
