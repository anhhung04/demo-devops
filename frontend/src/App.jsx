import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, Button } from "react-bootstrap";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import Dashboard from "./Dashboard";

const Header = ({ isAuthenticated, handleLogout }) => {
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
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const handleLogin = () => {
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
    };

    return (
        <Router>
            <Header
                isAuthenticated={isAuthenticated}
                handleLogout={handleLogout}
            />
            <div className="container mt-3">
                <Routes>
                    <Route
                        path="/signin"
                        element={<SignIn handleLogin={handleLogin} />}
                    ></Route>
                    <Route path="/signup" element={<SignUp />}></Route>
                    <Route path="/dashboard" element={<Dashboard />}></Route>
                </Routes>
            </div>
        </Router>
    );
};

export default App;
