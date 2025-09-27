// src/components/ProductGrid.jsx
import React from "react";
import { Row, Col } from "react-bootstrap";
import ProductCard from "./ProductCard";

const ProductGrid = ({ products, showAllProducts = false, maxProducts = 8 }) => {
    // Limit products if showAllProducts is false
    const displayProducts = showAllProducts ? products : products.slice(0, maxProducts);

    return (
        <Row className="d-flex align-items-center justify-content-between">
            {displayProducts.map((product) => (
                <Col key={product.id} xs="auto" className="mb-1 mx-auto">
                    <ProductCard imageUrl={product.imageUrl} name={product.name} price={product.price} oldPrice={product.oldPrice} reviews={product.reviews} />
                </Col>
            ))}
        </Row>
    );
};

export default ProductGrid;
