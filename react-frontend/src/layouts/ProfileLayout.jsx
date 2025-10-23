import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Nav, Collapse } from "react-bootstrap";
import { ChevronDown, ChevronRight } from "react-bootstrap-icons";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import AuthService from "../services/authService";
import MainLayout from "./MainLayout";
import LoadingOverlay from "../components/LoadingOverlay";
import { useApiErrorHandler } from "../hooks/useApiErrorHandler";
const ProfileLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { handleError } = useApiErrorHandler();
    const [loading, setLoading] = useState(false);

    const [profile, setProfile] = useState(null);
    const [manageAccountExpanded, setManageAccountExpanded] = useState(true);
    const [myOrdersExpanded, setMyOrdersExpanded] = useState(false);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response = await AuthService.getProfile();
            setProfile(response.data);
        } catch (error) {
            handleError(error, "Failed to fetch profile");
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (path) => {
        navigate(path);
    };

    const isActive = (path) => {
        if (path === "/profile" && location.pathname === "/profile") {
            return true;
        }
        return location.pathname === path;
    };

    // Auto-expand sections based on current path
    useEffect(() => {
        const currentPath = location.pathname;
        if (currentPath.includes("/profile") && (currentPath === "/profile" || currentPath.includes("/password") || currentPath.includes("/address"))) {
            setManageAccountExpanded(true);
        } else if (currentPath.includes("/orders")) {
            setMyOrdersExpanded(true);
        }
    }, [location.pathname]);

    useEffect(() => {
        fetchProfile();
    }, []);

    return (
        <>
            <MainLayout>
                <Container className="py-4">
                    {/* Content dengan conditional blur */}
                    <div style={{ filter: loading ? "blur(3px)" : "none", opacity: loading ? 0.5 : 1, transition: "all 0.3s ease" }}>
                        <Row>
                            <Col xs={6} className="mb-4">
                                <Link to="/" className="text-decoration-none">
                                    <span className="text-muted">Home</span>
                                </Link>
                                <span className="mx-1">/</span>
                                <span className="text-dark">Profile</span>
                            </Col>
                            <Col xs={6} className="mb-4 text-end">
                                <span className="text-muted">Welcome! </span>
                                <span className="text-danger">{profile?.name || "User"}</span>
                            </Col>
                        </Row>

                        <Row>
                            {/* Sidebar */}
                            <Col lg={3} className="mb-4">
                                <Card>
                                    <Card.Body className="p-0">
                                        {/* Manage My Account Section */}
                                        <div
                                            className="p-3 border-bottom d-flex justify-content-between align-items-center"
                                            style={{ cursor: "pointer", backgroundColor: manageAccountExpanded ? "#f8f9fa" : "transparent" }}
                                            onClick={() => setManageAccountExpanded(!manageAccountExpanded)}
                                        >
                                            <h6 className="mb-0 fw-bold">Manage My Account</h6>
                                            {manageAccountExpanded ? <ChevronDown size={16} className="text-muted" /> : <ChevronRight size={16} className="text-muted" />}
                                        </div>
                                        <Collapse in={manageAccountExpanded}>
                                            <div>
                                                <Nav className="flex-column">
                                                    <Nav.Link
                                                        className={`px-4 py-3 border-0 text-start ${isActive("/profile") ? "text-danger bg-light" : "text-dark"}`}
                                                        onClick={() => handleTabChange("/profile")}
                                                        style={{ cursor: "pointer" }}
                                                    >
                                                        My Profile
                                                    </Nav.Link>
                                                    <Nav.Link
                                                        className={`px-4 py-3 border-0 text-start ${isActive("/profile/password") ? "text-danger bg-light" : "text-muted"}`}
                                                        onClick={() => handleTabChange("/profile/password")}
                                                        style={{ cursor: "pointer" }}
                                                    >
                                                        Change Password
                                                    </Nav.Link>
                                                    <Nav.Link
                                                        className={`px-4 py-3 border-0 text-start ${isActive("/profile/address") ? "text-danger bg-light" : "text-muted"}`}
                                                        onClick={() => handleTabChange("/profile/address")}
                                                        style={{ cursor: "pointer" }}
                                                    >
                                                        Address Book
                                                    </Nav.Link>
                                                </Nav>
                                            </div>
                                        </Collapse>

                                        {/* My Orders Section */}
                                        <div
                                            className="p-3 border-bottom d-flex justify-content-between align-items-center"
                                            style={{ cursor: "pointer", backgroundColor: myOrdersExpanded ? "#f8f9fa" : "transparent" }}
                                            onClick={() => setMyOrdersExpanded(!myOrdersExpanded)}
                                        >
                                            <h6 className="mb-0 fw-bold">My Orders</h6>
                                            {myOrdersExpanded ? <ChevronDown size={16} className="text-muted" /> : <ChevronRight size={16} className="text-muted" />}
                                        </div>
                                        <Collapse in={myOrdersExpanded}>
                                            <div>
                                                <Nav className="flex-column">
                                                    <Nav.Link
                                                        className={`px-4 py-3 border-0 text-start ${isActive("/profile/orders/process") ? "text-danger bg-light" : "text-muted"}`}
                                                        style={{ cursor: "pointer" }}
                                                        onClick={() => handleTabChange("/profile/orders/process")}
                                                    >
                                                        On Process
                                                    </Nav.Link>
                                                    <Nav.Link
                                                        className={`px-4 py-3 border-0 text-start ${isActive("/profile/orders/deliveries") ? "text-danger bg-light" : "text-muted"}`}
                                                        style={{ cursor: "pointer" }}
                                                        onClick={() => handleTabChange("/profile/orders/deliveries")}
                                                    >
                                                        In Deliveries
                                                    </Nav.Link>
                                                    <Nav.Link
                                                        className={`px-4 py-3 border-0 text-start ${isActive("/profile/orders/delivered") ? "text-danger bg-light" : "text-muted"}`}
                                                        style={{ cursor: "pointer" }}
                                                        onClick={() => handleTabChange("/profile/orders/delivered")}
                                                    >
                                                        Delivered
                                                    </Nav.Link>
                                                </Nav>
                                            </div>
                                        </Collapse>
                                    </Card.Body>
                                </Card>
                            </Col>

                            {/* Main Content */}
                            <Col lg={9}>
                                <Card>
                                    <Card.Body>
                                        {/* Render komponen berdasarkan route */}
                                        <Outlet context={{ profile, fetchProfile }} />
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                </Container>
            </MainLayout>

            {/* Loading Overlay */}
            <LoadingOverlay show={loading} message="Loading Profile" subMessage="Please wait while we fetch your data..." />
        </>
    );
};

export default ProfileLayout;
