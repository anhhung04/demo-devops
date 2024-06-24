import React from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";

const SignIn = ({ handleLogin }) => {
    const navigate = useNavigate();

    const onSubmit = (event) => {
        event.preventDefault();
        handleLogin();
        navigate("/dashboard");
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
