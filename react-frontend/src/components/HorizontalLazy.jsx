// src/components/HorizontalLazy.jsx
import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import ProductCard from "./ProductCard";
import SectionHeader from "./SectionHeader";
import Countdown from "./Countdown";

const HorizontalLazy = ({ title, subTitle, products = [], endTime, showCountdown = false, filter, flashSaleId, categoryId, categoryName, flashSaleDiscount }) => {
    const navigate = useNavigate();

    const handleViewAll = () => {
        const params = new URLSearchParams();

        // Handle different filter types
        if (filter === "flash_sale" || filter === "flash-sale") {
            params.set("filter", "flash_sale");
            if (flashSaleId) {
                params.set("flash_sale_id", flashSaleId);
            }
        } else if (filter && filter !== "") {
            // Convert kebab-case to snake_case for API compatibility
            const apiFilter = filter.replace(/-/g, "_");
            params.set("filter", apiFilter);
        }

        // Add category if specified - this should work for related products
        if (categoryName) {
            params.set("category", categoryName.toLowerCase());
        } else if (categoryId) {
            params.set("category_id", categoryId);
        }

        navigate(`/products?${params.toString()}`);
    };

    // Jika showCountdown true dan endTime null, tampilkan no product
    if (showCountdown && !endTime) {
        return (
            <Container className="my-5">
                <SectionHeader title={title} subTitle={subTitle}>
                    <div className="ms-auto">
                        <Button variant="danger" className="text-white" onClick={() => navigate("/products")}>
                            View Other Products
                        </Button>
                    </div>
                </SectionHeader>
                <div className="text-center py-5">
                    <p className="text-muted">No products on sale</p>
                </div>
            </Container>
        );
    }

    if (!products || products.length === 0) {
        return (
            <Container className="my-5">
                <SectionHeader title={title} subTitle={subTitle}>
                    <div className="ms-auto">
                        <Button variant="danger" className="text-white" onClick={() => navigate("/products")}>
                            View Other Products
                        </Button>
                    </div>
                </SectionHeader>
                <div className="text-center py-5">
                    <p className="text-muted">No products available</p>
                </div>
            </Container>
        );
    }

    return (
        <Container className="my-5">
            {/* subTitle kini di-pass sebagai prop lagi, sesuai permintaan Anda */}
            <SectionHeader title={title} subTitle={subTitle}>
                {/* Children kini hanya berisi countdown dan button */}

                {/* Countdown Component */}
                {showCountdown && endTime && <Countdown endTime={endTime} />}

                {/* Tombol View All didorong ke kanan */}
                <div className="ms-auto">
                    <Button variant="danger" className="text-white" onClick={handleViewAll}>
                        View All
                    </Button>
                </div>
            </SectionHeader>
            <Row className="flex-nowrap overflow-auto g-4">
                {products.map((product) => {
                    const defaultImage = "/product.png"; // gambar default dari folder public
                    const imageUrl = product.product_images && product.product_images.length > 0 ? product.product_images[0].name : defaultImage;

                    return (
                        <Col key={product.id} xs="auto">
                            <ProductCard
                                id={product.id}
                                imageUrl={imageUrl}
                                name={product.name}
                                price={product.discounted_price.toString()}
                                oldPrice={product.price.toString()}
                                reviews={product.total_rating || 0}
                                discount={product.discount.toString()}
                                avg_rating={product.avg_rating}
                                flashSaleDiscount={filter === "flash_sale" ? flashSaleDiscount : null}
                            />
                        </Col>
                    );
                })}
            </Row>
        </Container>
    );
};

export default HorizontalLazy;
