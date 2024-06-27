import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, Button } from "react-bootstrap";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import Dashboard from "./Dashboard";
import OAuthHandler from "./OAuthHandler";
import { apiCall } from "./util";

const Header = ({ handleLogout }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    useEffect(() => {
        if (!isAuthenticated) {
            apiCall("/api/user/me").then((res) =>
                setIsAuthenticated(res && res["code"] === 200)
            );
        }
    }, [isAuthenticated, setIsAuthenticated]);

    return (
        <Navbar bg="light" expand="lg">
            <Navbar.Brand href="/">Demo DevOps</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ml-auto">
                    {!isAuthenticated ? (
                        <>
                            <Nav.Link as={Link} to="/signin">
                                Sign In
                            </Nav.Link>
                            <Nav.Link as={Link} to="/signup">
                                Sign Up
                            </Nav.Link>
                        </>
                    ) : (
                        <>
                            <Nav.Link as={Link} to="/dashboard">
                                Dashboard
                            </Nav.Link>
                            <Button
                                variant="outline-danger"
                                onClick={handleLogout}
                            >
                                Log Out
                            </Button>
                        </>
                    )}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

const App = () => {
    const handleLogout = async () => {
        await apiCall("/api/auth/logout", "POST");
        window.location.href = "/";
    };
    return (
        <Router>
            <Header handleLogout={handleLogout} />
            <div className="container mt-3">
                <Routes>
                    <Route
                        path="/"
                        element={
                            <>
                                <h1>Welcome to Demo DevOps</h1>
                                <p>
                                    This is a simple demo app to showcase DevOps
                                    concepts.
                                </p>
                            </>
                        }
                    ></Route>
                    <Route path="/signin" element={<SignIn />}></Route>
                    <Route path="/signup" element={<SignUp />}></Route>
                    <Route path="/dashboard" element={<Dashboard />}></Route>
                    <Route path="/oauth/cb" element={<OAuthHandler />}></Route>
                </Routes>
            </div>
        </Router>
    );
};

export default App;
