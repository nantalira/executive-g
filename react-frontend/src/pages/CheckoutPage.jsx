import React, { useState, useEffect } from "react";
import MainLayout from "../layouts/MainLayout";
import { Container, Row, Col, Table, Button, Form, Card, InputGroup } from "react-bootstrap";
import { Link } from "react-router-dom";

const CheckoutPage = () => {
    const [formData, setFormData] = useState({
        name: "",
        phoneNumber: "",
        address: "",
        streetAddress: "",
        detailAddress: "",
    });

    const [paymentMethod, setPaymentMethod] = useState("cash");
    const [couponCode, setCouponCode] = useState("");

    // Sample order items - in real app this would come from cart state
    const [orderItems] = useState([
        {
            id: 1,
            name: "LCD Monitor",
            price: 650,
            quantity: 4,
            image: "https://exclusive-api.nantalira.site/storage/products/images/01K1K1VBA4KNQ63JXAF9B1W4ZH.jpg",
        },
        {
            id: 2,
            name: "HI Gamepad",
            price: 1100,
            quantity: 3,
            image: "https://exclusive-api.nantalira.site/storage/products/images/01K1K1VBA4KNQ63JXAF9B1W4ZH.jpg",
        },
    ]);

    // Calculate totals
    const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = 0; // Free shipping
    const total = subtotal + shipping;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle order placement logic here
        console.log("Order placed:", { formData, paymentMethod, orderItems });
    };

    return (
        <>
            <MainLayout>
                <Container className="py-4">
                    {/* Breadcrumb */}
                    <Row className="mb-4">
                        <h3 className="fw-bold">Billing Details</h3>
                    </Row>

                    <Row>
                        {/* Billing Details Form */}
                        <Col lg={7} className="mb-4 mb-lg-0">
                            <Form onSubmit={handleSubmit}>
                                <Row className="mb-3">
                                    <Col>
                                        <Form.Label className="text-muted small">Name *</Form.Label>
                                        <Form.Control type="text" name="name" value={formData.name} onChange={handleInputChange} required className="bg-light border-0 py-2" style={{ backgroundColor: "#f5f5f5" }} />
                                    </Col>
                                </Row>

                                <Row className="mb-3">
                                    <Col>
                                        <Form.Label className="text-muted small">Phone Number *</Form.Label>
                                        <Form.Control type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} required className="bg-light border-0 py-2" style={{ backgroundColor: "#f5f5f5" }} />
                                    </Col>
                                </Row>

                                <Row className="mb-3">
                                    <Col>
                                        <Form.Label className="text-muted small">Address *</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            required
                                            className="bg-light border-0 py-2"
                                            style={{ backgroundColor: "#f5f5f5", resize: "none" }}
                                        />
                                    </Col>
                                </Row>

                                <Row className="mb-3">
                                    <Col>
                                        <Form.Label className="text-muted small">Street Address</Form.Label>
                                        <Form.Control type="text" name="streetAddress" value={formData.streetAddress} onChange={handleInputChange} className="bg-light border-0 py-2" style={{ backgroundColor: "#f5f5f5" }} />
                                    </Col>
                                </Row>

                                <Row className="mb-4">
                                    <Col>
                                        <Form.Label className="text-muted small">Detail Address (optional)</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={2}
                                            name="detailAddress"
                                            value={formData.detailAddress}
                                            onChange={handleInputChange}
                                            className="bg-light border-0 py-2"
                                            style={{ backgroundColor: "#f5f5f5", resize: "none" }}
                                        />
                                    </Col>
                                </Row>

                                <Button variant="danger" className="fw-semibold px-4 py-2">
                                    Edit Address
                                </Button>
                            </Form>
                        </Col>

                        {/* Order Summary */}
                        <Col lg={5}>
                            <div className="ps-lg-4">
                                {/* Order Items */}
                                <div className="mb-4">
                                    {orderItems.map((item) => (
                                        <div key={item.id} className="d-flex align-items-center justify-content-between mb-3">
                                            <div className="d-flex align-items-center">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    style={{
                                                        width: "54px",
                                                        height: "54px",
                                                        objectFit: "cover",
                                                        borderRadius: "4px",
                                                    }}
                                                    className="me-3"
                                                />
                                                <div>
                                                    <div className="fw-medium">{item.name}</div>
                                                    <small className="text-muted">x{item.quantity}</small>
                                                </div>
                                            </div>
                                            <div className="fw-medium">${item.price}</div>
                                        </div>
                                    ))}
                                </div>

                                {/* Order Summary */}
                                <div className="border-bottom pb-3 mb-3">
                                    <div className="d-flex justify-content-between mb-2">
                                        <span>Subtotal:</span>
                                        <span className="fw-medium">${subtotal}</span>
                                    </div>
                                    <div className="d-flex justify-content-between mb-2">
                                        <span>Shipping:</span>
                                        <span className="fw-medium">Free</span>
                                    </div>
                                    <div className="d-flex justify-content-between fs-5 fw-bold">
                                        <span>Total:</span>
                                        <span>${total}</span>
                                    </div>
                                </div>

                                {/* Payment Method */}
                                <div className="mb-4">
                                    <div className="mb-3">
                                        <Form.Check type="radio" name="paymentMethod" id="bank" label="Bank" value="bank" checked={paymentMethod === "bank"} onChange={(e) => setPaymentMethod(e.target.value)} />
                                        <Form.Check type="radio" name="paymentMethod" id="cash" label="Cash on delivery" value="cash" checked={paymentMethod === "cash"} onChange={(e) => setPaymentMethod(e.target.value)} className="mt-2" />
                                    </div>
                                </div>

                                {/* Coupon Code */}
                                <div className="mb-4">
                                    <div className="d-flex gap-2">
                                        <Form.Control type="text" placeholder="Coupon Code" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} className="border-2" />
                                        <Button variant="danger" className="fw-semibold px-4" style={{ whiteSpace: "nowrap" }}>
                                            Apply Coupon
                                        </Button>
                                    </div>
                                </div>

                                {/* Place Order Button */}
                                <Button type="submit" variant="danger" size="lg" className="w-100 fw-semibold" onClick={handleSubmit}>
                                    Place Order
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </MainLayout>
        </>
    );
};

export default CheckoutPage;
