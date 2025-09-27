import React, { useState, useEffect } from "react";
import MainLayout from "../layouts/MainLayout";
import { Container, Row, Col, Table, Button, Form, Card, InputGroup } from "react-bootstrap";
import { Link } from "react-router-dom";

const CartPage = () => {
    const [loading, setLoading] = useState(false);
    const [couponCode, setCouponCode] = useState("");
    const [selectAll, setSelectAll] = useState(false);

    // Sample cart data - in real app this would come from state management or API
    const [cartItems, setCartItems] = useState([
        {
            id: 1,
            name: "LCD Monitor",
            price: 650,
            quantity: 1,
            selected: false,
            image: "https://exclusive-api.nantalira.site/storage/products/images/01K1K1VBA4KNQ63JXAF9B1W4ZH.jpg",
        },
        {
            id: 2,
            name: "HI Gamepad",
            price: 550,
            quantity: 2,
            selected: false,
            image: "https://exclusive-api.nantalira.site/storage/products/images/01K1K1VBA4KNQ63JXAF9B1W4ZH.jpg",
        },
    ]);

    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = 0; // Free shipping
    const total = subtotal + shipping;

    // Handle select all checkbox
    const handleSelectAll = (checked) => {
        setSelectAll(checked);
        setCartItems((items) => items.map((item) => ({ ...item, selected: checked })));
    };

    // Handle individual item selection
    const handleItemSelect = (id, checked) => {
        setCartItems((items) => {
            const updatedItems = items.map((item) => (item.id === id ? { ...item, selected: checked } : item));

            // Update selectAll state based on whether all items are selected
            const allSelected = updatedItems.every((item) => item.selected);
            setSelectAll(allSelected);

            return updatedItems;
        });
    };

    // Handle quantity change
    const updateQuantity = (id, newQuantity) => {
        if (newQuantity < 1) return;
        setCartItems((items) => items.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)));
    };

    // Handle remove item
    const removeItem = (id) => {
        setCartItems((items) => items.filter((item) => item.id !== id));
    };

    return (
        <>
            <MainLayout>
                <Container className="py-4">
                    {/* Breadcrumb */}
                    <Row>
                        <Col className="mb-4">
                            <Link to="/" className="text-decoration-none">
                                <span className="text-muted">Home</span>
                            </Link>
                            <span className="mx-1 text-muted">/</span>
                            <span className="text-dark">Cart</span>
                        </Col>
                    </Row>

                    {/* Cart Table */}
                    <Row className="mb-4">
                        <Col lg={8} className="mb-4 mb-lg-0">
                            <div className="bg-white shadow-sm rounded">
                                <Table responsive className="mb-0">
                                    <thead className="border-bottom">
                                        <tr>
                                            <th className="py-3 px-4" style={{ width: "50px" }}>
                                                <Form.Check type="checkbox" checked={selectAll} onChange={(e) => handleSelectAll(e.target.checked)} />
                                            </th>
                                            <th className="py-3 px-4 fw-normal text-muted">Product</th>
                                            <th className="py-3 px-4 fw-normal text-muted">Price</th>
                                            <th className="py-3 px-4 fw-normal text-muted">Quantity</th>
                                            <th className="py-3 px-4 fw-normal text-muted">Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cartItems.map((item) => (
                                            <tr key={item.id} className="border-bottom">
                                                <td className="py-4 px-4">
                                                    <Form.Check type="checkbox" checked={item.selected} onChange={(e) => handleItemSelect(item.id, e.target.checked)} />
                                                </td>
                                                <td className="py-4 px-4">
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
                                                        <span className="fw-medium">{item.name}</span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <span>${item.price}</span>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="d-flex align-items-center">
                                                        <Form.Control
                                                            type="number"
                                                            min="1"
                                                            value={item.quantity}
                                                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                                                            style={{
                                                                width: "80px",
                                                                textAlign: "center",
                                                            }}
                                                            className="border-2"
                                                        />
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <span className="fw-medium">${item.price * item.quantity}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        </Col>
                        <Col lg={4}>
                            {/* Cart Total Card */}
                            <Card className="border-2 mb-4">
                                <Card.Header className="bg-white border-0 py-3">
                                    <h5 className="mb-0 fw-bold">Cart Total</h5>
                                </Card.Header>
                                <Card.Body className="py-3">
                                    <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
                                        <span className="text-muted">Subtotal:</span>
                                        <span className="fw-medium">${subtotal}</span>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
                                        <span className="text-muted">Shipping:</span>
                                        <span className="fw-medium text-success">{shipping === 0 ? "Free" : `$${shipping}`}</span>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center py-3 fw-bold fs-5">
                                        <span>Total:</span>
                                        <span className="text-danger">${total}</span>
                                    </div>
                                    <Button as={Link} to="/checkout" variant="danger" size="lg" className="w-100 mt-2 fw-semibold text-decoration-none">
                                        Process to Checkout
                                    </Button>
                                </Card.Body>
                            </Card>

                            {/* Coupon Code Section */}
                            <Card className="border-2">
                                <Card.Header className="bg-white border-0 py-3">
                                    <h6 className="mb-0 fw-bold">Have a Coupon?</h6>
                                </Card.Header>
                                <Card.Body className="py-3">
                                    <div className="d-flex flex-column flex-sm-row gap-2">
                                        <Form.Control type="text" placeholder="Enter coupon code" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} className="border-2" style={{ flexGrow: 1 }} />
                                        <Button variant="danger" className="fw-semibold px-4" style={{ whiteSpace: "nowrap" }}>
                                            Apply Coupon
                                        </Button>
                                    </div>
                                    <small className="text-muted mt-2 d-block">Enter your coupon code to get discount on your order</small>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </MainLayout>
        </>
    );
};

export default CartPage;
