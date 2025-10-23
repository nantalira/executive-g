import React, { useState, useEffect } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import { useOutletContext } from "react-router-dom";
import AuthService from "../../services/AuthService";
import { useApiErrorHandler } from "../../hooks/useApiErrorHandler";
const MyProfile = () => {
    const { profile, fetchProfile } = useOutletContext();
    const { handleError, clearFieldError, hasFieldError, getFieldError, showSuccess } = useApiErrorHandler();
    const [loading, setLoading] = useState(false);

    const [profileFormData, setProfileFormData] = useState({
        name: "",
        phone: "",
        email: "",
    });

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

    const handleCancelProfile = () => {
        if (profile) {
            setProfileFormData({
                name: profile.name || "",
                phone: profile.phone || "",
                email: profile.email || "",
            });
        }
    };

    useEffect(() => {
        if (profile) {
            setProfileFormData({
                name: profile.name || "",
                phone: profile.phone || "",
                email: profile.email || "",
            });
        }
    }, [profile]);

    return (
        <>
            <h5 className="mb-4">Edit Profile</h5>
            <Form>
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" name="name" value={profileFormData.name} onChange={handleProfileInputChange} placeholder="Name" style={{ backgroundColor: "#f5f5f5" }} isInvalid={hasFieldError("name")} />
                            <Form.Control.Feedback type="invalid">{getFieldError("name")}</Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Phone Number</Form.Label>
                            <Form.Control type="text" name="phone" value={profileFormData.phone} onChange={handleProfileInputChange} placeholder="Phone Number" style={{ backgroundColor: "#f5f5f5" }} isInvalid={hasFieldError("phone")} />
                            <Form.Control.Feedback type="invalid">{getFieldError("phone")}</Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={12}>
                        <Form.Group className="mb-4">
                            <Form.Label>E-mail</Form.Label>
                            <Form.Control type="email" name="email" value={profileFormData.email} onChange={handleProfileInputChange} placeholder="E-mail" style={{ backgroundColor: "#f5f5f5" }} isInvalid={hasFieldError("email")} />
                            <Form.Control.Feedback type="invalid">{getFieldError("email")}</Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                </Row>

                <div className="d-flex justify-content-end gap-3 mt-4">
                    <Button variant="outline-secondary" onClick={handleCancelProfile}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleUpdateProfile} className="px-4" disabled={loading}>
                        Save Changes
                    </Button>
                </div>
            </Form>
        </>
    );
};

export default MyProfile;
