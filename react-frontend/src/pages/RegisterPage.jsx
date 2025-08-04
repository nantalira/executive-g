// src/pages/RegisterPage.jsx
import React from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Google } from "react-bootstrap-icons";

const RegisterPage = () => {
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
                                src="https://nantalira.site:8100/storage/products/images/01K1K1VBA4KNQ63JXAF9B1W4ZH.jpg"
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

                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Control type="text" placeholder="Name" className="border-0 border-bottom rounded-1" />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Control type="email" placeholder="E-mail" className="border-0 border-bottom rounded-1" />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Control type="tel" placeholder="Phone Number" className="border-0 border-bottom rounded-1" />
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <Form.Control type="password" placeholder="Password" className="border-0 border-bottom rounded-1" />
                            </Form.Group>

                            <Button variant="danger" type="submit" size="lg" className="w-100 rounded-1">
                                Create Account
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
