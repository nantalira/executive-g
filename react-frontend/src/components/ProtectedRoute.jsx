import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthStatus } from "../hooks/useAuthStatus";
import { Container, Spinner } from "react-bootstrap";

const ProtectedRoute = ({ children }) => {
    const { isLoggedIn, loading } = useAuthStatus();

    if (loading) {
        return (
            <Container className="mt-4">
                <div className="text-center">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                    <p className="mt-2">Checking authentication...</p>
                </div>
            </Container>
        );
    }

    return isLoggedIn ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
