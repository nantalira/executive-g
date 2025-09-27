import React, { useState } from "react";
import { Card, Button, Row, Col } from "react-bootstrap";
import { ChevronLeft, ChevronRight } from "react-bootstrap-icons";

const ProductReviews = () => {
    const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

    // Sample reviews data
    const reviews = [
        {
            id: 1,
            name: "Name | 19-02-2023",
            message: "message",
            rating: 4,
            image: "https://exclusive-api.nantalira.site/storage/products/images/01K1K1VBA4KNQ63JXAF9B1W4ZH.jpg",
        },
        {
            id: 2,
            name: "Free Delivery",
            message: "Enter your postal code for Delivery Availability",
            rating: 5,
            image: "https://exclusive-api.nantalira.site/storage/products/images/01K1K1VBA4KNQ63JXAF9B1W4ZH.jpg",
        },
        {
            id: 3,
            name: "Free Delivery",
            message: "Enter your postal code for Delivery Availability",
            rating: 5,
            image: "https://exclusive-api.nantalira.site/storage/products/images/01K1K1VBA4KNQ63JXAF9B1W4ZH.jpg",
        },
        {
            id: 4,
            name: "Free Delivery",
            message: "Enter your postal code for Delivery Availability",
            rating: 5,
            image: "https://exclusive-api.nantalira.site/storage/products/images/01K1K1VBA4KNQ63JXAF9B1W4ZH.jpg",
        },
        {
            id: 5,
            name: "Free Delivery",
            message: "Enter your postal code for Delivery Availability",
            rating: 5,
            image: "https://exclusive-api.nantalira.site/storage/products/images/01K1K1VBA4KNQ63JXAF9B1W4ZH.jpg",
        },
    ];

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span key={i} className={i <= rating ? "text-warning" : "text-muted"} style={{ fontSize: "14px" }}>
                    ★
                </span>
            );
        }
        return stars;
    };

    const handlePrevious = () => {
        setCurrentReviewIndex(Math.max(0, currentReviewIndex - 1));
    };

    const handleNext = () => {
        setCurrentReviewIndex(Math.min(reviews.length - 1, currentReviewIndex + 1));
    };

    const reviewsPerPage = 3;

    const getVisibleReviews = () => {
        return reviews.slice(currentReviewIndex, currentReviewIndex + reviewsPerPage);
    };

    const totalPages = Math.ceil(reviews.length / reviewsPerPage);
    const currentPage = Math.floor(currentReviewIndex / reviewsPerPage) + 1;

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
                    <h5 className="ms-3 fw-bold text-danger mb-0">Reviews</h5>
                </div>
            </div>

            {/* Reviews Stack */}
            <div className="d-flex flex-column gap-3 mb-4">
                {getVisibleReviews().map((review) => (
                    <Card key={review.id} className="border-1" style={{ borderColor: "#e0e0e0" }}>
                        <Card.Body className="p-3">
                            <div className="d-flex align-items-start">
                                {/* Product Image */}
                                <div
                                    className="bg-light rounded d-flex align-items-center justify-content-center me-3 flex-shrink-0"
                                    style={{
                                        width: "80px",
                                        height: "80px",
                                        padding: "8px",
                                    }}
                                >
                                    <img
                                        src={review.image}
                                        alt="Product"
                                        style={{
                                            maxWidth: "70px",
                                            maxHeight: "70px",
                                            objectFit: "contain",
                                        }}
                                    />
                                </div>

                                {/* Review Content */}
                                <div className="flex-grow-1">
                                    {/* Review Header */}
                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                        <h6 className="fw-semibold mb-0 text-dark">{review.name}</h6>
                                        <div className="d-flex">{renderStars(review.rating)}</div>
                                    </div>

                                    {/* Review Message */}
                                    <p className="text-muted mb-0" style={{ fontSize: "14px", lineHeight: "1.4" }}>
                                        {review.message}
                                    </p>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                ))}
            </div>

            {/* Pagination */}
            <div className="d-flex justify-content-center align-items-center gap-3">
                <Button variant="outline-secondary" size="sm" onClick={handlePrevious} disabled={currentReviewIndex === 0} className="d-flex align-items-center">
                    <ChevronLeft size={16} className="me-1" />
                    Previous
                </Button>

                <span className="text-muted small">
                    Page {currentPage} of {totalPages}
                </span>

                <Button variant="outline-secondary" size="sm" onClick={handleNext} disabled={currentReviewIndex + reviewsPerPage >= reviews.length} className="d-flex align-items-center">
                    Next
                    <ChevronRight size={16} className="ms-1" />
                </Button>
            </div>
        </div>
    );
};

export default ProductReviews;
