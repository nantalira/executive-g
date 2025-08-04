// src/pages/LoginPage.jsx
import React from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { Google } from "react-bootstrap-icons";
import { Link } from "react-router-dom";

const LoginPage = () => {
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
                                alt="Login Illustration"
                                className="img-fluid rounded-3"
                                style={{
                                    maxHeight: "580px",
                                    width: "100%",
                                    objectFit: "cover",
                                }}
                            />
                        </div>
                    </Col>

                    {/* Kolom Kanan: Form Login - Desktop di kanan, Mobile di bawah */}
                    <Col md={6} className="order-2 order-md-2 px-md-5">
                        <h2 className="fw-bolder">Log in to Exclusive Gadget</h2>
                        <p className="mt-3">Enter your details below</p>

                        <Form>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Control type="email" placeholder="E-mail" className="border-0 border-bottom rounded-1" />
                            </Form.Group>

                            <Form.Group className="mb-4" controlId="formBasicPassword">
                                <Form.Control type="password" placeholder="Password" className="border-0 border-bottom rounded-1" />
                            </Form.Group>

                            <div className="text-end mb-3">
                                <a href="#" className="text-danger">
                                    Forget Password?
                                </a>
                            </div>
                            <Button variant="danger" type="submit" size="lg" className="w-100 rounded-1">
                                Log In
                            </Button>
                        </Form>

                        <div className="text-center my-2">or</div>

                        <Button variant="outline-dark" className="w-100 rounded-1 mb-4" size="lg">
                            <Google className="me-2" /> Sign up with Google
                        </Button>
                        <div className="text-center">
                            Don't have an account?{" "}
                            <Link to="/register" className="text-dark fw-bold">
                                Create Account
                            </Link>
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default LoginPage;
