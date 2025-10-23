// src/pages/RegisterPage.jsx
import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { Google } from "react-bootstrap-icons";
import { AuthService } from "../services"; // Import auth service
import { useApiErrorHandler } from "../hooks/useApiErrorHandler"; // Import error handler hook
const RegisterPage = () => {
    const navigate = useNavigate();
    const { handleError, clearFieldError, hasFieldError, getFieldError, showSuccess } = useApiErrorHandler();
    const [loading, setLoading] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone_number: "",
        password: "",
        confirm_password: "",
    });

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Clear error untuk field yang sedang diubah
        if (hasFieldError(name)) {
            clearFieldError(name);
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Client-side validation
        if (formData.password !== formData.confirm_password) {
            handleError({ message: "Passwords do not match" });
            setLoading(false);
            return;
        }

        try {
            // Prepare data untuk API (sesuai dengan parameter backend)
            const userData = {
                name: formData.name,
                email: formData.email,
                phone_number: formData.phone_number,
                password: formData.password,
                confirm_password: formData.confirm_password,
            };

            // Gunakan authService untuk register
            const authService = new AuthService();
            await authService.register(userData);

            console.log("Registration successful");

            showSuccess("Account created successfully!");

            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (err) {
            // Handle error menggunakan error handler hook
            handleError(err, "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };
    return (
        <>
            <div className="bg-dark text-white text-center py-1">
                <p className="mb-0 small">
                    Summer Sale For All Swim Suits And Free Express Delivery - OFF 50%!
                    <a href="#" className="text-white fw-bold ms-2 text-decoration-underline">
                        ShopNow
                    </a>
                </p>
            </div>
            <Link to="/" className="text-decoration-none">
                <div className="bg-light text-dark fw-bolder fs-4 py-3 text-center border-bottom">Exclusive Gadget</div>
            </Link>
            <Container className="mt-1">
                <Row className="align-items-center">
                    {/* Kolom Kiri: Gambar - Desktop di kiri, Mobile di atas */}
                    <Col md={6} className="order-1 order-md-1 mb-4 mb-md-0">
                        <div className="d-flex justify-content-center">
                            <img
                                src="https://exclusive-api.nantalira.site/storage/products/images/01K1K1VBA4KNQ63JXAF9B1W4ZH.jpg"
                                alt="Register Illustration"
                                className="img-fluid rounded-3"
                                style={{
                                    maxHeight: "580px",
                                    width: "100%",
                                    objectFit: "cover",
                                }}
                            />
                        </div>
                    </Col>

                    {/* Kolom Kanan: Form Registrasi - Desktop di kanan, Mobile di bawah */}
                    <Col md={6} className="order-2 order-md-2 px-md-5 ">
                        <h2 className="fw-bolder">Create an account</h2>
                        <p className="mt-3">Enter your details below</p>

                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Control
                                    type="text"
                                    name="name"
                                    placeholder="Name"
                                    className={`border-0 border-bottom rounded-1 ${hasFieldError("name") ? "is-invalid" : ""}`}
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                />
                                {hasFieldError("name") && <div className="invalid-feedback d-block">{getFieldError("name")}</div>}
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Control
                                    type="email"
                                    name="email"
                                    placeholder="E-mail"
                                    className={`border-0 border-bottom rounded-1 ${hasFieldError("email") ? "is-invalid" : ""}`}
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                />
                                {hasFieldError("email") && <div className="invalid-feedback d-block">{getFieldError("email")}</div>}
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Control
                                    type="tel"
                                    name="phone_number"
                                    placeholder="Phone Number"
                                    className={`border-0 border-bottom rounded-1 ${hasFieldError("phone_number") ? "is-invalid" : ""}`}
                                    value={formData.phone_number}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                />
                                {hasFieldError("phone_number") && <div className="invalid-feedback d-block">{getFieldError("phone_number")}</div>}
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Control
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    className={`border-0 border-bottom rounded-1 ${hasFieldError("password") ? "is-invalid" : ""}`}
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                    minLength="6"
                                />
                                {hasFieldError("password") && <div className="invalid-feedback d-block">{getFieldError("password")}</div>}
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <Form.Control
                                    type="password"
                                    name="confirm_password"
                                    placeholder="Confirm Password"
                                    className={`border-0 border-bottom rounded-1 ${hasFieldError("confirm_password") ? "is-invalid" : ""}`}
                                    value={formData.confirm_password}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                    minLength="6"
                                />
                                {hasFieldError("confirm_password") && <div className="invalid-feedback d-block">{getFieldError("confirm_password")}</div>}
                            </Form.Group>

                            <Button variant="danger" type="submit" size="lg" className="w-100 rounded-1" disabled={loading}>
                                {loading ? (
                                    <>
                                        <Spinner as="span" animation="border" size="sm" role="status" className="me-2" />
                                        Creating Account...
                                    </>
                                ) : (
                                    "Create Account"
                                )}
                            </Button>
                        </Form>

                        <div className="text-center my-2">or</div>

                        <Button variant="outline-dark" className="w-100 mb-4 rounded-1" size="lg">
                            <Google className="me-2" /> Sign up with Google
                        </Button>

                        <div className="text-center">
                            <span>Already have account? </span>
                            <Link to="/login" className="text-dark fw-bold">
                                Log in
                            </Link>
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default RegisterPage;
