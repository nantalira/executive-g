import React, { useState } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import { useOutletContext } from "react-router-dom";
import AuthService from "../../services/AuthService";
import { useApiErrorHandler } from "../../hooks/useApiErrorHandler";
const ChangePassword = () => {
    const { profile } = useOutletContext();
    const { handleError, clearFieldError, hasFieldError, getFieldError, showSuccess } = useApiErrorHandler();
    const [loading, setLoading] = useState(false);

    const [passwordFormData, setPasswordFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

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

    const handleCancelPassword = () => {
        setPasswordFormData({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        });
    };

    return (
        <>
            <h5 className="mb-4">Change Password</h5>
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
                    <Button variant="warning" onClick={handleChangePassword} className="px-4" disabled={loading}>
                        Change Password
                    </Button>
                </div>
            </Form>
        </>
    );
};

export default ChangePassword;
