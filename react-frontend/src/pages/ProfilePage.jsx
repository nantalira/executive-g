import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Alert, Form, Nav, Collapse } from "react-bootstrap";
import { ChevronDown, ChevronRight } from "react-bootstrap-icons";
import AuthService from "../services/auth";
import MainLayout from "../layouts/MainLayout";
import LoadingOverlay from "../components/LoadingOverlay";
import { Link } from "react-router-dom";

const ProfilePage = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState("profile");
    const [manageAccountExpanded, setManageAccountExpanded] = useState(true);
    const [myOrdersExpanded, setMyOrdersExpanded] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        newPassword: "",
        confirmPassword: "",
    });

    const fetchProfile = async () => {
        try {
            setLoading(true);
            setError("");
            const response = await AuthService.getProfile();
            setProfile(response.data);
            setFormData({
                name: response.data.name || "",
                phone: response.data.phone || "",
                email: response.data.email || "",
                newPassword: "",
                confirmPassword: "",
            });
        } catch (error) {
            setError(error.message || "Failed to fetch profile");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSaveChanges = () => {
        // TODO: Implement save changes logic
        alert("Save functionality will be implemented here");
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);

        // Auto-expand sections based on selected tab
        if (["profile", "address", "payment"].includes(tab)) {
            setManageAccountExpanded(true);
        } else if (["returns", "cancellations"].includes(tab)) {
            setMyOrdersExpanded(true);
        }
    };

    const handleCancel = () => {
        if (profile) {
            setFormData({
                name: profile.name || "",
                phone: profile.phone || "",
                email: profile.email || "",
                newPassword: "",
                confirmPassword: "",
            });
        }
    };

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
                                                        className={`px-4 py-3 border-0 text-start ${activeTab === "profile" ? "text-danger bg-light" : "text-dark"}`}
                                                        onClick={() => handleTabChange("profile")}
                                                        style={{ cursor: "pointer" }}
                                                    >
                                                        My Profile
                                                    </Nav.Link>
                                                    <Nav.Link
                                                        className={`px-4 py-3 border-0 text-start ${activeTab === "address" ? "text-danger bg-light" : "text-muted"}`}
                                                        onClick={() => handleTabChange("address")}
                                                        style={{ cursor: "pointer" }}
                                                    >
                                                        Address Book
                                                    </Nav.Link>
                                                    <Nav.Link
                                                        className={`px-4 py-3 border-0 text-start ${activeTab === "payment" ? "text-danger bg-light" : "text-muted"}`}
                                                        onClick={() => handleTabChange("payment")}
                                                        style={{ cursor: "pointer" }}
                                                    >
                                                        My Payment Options
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
                                                        className={`px-4 py-3 border-0 text-start ${activeTab === "returns" ? "text-danger bg-light" : "text-muted"}`}
                                                        style={{ cursor: "pointer" }}
                                                        onClick={() => handleTabChange("returns")}
                                                    >
                                                        My Returns
                                                    </Nav.Link>
                                                    <Nav.Link
                                                        className={`px-4 py-3 border-0 text-start ${activeTab === "cancellations" ? "text-danger bg-light" : "text-muted"}`}
                                                        style={{ cursor: "pointer" }}
                                                        onClick={() => handleTabChange("cancellations")}
                                                    >
                                                        My Cancellations
                                                    </Nav.Link>
                                                </Nav>
                                            </div>
                                        </Collapse>

                                        {/* My WishList - Standalone */}
                                        <div className="p-3 border-top">
                                            <Nav.Link className={`px-1 py-2 border-0 text-start ${activeTab === "wishlist" ? "text-danger bg-light" : "text-muted"}`} style={{ cursor: "pointer" }} onClick={() => handleTabChange("wishlist")}>
                                                My WishList
                                            </Nav.Link>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>

                            {/* Main Content */}
                            <Col lg={9}>
                                <Card>
                                    <Card.Body>
                                        {error && (
                                            <Alert variant="danger" className="mb-3">
                                                {error}
                                            </Alert>
                                        )}

                                        {activeTab === "profile" && (
                                            <>
                                                <Form>
                                                    <Row>
                                                        <Col md={6}>
                                                            <Form.Group className="mb-3">
                                                                <Form.Label>Name</Form.Label>
                                                                <Form.Control type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Name" style={{ backgroundColor: "#f5f5f5" }} />
                                                            </Form.Group>
                                                        </Col>
                                                        <Col md={6}>
                                                            <Form.Group className="mb-3">
                                                                <Form.Label>Phone Number</Form.Label>
                                                                <Form.Control type="text" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Phone Number" style={{ backgroundColor: "#f5f5f5" }} />
                                                            </Form.Group>
                                                        </Col>
                                                    </Row>

                                                    <Row>
                                                        <Col md={12}>
                                                            <Form.Group className="mb-4">
                                                                <Form.Label>E-mail</Form.Label>
                                                                <Form.Control type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="E-mail" style={{ backgroundColor: "#f5f5f5" }} />
                                                            </Form.Group>
                                                        </Col>
                                                    </Row>

                                                    <h6 className="mb-3">Password Changes</h6>
                                                    <Row>
                                                        <Col md={12}>
                                                            <Form.Group className="mb-3">
                                                                <Form.Control type="password" name="currentPassword" placeholder="Current Password" style={{ backgroundColor: "#f5f5f5" }} />
                                                            </Form.Group>
                                                        </Col>
                                                    </Row>

                                                    <Row>
                                                        <Col md={6}>
                                                            <Form.Group className="mb-3">
                                                                <Form.Control type="password" name="newPassword" value={formData.newPassword} onChange={handleInputChange} placeholder="New Password" style={{ backgroundColor: "#f5f5f5" }} />
                                                            </Form.Group>
                                                        </Col>
                                                        <Col md={6}>
                                                            <Form.Group className="mb-3">
                                                                <Form.Control
                                                                    type="password"
                                                                    name="confirmPassword"
                                                                    value={formData.confirmPassword}
                                                                    onChange={handleInputChange}
                                                                    placeholder="Confirm New Password"
                                                                    style={{ backgroundColor: "#f5f5f5" }}
                                                                />
                                                            </Form.Group>
                                                        </Col>
                                                    </Row>

                                                    <div className="d-flex justify-content-end gap-3 mt-4">
                                                        <Button variant="outline-secondary" onClick={handleCancel}>
                                                            Cancel
                                                        </Button>
                                                        <Button variant="danger" onClick={handleSaveChanges} className="px-4">
                                                            Save Changes
                                                        </Button>
                                                    </div>
                                                </Form>
                                            </>
                                        )}

                                        {activeTab === "address" && (
                                            <div className="text-center py-5">
                                                <h5>Address Book</h5>
                                                <p className="text-muted">Address book functionality will be implemented here</p>
                                            </div>
                                        )}

                                        {activeTab === "payment" && (
                                            <div className="text-center py-5">
                                                <h5>Payment Options</h5>
                                                <p className="text-muted">Payment options functionality will be implemented here</p>
                                            </div>
                                        )}

                                        {activeTab === "returns" && (
                                            <div className="text-center py-5">
                                                <h5>My Returns</h5>
                                                <p className="text-muted">Returns history will be displayed here</p>
                                            </div>
                                        )}

                                        {activeTab === "cancellations" && (
                                            <div className="text-center py-5">
                                                <h5>My Cancellations</h5>
                                                <p className="text-muted">Cancelled orders will be displayed here</p>
                                            </div>
                                        )}

                                        {activeTab === "wishlist" && (
                                            <div className="text-center py-5">
                                                <h5>My WishList</h5>
                                                <p className="text-muted">Your wishlist items will be displayed here</p>
                                            </div>
                                        )}
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

export default ProfilePage;
