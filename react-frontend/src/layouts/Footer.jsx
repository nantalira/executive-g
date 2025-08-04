// src/layouts/Footer.jsx
import React from "react";
import { Container, Row, Col, Form, Button, Nav } from "react-bootstrap";
import { Send } from "react-bootstrap-icons";

const Footer = () => {
    return (
        <footer className="bg-dark text-white pt-5 pb-3">
            <Container>
                <Row>
                    <Col md={3}>
                        <h5 className="fw-bold">Exclusive</h5>
                        <p>Subscribe</p>
                        <p>Get 10% off your first order</p>
                        <Form className="d-flex">
                            <Form.Control type="email" placeholder="Enter your email" />
                            <Button variant="dark" type="submit">
                                <Send />
                            </Button>
                        </Form>
                    </Col>
                    <Col md={2}>
                        <h5 className="fw-bold">Support</h5>
                        <p>111 Bijoy sarani, Dhaka, DH 1515, Bangladesh.</p>
                        <p>exclusive@gmail.com</p>
                        <p>+88015-88888-9999</p>
                    </Col>
                    <Col md={2}>
                        <h5 className="fw-bold">Account</h5>
                        <Nav className="flex-column">
                            <Nav.Link href="#" className="text-white">
                                My Account
                            </Nav.Link>
                            <Nav.Link href="#" className="text-white">
                                Login / Register
                            </Nav.Link>
                            <Nav.Link href="#" className="text-white">
                                Cart
                            </Nav.Link>
                            <Nav.Link href="#" className="text-white">
                                Wishlist
                            </Nav.Link>
                            <Nav.Link href="#" className="text-white">
                                Shop
                            </Nav.Link>
                        </Nav>
                    </Col>
                    <Col md={2}>
                        <h5 className="fw-bold">Quick Link</h5>
                        <Nav className="flex-column">
                            <Nav.Link href="#" className="text-white">
                                Privacy Policy
                            </Nav.Link>
                            <Nav.Link href="#" className="text-white">
                                Terms Of Use
                            </Nav.Link>
                            <Nav.Link href="#" className="text-white">
                                FAQ
                            </Nav.Link>
                            <Nav.Link href="#" className="text-white">
                                Contact
                            </Nav.Link>
                        </Nav>
                    </Col>
                    <Col md={3}>
                        <h5 className="fw-bold">Download App</h5>
                        <p>Save $3 with App New User Only</p>
                        {/* Tambahkan QR Code dan App Store buttons di sini */}
                    </Col>
                </Row>
                <div className="text-center text-muted border-top border-secondary mt-5 pt-3">&copy; Copyright Rimel 2022. All right reserved</div>
            </Container>
        </footer>
    );
};

export default Footer;
