import React, { useState, useEffect } from "react";
import { Card, Button, Spinner, Alert } from "react-bootstrap";
import ReviewModal from "./ReviewModal";
import OrderService from "../services/OrderService";
import ReviewService from "../services/reviewService";
import { useApiErrorHandler } from "../hooks/useApiErrorHandler";

const OrderList = ({ orderType = "delivered" }) => {
    const { handleError, showSuccess } = useApiErrorHandler();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    // Helper functions
    const getStatusBadgeClass = (status) => {
        switch (status?.toLowerCase()) {
            case "pending":
                return "bg-warning";
            case "processing":
            case "processed":
                return "bg-info";
            case "shipped":
                return "bg-primary";
            case "delivered":
                return "bg-success";
            case "cancelled":
            case "canceled":
                return "bg-danger";
            default:
                return "bg-secondary";
        }
    };

    const formatOrderStatus = (status) => {
        if (!status) return "Unknown";
        return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    };

    const formatDate = (dateString) => {
        if (!dateString) return "Unknown Date";
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
            });
        } catch (error) {
            return "Invalid Date";
        }
    };

    // Fetch orders from API
    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError(null);

            // Map frontend orderType to API status
            const statusMap = {
                process: 0, // pending/process
                deliveries: 1, // shipped/deliveries
                delivered: 2, // delivered
            };

            const status = statusMap[orderType];
            console.log("OrderList - Fetching orders with status:", status, "for orderType:", orderType);
            const response = await OrderService.getUserOrders(status);
            console.log("OrderList - Raw API response:", response);

            // Check if response has data property and it's an array
            // Response structure: axios response has .data, Laravel API response has {message, data}
            const ordersData = response?.data?.data || response?.data;
            if (ordersData && Array.isArray(ordersData)) {
                console.log("OrderList - Processing orders data:", ordersData);

                // Transform API response to frontend format
                const transformedOrders = ordersData.map((order) => {
                    const transformedOrder = {
                        id: order.id,
                        invoice_code: order.invoice_code,
                        tracking_message: order.tracking_message,
                        created_at: order.created_at,
                        status: OrderService.mapStatusFromAPI(order.status),
                        total_price: order.total_price,
                        coupon_discount: order.coupon_discount,
                        payment_method: order.payment_method,
                        order_details: order.order_details || [],
                        // Legacy format for backward compatibility
                        message: `Message: ${order.tracking_message || "Order placed"}`,
                        total: order.total_price, // Don't divide by 100 as API already sends correct format
                    };
                    console.log("OrderList - Transformed order:", transformedOrder);
                    return transformedOrder;
                });

                console.log("OrderList - Setting orders:", transformedOrders);
                setOrders(transformedOrders);
            } else {
                console.log("OrderList - No data in response or invalid format:", response);
                console.log("OrderList - ordersData:", ordersData);
                console.log("OrderList - response.data:", response?.data);
                // Response is valid but no data (empty orders)
                setOrders([]);
            }
        } catch (error) {
            console.error("Failed to fetch orders:", error);
            console.error("Error details:", {
                message: error.message,
                status: error.status,
                data: error.data,
            });

            // Check if it's a network error or server error (not empty data)
            if (error.status === 404 || (error.data && error.data.length === 0)) {
                // 404 or empty data means no orders exist, not an error
                console.log("OrderList - No orders found (404 or empty data)");
                setOrders([]);
            } else {
                // Real error occurred
                console.log("OrderList - Real error occurred, setting error state");
                setError("Failed to load orders. Please try again.");
                setOrders([]);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [orderType]);

    // Review handling functions
    const handleReview = (orderId) => {
        const order = orders.find((o) => o.id === orderId);
        setSelectedOrder(order);
        setShowReviewModal(true);
    };

    const handleCloseReviewModal = () => {
        setShowReviewModal(false);
        setSelectedOrder(null);
    };

    const handleSaveReview = async (formData, orderId) => {
        try {
            // Find the order and get the first product for review
            const order = orders.find((o) => o.id === orderId);
            if (!order || !order.order_details || order.order_details.length === 0) {
                throw new Error("Order or product not found");
            }

            // For now, review the first product in the order
            // In a more complex scenario, you might want to review specific products
            const firstProduct = order.order_details[0];

            const reviewPayload = {
                product_id: firstProduct.product.id,
                rating: formData.rating,
                comment: formData.message, // ReviewModal uses 'message' field
                images: formData.picture ? [formData.picture] : [],
            };

            // Validate review data
            const validation = ReviewService.validateReview(reviewPayload);
            if (!validation.isValid) {
                handleError(new Error(validation.errors.join(", ")));
                return;
            }

            // Submit review
            await ReviewService.createReview(reviewPayload);
            showSuccess("Review submitted successfully!");
            handleCloseReviewModal();

            // Optionally refresh orders to update review status
            fetchOrders();
        } catch (error) {
            handleError(error);
        }
    };

    if (loading) {
        return (
            <div className="text-center py-5">
                <Spinner animation="border" variant="danger" />
                <p className="mt-2 text-muted">Loading orders...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="py-3">
                <Alert variant="danger">{error}</Alert>
                <Button variant="outline-danger" onClick={fetchOrders}>
                    Try Again
                </Button>
            </div>
        );
    }

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

                            {/* Order Products Information */}
                            <div className="p-4">
                                {order.order_details &&
                                    order.order_details.map((detail, index) => (
                                        <div key={index} className={`d-flex align-items-center ${index > 0 ? "mt-3 pt-3 border-top" : ""}`}>
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
                                                        src={detail.product?.product_images?.[0]?.name || "/product.png"}
                                                        alt={detail.product?.name || "Product"}
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
                                                <h6 className="fw-bold mb-2">{detail.product?.name || "Unknown Product"}</h6>
                                                <div className="mb-2">
                                                    <span className="text-muted small">Price: Rp {detail.product?.price?.toLocaleString("id-ID") || 0}</span>
                                                </div>
                                                <div className="mb-0">
                                                    <span className="text-muted small">Quantity: x{detail.quantity}</span>
                                                </div>
                                            </div>

                                            {/* Price and Actions */}
                                            <div className="text-end">
                                                <div className="mb-3">
                                                    <h6 className="text-muted">Rp {detail.total_price?.toLocaleString("id-ID") || 0}</h6>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                {/* Fallback for orders without order_details */}
                                {(!order.order_details || order.order_details.length === 0) && (
                                    <div className="text-center py-3">
                                        <p className="text-muted">Order details not available</p>
                                    </div>
                                )}
                            </div>
                            <div className="bg-light p-3 border-bottom">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <small className="text-muted">
                                            Order #{order.invoice_code || order.id} • {formatDate(order.created_at)}
                                        </small>
                                        <div>
                                            <span className={`badge ${getStatusBadgeClass(order.status)} text-dark`}>{formatOrderStatus(order.status)}</span>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        {/* Review Button - Only show for delivered orders */}
                                        {order.status === "delivered" && (
                                            <Button variant="danger" size="sm" className="fw-semibold px-3 me-3" onClick={() => handleReview(order.id)}>
                                                Review
                                            </Button>
                                        )}
                                        <div className="text-end">
                                            <div className="text-muted small">Total</div>
                                            <div className="fw-bold text-danger">Rp {order.total_price?.toLocaleString("id-ID") || 0}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                ))}
            </div>

            {/* Review Modal */}
            {showReviewModal && selectedOrder && <ReviewModal show={showReviewModal} onHide={handleCloseReviewModal} onSave={handleSaveReview} order={selectedOrder} />}
        </div>
    );
};

export default OrderList;
