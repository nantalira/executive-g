import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Form, Nav, Collapse } from "react-bootstrap";
import { ChevronDown, ChevronRight } from "react-bootstrap-icons";
import AuthService from "../services/authService";
import MainLayout from "../layouts/MainLayout";
import LoadingOverlay from "../components/LoadingOverlay";
import AddressBook from "../components/AddressBook";
import OrderList from "../components/OrderList";
import { Link } from "react-router-dom";
import { useApiErrorHandler } from "../hooks/useApiErrorHandler";
const ProfilePage = () => {
    const { handleError, clearFieldError, hasFieldError, getFieldError, showSuccess } = useApiErrorHandler();
    const [loading, setLoading] = useState(false);

    const [profile, setProfile] = useState(null);
    const [activeTab, setActiveTab] = useState("profile");
    const [manageAccountExpanded, setManageAccountExpanded] = useState(true);
    const [myOrdersExpanded, setMyOrdersExpanded] = useState(false);
    const [profileFormData, setProfileFormData] = useState({
        name: "",
        phone: "",
        email: "",
    });

    const [passwordFormData, setPasswordFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response = await AuthService.getProfile();
            setProfile(response.data);
            setProfileFormData({
                name: response.data.name || "",
                phone: response.data.phone || "",
                email: response.data.email || "",
            });
        } catch (error) {
            handleError(error, "Failed to fetch profile");
        } finally {
            setLoading(false);
        }
    };

    const handleProfileInputChange = (e) => {
        const { name, value } = e.target;
        setProfileFormData({
            ...profileFormData,
            [name]: value,
        });

        // Clear validation error untuk field yang sedang diubah
        if (hasFieldError(name)) {
            clearFieldError(name);
        }
    };

    const handlePasswordInputChange = (e) => {
        const { name, value } = e.target;
        setPasswordFormData({
            ...passwordFormData,
            [name]: value,
        });

        // Clear validation error untuk field yang sedang diubah
        if (hasFieldError(name)) {
            clearFieldError(name);
        }
    };

    const handleUpdateProfile = async () => {
        try {
            setLoading(true);
            await AuthService.updateProfile(profileFormData);
            showSuccess("Profile updated successfully!");

            // Refresh profile data
            await fetchProfile();
        } catch (error) {
            handleError(error, "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async () => {
        try {
            // Validate password confirmation
            if (passwordFormData.newPassword !== passwordFormData.confirmPassword) {
                handleError(
                    {
                        response: {
                            data: {
                                errors: {
                                    confirmPassword: ["Password confirmation does not match"],
                                },
                            },
                        },
                    },
                    "Password confirmation error"
                );
                return;
            }

            setLoading(true);
            await AuthService.changePassword({
                current_password: passwordFormData.currentPassword,
                new_password: passwordFormData.newPassword,
            });

            showSuccess("Password changed successfully!");

            // Clear password form
            setPasswordFormData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
        } catch (error) {
            handleError(error, "Failed to change password");
        } finally {
            setLoading(false);
        }
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

    const handleCancelProfile = () => {
        if (profile) {
            setProfileFormData({
                name: profile.name || "",
                phone: profile.phone || "",
                email: profile.email || "",
            });
        }
    };

    const handleCancelPassword = () => {
        setPasswordFormData({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        });
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
                                                        className={`px-4 py-3 border-0 text-start ${activeTab === "process" ? "text-danger bg-light" : "text-muted"}`}
                                                        style={{ cursor: "pointer" }}
                                                        onClick={() => handleTabChange("process")}
                                                    >
                                                        On Process
                                                    </Nav.Link>
                                                    <Nav.Link
                                                        className={`px-4 py-3 border-0 text-start ${activeTab === "deliveries" ? "text-danger bg-light" : "text-muted"}`}
                                                        style={{ cursor: "pointer" }}
                                                        onClick={() => handleTabChange("deliveries")}
                                                    >
                                                        In Deliveries
                                                    </Nav.Link>
                                                    <Nav.Link
                                                        className={`px-4 py-3 border-0 text-start ${activeTab === "delivered" ? "text-danger bg-light" : "text-muted"}`}
                                                        style={{ cursor: "pointer" }}
                                                        onClick={() => handleTabChange("delivered")}
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
                                        {activeTab === "profile" && (
                                            <>
                                                {/* Profile Update Form */}
                                                <div className="mb-5">
                                                    <h5 className="mb-4">Edit Profile</h5>
                                                    <Form>
                                                        <Row>
                                                            <Col md={6}>
                                                                <Form.Group className="mb-3">
                                                                    <Form.Label>Name</Form.Label>
                                                                    <Form.Control
                                                                        type="text"
                                                                        name="name"
                                                                        value={profileFormData.name}
                                                                        onChange={handleProfileInputChange}
                                                                        placeholder="Name"
                                                                        style={{ backgroundColor: "#f5f5f5" }}
                                                                        isInvalid={hasFieldError("name")}
                                                                    />
                                                                    <Form.Control.Feedback type="invalid">{getFieldError("name")}</Form.Control.Feedback>
                                                                </Form.Group>
                                                            </Col>
                                                            <Col md={6}>
                                                                <Form.Group className="mb-3">
                                                                    <Form.Label>Phone Number</Form.Label>
                                                                    <Form.Control
                                                                        type="text"
                                                                        name="phone"
                                                                        value={profileFormData.phone}
                                                                        onChange={handleProfileInputChange}
                                                                        placeholder="Phone Number"
                                                                        style={{ backgroundColor: "#f5f5f5" }}
                                                                        isInvalid={hasFieldError("phone")}
                                                                    />
                                                                    <Form.Control.Feedback type="invalid">{getFieldError("phone")}</Form.Control.Feedback>
                                                                </Form.Group>
                                                            </Col>
                                                        </Row>

                                                        <Row>
                                                            <Col md={12}>
                                                                <Form.Group className="mb-4">
                                                                    <Form.Label>E-mail</Form.Label>
                                                                    <Form.Control
                                                                        type="email"
                                                                        name="email"
                                                                        value={profileFormData.email}
                                                                        onChange={handleProfileInputChange}
                                                                        placeholder="E-mail"
                                                                        style={{ backgroundColor: "#f5f5f5" }}
                                                                        isInvalid={hasFieldError("email")}
                                                                    />
                                                                    <Form.Control.Feedback type="invalid">{getFieldError("email")}</Form.Control.Feedback>
                                                                </Form.Group>
                                                            </Col>
                                                        </Row>

                                                        <div className="d-flex justify-content-end gap-3 mt-4">
                                                            <Button variant="outline-secondary" onClick={handleCancelProfile}>
                                                                Cancel
                                                            </Button>
                                                            <Button variant="danger" onClick={handleUpdateProfile} className="px-4">
                                                                Save Changes
                                                            </Button>
                                                        </div>
                                                    </Form>
                                                </div>

                                                {/* Password Change Form */}
                                                <div className="border-top pt-4">
                                                    <h5 className="mb-4">Password Changes</h5>
                                                    <Form>
                                                        <Row>
                                                            <Col md={12}>
                                                                <Form.Group className="mb-3">
                                                                    <Form.Label>Current Password</Form.Label>
                                                                    <Form.Control
                                                                        type="password"
                                                                        name="currentPassword"
                                                                        value={passwordFormData.currentPassword}
                                                                        onChange={handlePasswordInputChange}
                                                                        placeholder="Current Password"
                                                                        style={{ backgroundColor: "#f5f5f5" }}
                                                                        isInvalid={hasFieldError("currentPassword") || hasFieldError("current_password")}
                                                                    />
                                                                    <Form.Control.Feedback type="invalid">{getFieldError("currentPassword") || getFieldError("current_password")}</Form.Control.Feedback>
                                                                </Form.Group>
                                                            </Col>
                                                        </Row>

                                                        <Row>
                                                            <Col md={6}>
                                                                <Form.Group className="mb-3">
                                                                    <Form.Label>New Password</Form.Label>
                                                                    <Form.Control
                                                                        type="password"
                                                                        name="newPassword"
                                                                        value={passwordFormData.newPassword}
                                                                        onChange={handlePasswordInputChange}
                                                                        placeholder="New Password"
                                                                        style={{ backgroundColor: "#f5f5f5" }}
                                                                        isInvalid={hasFieldError("newPassword") || hasFieldError("new_password")}
                                                                    />
                                                                    <Form.Control.Feedback type="invalid">{getFieldError("newPassword") || getFieldError("new_password")}</Form.Control.Feedback>
                                                                </Form.Group>
                                                            </Col>
                                                            <Col md={6}>
                                                                <Form.Group className="mb-3">
                                                                    <Form.Label>Confirm New Password</Form.Label>
                                                                    <Form.Control
                                                                        type="password"
                                                                        name="confirmPassword"
                                                                        value={passwordFormData.confirmPassword}
                                                                        onChange={handlePasswordInputChange}
                                                                        placeholder="Confirm New Password"
                                                                        style={{ backgroundColor: "#f5f5f5" }}
                                                                        isInvalid={hasFieldError("confirmPassword") || hasFieldError("confirm_password")}
                                                                    />
                                                                    <Form.Control.Feedback type="invalid">{getFieldError("confirmPassword") || getFieldError("confirm_password")}</Form.Control.Feedback>
                                                                </Form.Group>
                                                            </Col>
                                                        </Row>

                                                        <div className="d-flex justify-content-end gap-3 mt-4">
                                                            <Button variant="outline-secondary" onClick={handleCancelPassword}>
                                                                Cancel
                                                            </Button>
                                                            <Button variant="warning" onClick={handleChangePassword} className="px-4">
                                                                Change Password
                                                            </Button>
                                                        </div>
                                                    </Form>
                                                </div>
                                            </>
                                        )}

                                        {activeTab === "address" && <AddressBook />}

                                        {activeTab === "process" && <OrderList orderType="process" />}

                                        {activeTab === "deliveries" && <OrderList orderType="deliveries" />}

                                        {activeTab === "delivered" && <OrderList orderType="delivered" />}
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
