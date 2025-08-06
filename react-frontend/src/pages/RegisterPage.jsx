// src/pages/RegisterPage.jsx
import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Alert, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { Google } from "react-bootstrap-icons";
import { authService } from "../services"; // Import auth service

const RegisterPage = () => {
    const navigate = useNavigate();

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone_number: "",
        password: "",
        confirm_password: "",
    });

    // UI state
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Clear error when user starts typing
        if (error) setError("");
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        // Client-side validation
        if (formData.password !== formData.confirm_password) {
            setError("Passwords do not match");
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
                confirm_password: formData.confirm_password, // Backend mengharap password_confirmation
            };

            // Gunakan authService untuk register
            await authService.register(userData);

            console.log("Registration successful");

            setSuccess("Account created successfully! Please check your email for verification.");

            // Redirect to login page after 2 seconds
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (err) {
            console.error("Registration error:", err);

            // Handle error dari service layer
            let errorMessage = "Registration failed. Please try again.";

            if (err.message) {
                errorMessage = err.message;
            } else if (err.data?.errors) {
                // Handle validation errors dari Laravel
                const firstError = Object.values(err.data.errors)[0][0];
                errorMessage = firstError;
            } else if (err.data?.message) {
                errorMessage = err.data.message;
            }

            setError(errorMessage);
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

                        {/* Error Alert */}
                        {error && (
                            <Alert variant="danger" className="mb-3">
                                {error}
                            </Alert>
                        )}

                        {/* Success Alert */}
                        {success && (
                            <Alert variant="success" className="mb-3">
                                {success}
                            </Alert>
                        )}

                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Control type="text" name="name" placeholder="Name" className="border-0 border-bottom rounded-1" value={formData.name} onChange={handleChange} required disabled={loading} />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Control type="email" name="email" placeholder="E-mail" className="border-0 border-bottom rounded-1" value={formData.email} onChange={handleChange} required disabled={loading} />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Control type="tel" name="phone_number" placeholder="Phone Number" className="border-0 border-bottom rounded-1" value={formData.phone_number} onChange={handleChange} required disabled={loading} />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Control type="password" name="password" placeholder="Password" className="border-0 border-bottom rounded-1" value={formData.password} onChange={handleChange} required disabled={loading} minLength="6" />
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <Form.Control
                                    type="password"
                                    name="confirm_password"
                                    placeholder="Confirm Password"
                                    className="border-0 border-bottom rounded-1"
                                    value={formData.confirm_password}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                    minLength="6"
                                />
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
