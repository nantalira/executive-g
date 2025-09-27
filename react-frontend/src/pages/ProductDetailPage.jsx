import React, { useState, useEffect } from "react";
import MainLayout from "../layouts/MainLayout";
import { Container, Row, Col, Card, Button, Form, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Heart, Truck } from "react-bootstrap-icons";
import HorizontalLazy from "../components/HorizontalLazy";
import ProductReviews from "../components/ProductReviews";

const ProductDetailPage = () => {
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedColor, setSelectedColor] = useState("red");
    const [selectedSize, setSelectedSize] = useState("M");
    const [quantity, setQuantity] = useState(2);

    // Sample product data
    const product = {
        id: 1,
        name: "Havic HV G-92 Gamepad",
        price: 192.0,
        originalPrice: 400.0,
        rating: 4,
        reviewCount: 150,
        inStock: true,
        description: "PlayStation 5 Controller Skin High quality vinyl with air channel adhesive for easy bubble free install & mess free removal Pressure sensitive.",
        images: [
            "https://exclusive-api.nantalira.site/storage/products/images/01K1K1VBA4KNQ63JXAF9B1W4ZH.jpg",
            "https://exclusive-api.nantalira.site/storage/products/images/01K1K1VBA4KNQ63JXAF9B1W4ZH.jpg",
            "https://exclusive-api.nantalira.site/storage/products/images/01K1K1VBA4KNQ63JXAF9B1W4ZH.jpg",
            "https://exclusive-api.nantalira.site/storage/products/images/01K1K1VBA4KNQ63JXAF9B1W4ZH.jpg",
        ],
        colors: [
            { name: "red", color: "#DB4444" },
            { name: "blue", color: "#4169E1" },
        ],
        sizes: ["XS", "S", "M", "L", "XL"],
    };

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span key={i} className={i <= rating ? "text-warning" : "text-muted"}>
                    ★
                </span>
            );
        }
        return stars;
    };

    const handleAddToCart = () => {
        // TODO: Implement add to cart functionality
        alert(`Added ${quantity} ${product.name} to cart`);
    };

    const handleBuyNow = () => {
        // TODO: Implement buy now functionality
        alert(`Buy now ${quantity} ${product.name}`);
    };

    return (
        <MainLayout>
            <Container className="py-4">
                {/* Breadcrumb */}
                <Row className="mb-4">
                    <Col>
                        <Link to="/" className="text-decoration-none">
                            <span className="text-muted">Products</span>
                        </Link>
                        <span className="mx-2 text-muted">/</span>
                        <span className="text-dark">{product.name}</span>
                    </Col>
                </Row>

                {/* Product Detail */}
                <Row className="mb-5">
                    {/* Product Images */}
                    <Col lg={6}>
                        <Row>
                            {/* Thumbnail Images */}
                            <Col md={2} className="mb-3 mb-md-0">
                                <div className="d-flex flex-column gap-2">
                                    {product.images.map((image, index) => (
                                        <div
                                            key={index}
                                            className={`bg-light p-2 rounded cursor-pointer ${selectedImage === index ? "border border-danger" : "border"}`}
                                            style={{ cursor: "pointer", height: "80px" }}
                                            onClick={() => setSelectedImage(index)}
                                        >
                                            <img src={image} alt={`Product ${index + 1}`} className="img-fluid h-100 w-100" style={{ objectFit: "contain" }} />
                                        </div>
                                    ))}
                                </div>
                            </Col>

                            {/* Main Image */}
                            <Col md={10}>
                                <div className="bg-light p-4 rounded" style={{ height: "400px" }}>
                                    <img src={product.images[selectedImage]} alt={product.name} className="img-fluid h-100 w-100" style={{ objectFit: "contain" }} />
                                </div>
                            </Col>
                        </Row>
                    </Col>

                    {/* Product Information */}
                    <Col lg={6}>
                        <div className="ps-lg-4">
                            {/* Product Title */}
                            <h2 className="fw-bold mb-2">{product.name}</h2>

                            {/* Rating and Reviews */}
                            <div className="d-flex align-items-center mb-3">
                                <div className="me-2">{renderStars(product.rating)}</div>
                                <span className="text-muted small">({product.reviewCount} Reviews)</span>
                                <span className="mx-2 text-muted">|</span>
                                <span className="text-success small">In Stock</span>
                            </div>

                            {/* Price */}
                            <div className="mb-3">
                                <span className="fs-4 fw-bold">${product.price.toFixed(2)}</span>
                            </div>

                            {/* Description */}
                            <p className="text-muted mb-4">{product.description}</p>

                            <hr />

                            {/* Colours */}
                            <div className="mb-4">
                                <div className="d-flex align-items-center mb-3">
                                    <span className="me-3">Colours:</span>
                                    <div className="d-flex gap-2">
                                        {product.colors.map((color) => (
                                            <div
                                                key={color.name}
                                                className={`rounded-circle border-2 ${selectedColor === color.name ? "border-dark" : "border-light"}`}
                                                style={{
                                                    width: "25px",
                                                    height: "25px",
                                                    backgroundColor: color.color,
                                                    cursor: "pointer",
                                                }}
                                                onClick={() => setSelectedColor(color.name)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Size */}
                            <div className="mb-4">
                                <div className="d-flex align-items-center mb-3">
                                    <span className="me-3">Size:</span>
                                    <div className="d-flex gap-2">
                                        {product.sizes.map((size) => (
                                            <Button key={size} variant={selectedSize === size ? "danger" : "outline-secondary"} size="sm" className="px-3" onClick={() => setSelectedSize(size)}>
                                                {size}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Quantity and Actions */}
                            <div className="d-flex align-items-center gap-3 mb-4">
                                <div className="d-flex align-items-center border rounded">
                                    <Button variant="light" size="sm" className="border-0" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                                        -
                                    </Button>
                                    <span className="px-3 fw-medium">{quantity}</span>
                                    <Button variant="light" size="sm" className="border-0" onClick={() => setQuantity(quantity + 1)}>
                                        +
                                    </Button>
                                </div>

                                <Button variant="danger" className="px-4 fw-semibold" onClick={handleBuyNow}>
                                    Buy Now
                                </Button>

                                <Button variant="outline-secondary" size="sm" className="p-2">
                                    <Heart size={20} />
                                </Button>
                            </div>

                            {/* Delivery Info */}
                            <Card className="border">
                                <Card.Body className="p-3">
                                    <div className="d-flex align-items-center mb-3">
                                        <Truck size={24} className="me-3" />
                                        <div>
                                            <div className="fw-medium">Free Delivery</div>
                                            <small className="text-muted">Enter your postal code for Delivery Availability</small>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </div>
                    </Col>
                </Row>

                {/* Product Reviews */}
                <ProductReviews />

                {/* Related Products */}
                <HorizontalLazy title="Related Item" subTitle="" />
            </Container>
        </MainLayout>
    );
};

export default ProductDetailPage;
