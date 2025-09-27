import React, { useState } from "react";
import { Card, Button } from "react-bootstrap";
import ReviewModal from "./ReviewModal";

const OrderList = ({ orderType = "delivered" }) => {
    // Sample orders data - in real app this would come from props or API
    const getOrdersByType = (type) => {
        const allOrders = [
            {
                id: 1,
                productName: "Havic HV G-92 Gamepad",
                variations: "Blue 14",
                quantity: 2,
                price: 192.0,
                total: 192.0,
                image: "https://exclusive-api.nantalira.site/storage/products/images/01K1K1VBA4KNQ63JXAF9B1W4ZH.jpg",
                message: "Message: Pesanan sedang beranda di DC cabang",
                status: "process",
            },
            {
                id: 2,
                productName: "Havic HV G-92 Gamepad",
                variations: "Blue 14",
                quantity: 2,
                price: 192.0,
                total: 192.0,
                image: "https://exclusive-api.nantalira.site/storage/products/images/01K1K1VBA4KNQ63JXAF9B1W4ZH.jpg",
                message: "Message: Pesanan sedang beranda di DC cabang",
                status: "deliveries",
            },
            {
                id: 3,
                productName: "Havic HV G-92 Gamepad",
                variations: "Blue 14",
                quantity: 2,
                price: 192.0,
                total: 192.0,
                image: "https://exclusive-api.nantalira.site/storage/products/images/01K1K1VBA4KNQ63JXAF9B1W4ZH.jpg",
                message: "Message: Pesanan sedang beranda di DC cabang",
                status: "delivered",
            },
            {
                id: 4,
                productName: "Havic HV G-92 Gamepad",
                variations: "Blue 14",
                quantity: 2,
                price: 192.0,
                total: 192.0,
                image: "https://exclusive-api.nantalira.site/storage/products/images/01K1K1VBA4KNQ63JXAF9B1W4ZH.jpg",
                message: "Message: Pesanan sedang beranda di DC cabang",
                status: "delivered",
            },
        ];

        // Filter orders by type
        if (type === "process") {
            return allOrders.filter((order) => order.status === "process");
        } else if (type === "deliveries") {
            return allOrders.filter((order) => order.status === "deliveries");
        } else if (type === "delivered") {
            return allOrders.filter((order) => order.status === "delivered");
        }
        return [];
    };

    const orders = getOrdersByType(orderType);

    // Review modal state
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const handleReview = (orderId) => {
        const order = orders.find((o) => o.id === orderId);
        setSelectedOrder(order);
        setShowReviewModal(true);
    };

    const handleSaveReview = (reviewData, orderId) => {
        // TODO: Implement save review functionality
        console.log("Save review for order:", orderId, reviewData);
        alert(`Review saved successfully for order ID: ${orderId}`);

        // In real app, you would send this data to your API
        // Example: await api.saveReview(orderId, reviewData);
    };

    if (orders.length === 0) {
        return (
            <div className="text-center py-5">
                <h5 className="fw-bold">No orders found in this category.</h5>
                <p className="text-muted">Your orders will appear here once you make a purchase.</p>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-4">
                <h4 className="fw-bold text-danger mb-0">{orderType === "delivered" ? "Delivered Orders" : orderType === "process" ? "Orders in Process" : orderType === "deliveries" ? "Orders in Deliveries" : ""}</h4>
            </div>

            <div className="d-flex flex-column gap-3">
                {orders.map((order) => (
                    <Card key={order.id} className="border-1 shadow-sm">
                        <Card.Body className="p-0">
                            {/* Message Section - Top */}
                            <div className="bg-light p-3 border-bottom">
                                <div className="d-flex justify-content-end">
                                    <small className="text-muted">{order.message}</small>
                                </div>
                            </div>

                            {/* Product Information */}
                            <div className="p-4">
                                <div className="d-flex align-items-center">
                                    {/* Product Image */}
                                    <div className="me-4">
                                        <div
                                            className="bg-light rounded d-flex align-items-center justify-content-center"
                                            style={{
                                                width: "100px",
                                                height: "100px",
                                                padding: "10px",
                                            }}
                                        >
                                            <img
                                                src={order.image}
                                                alt={order.productName}
                                                style={{
                                                    maxWidth: "80px",
                                                    maxHeight: "80px",
                                                    objectFit: "contain",
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Product Details */}
                                    <div className="flex-grow-1">
                                        <h6 className="fw-bold mb-2">{order.productName}</h6>
                                        <div className="mb-2">
                                            <span className="text-muted small">Variations: {order.variations}</span>
                                        </div>
                                        <div className="mb-0">
                                            <span className="text-muted small">x{order.quantity}</span>
                                        </div>
                                    </div>

                                    {/* Price and Actions */}
                                    <div className="text-end">
                                        <div className="mb-3">
                                            <h6 className="text-muted">$ {order.total.toFixed(2)}</h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-light p-3 border-bottom">
                                <div className="d-flex justify-content-end">
                                    <div className="d-flex justify-content-between">
                                        {/* Review Button - Only show for delivered orders */}
                                        {orderType === "delivered" && (
                                            <div className="me-4">
                                                <Button variant="danger" size="sm" className="fw-semibold px-3" onClick={() => handleReview(order.id)}>
                                                    Review
                                                </Button>
                                            </div>
                                        )}
                                        <span className="fw-semibold mt-1 me-2">Total: </span>
                                        <span className="fw-bold text-danger mt-1">$ {order.total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                ))}
            </div>

            {/* Review Modal */}
            <ReviewModal show={showReviewModal} onHide={() => setShowReviewModal(false)} order={selectedOrder} onSave={handleSaveReview} />
        </div>
    );
};

export default OrderList;
