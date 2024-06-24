import React from "react";
import { Form, Button } from "react-bootstrap";

const SignUp = () => {
    const onSubmit = (event) => {
        event.preventDefault();
        // handle sign-up logic here
    };

    return (
        <>
            <div className="form-container">
                <Form onSubmit={onSubmit}>
                    <h2>Sign Up</h2>
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
                </Form>
            </div>
        </>
    );
};

export default SignUp;
