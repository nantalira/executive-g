import React, { useState, useEffect } from "react";
import { Card, Alert, Spinner } from "react-bootstrap";
import ProductService from "../services/productService";
import { useApiErrorHandler } from "../hooks/useApiErrorHandler";
import CustomPagination from "./CustomPagination";

const ProductReviews = ({ productId }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [reviews, setReviews] = useState([]);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { handleError } = useApiErrorHandler();

    const itemsPerPage = 3;

    // Fetch reviews from API with pagination
    useEffect(() => {
        const fetchReviews = async () => {
            if (!productId) return;

            try {
                setLoading(true);
                setError(null);

                const response = await ProductService.getProductReviews(productId, {
                    items_per_page: itemsPerPage,
                    page: currentPage,
                });

                setReviews(response.data.data || []);
                setPagination(response.data.pagination || {});
            } catch (err) {
                console.error("Error fetching reviews:", err);
                const errorInfo = handleError(err);
                setError(errorInfo.message || "Failed to load reviews");
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [productId, currentPage, handleError]);

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span key={i} className={i <= rating ? "text-warning" : "text-muted"} style={{ fontSize: "16px" }}>
                    ★
                </span>
            );
        }
        return stars;
    };

    // Format date helper
    const formatDate = (dateString) => {
        try {
            return new Date(dateString).toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            });
        } catch {
            return "Unknown date";
        }
    };

    return (
        <div className="mb-5">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="d-flex align-items-center">
                    <div
                        style={{
                            width: "20px",
                            height: "40px",
                            backgroundColor: "#DB4444",
                            borderRadius: "4px",
                        }}
                    ></div>
                    <h5 className="ms-3 fw-bold text-danger mb-0">Reviews {pagination.total_items > 0 && `(${pagination.total_items})`}</h5>
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="text-center py-5">
                    <Spinner animation="border" variant="danger" />
                    <p className="mt-2 text-muted">Loading reviews...</p>
                </div>
            )}

            {/* Error State */}
            {error && (
                <Alert variant="danger">
                    <p className="mb-0">{error}</p>
                </Alert>
            )}

            {/* Empty State */}
            {!loading && !error && reviews.length === 0 && (
                <Alert variant="info">
                    <p className="mb-0">No reviews yet. Be the first to review this product!</p>
                </Alert>
            )}

            {/* Reviews List */}
            {!loading && !error && reviews.length > 0 && (
                <>
                    {/* Reviews Cards */}
                    <div className="mb-4">
                        {reviews.map((review) => (
                            <Card key={review.id} className="mb-3 border-0 shadow-sm">
                                <Card.Body className="p-4">
                                    <div className="d-flex align-items-start">
                                        {/* Review Image - Photo of the product review */}
                                        <div className="me-3 flex-shrink-0">
                                            {review.image ? (
                                                <img
                                                    src={review.image}
                                                    alt="Review product"
                                                    className="rounded"
                                                    style={{
                                                        width: "60px",
                                                        height: "60px",
                                                        objectFit: "cover",
                                                        border: "1px solid #e0e0e0",
                                                    }}
                                                />
                                            ) : (
                                                <div
                                                    className="bg-light rounded d-flex align-items-center justify-content-center"
                                                    style={{
                                                        width: "60px",
                                                        height: "60px",
                                                        border: "1px solid #e0e0e0",
                                                        fontSize: "12px",
                                                        color: "#6c757d",
                                                    }}
                                                >
                                                    No Image
                                                </div>
                                            )}
                                        </div>

                                        {/* Review Content */}
                                        <div className="flex-grow-1">
                                            {/* User Name, Rating Stars, and Date */}
                                            <div className="d-flex justify-content-between align-items-start mb-2">
                                                <div className="d-flex align-items-center flex-wrap" style={{ minWidth: 0, flex: 1 }}>
                                                    <h6 className="fw-bold mb-0 text-dark me-3" style={{ minWidth: 0 }}>
                                                        {review.user?.name || "Anonymous User"}
                                                    </h6>
                                                    <div className="d-flex align-items-center">{renderStars(review.rating || 0)}</div>
                                                </div>
                                                <small className="text-muted ms-2 flex-shrink-0">{formatDate(review.created_at)}</small>
                                            </div>

                                            {/* Review Comment */}
                                            <p className="text-muted mb-0" style={{ fontSize: "14px", lineHeight: "1.5" }}>
                                                {review.comment || "No comment provided."}
                                            </p>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        ))}
                    </div>

                    {/* Custom Pagination */}
                    {pagination.total_pages > 1 && <CustomPagination currentPage={currentPage} totalPages={pagination.total_pages} onPageChange={setCurrentPage} />}
                </>
            )}
        </div>
    );
};

export default ProductReviews;
