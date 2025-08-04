// src/components/VerticalLazy.jsx
import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import ProductCard from "./ProductCard";
import SectionHeader from "./SectionHeader";

// Data produk dummy yang berbeda
const bestSellingProducts = [
    { id: 1, imageUrl: "https://exclusive-api.nantalira.site/storage/products/images/01K1K1VBA4KNQ63JXAF9B1W4ZH.jpg", name: "The north coat", price: "260", oldPrice: "360", reviews: 65 },
    { id: 2, imageUrl: "https://exclusive-api.nantalira.site/storage/products/images/01K1K1VBA4KNQ63JXAF9B1W4ZH.jpg", name: "Gucci duffle bag", price: "960", oldPrice: "1160", reviews: 82 },
    { id: 3, imageUrl: "https://exclusive-api.nantalira.site/storage/products/images/01K1K1VBA4KNQ63JXAF9B1W4ZH.jpg", name: "RGB liquid CPU Cooler", price: "160", oldPrice: "170", reviews: 91 },
    { id: 4, imageUrl: "https://exclusive-api.nantalira.site/storage/products/images/01K1K1VBA4KNQ63JXAF9B1W4ZH.jpg", name: "Small BookSelf", price: "360", reviews: 45 },
    { id: 5, imageUrl: "https://exclusive-api.nantalira.site/storage/products/images/01K1K1VBA4KNQ63JXAF9B1W4ZH.jpg", name: "The north coat", price: "260", oldPrice: "360", reviews: 65 },
    { id: 6, imageUrl: "https://exclusive-api.nantalira.site/storage/products/images/01K1K1VBA4KNQ63JXAF9B1W4ZH.jpg", name: "Gucci duffle bag", price: "960", oldPrice: "1160", reviews: 82 },
    { id: 7, imageUrl: "https://exclusive-api.nantalira.site/storage/products/images/01K1K1VBA4KNQ63JXAF9B1W4ZH.jpg", name: "RGB liquid CPU Cooler", price: "160", oldPrice: "170", reviews: 91 },
    { id: 8, imageUrl: "https://exclusive-api.nantalira.site/storage/products/images/01K1K1VBA4KNQ63JXAF9B1W4ZH.jpg", name: "Small BookSelf", price: "360", reviews: 45 },
];

const VerticalLazy = () => {
    return (
        <Container className="my-5">
            <SectionHeader title="This Month" subTitle="Explore Our Products" />
            <Row className="d-flex align-items-center justify-content-between">
                {bestSellingProducts.map((product) => (
                    <Col key={product.id} xs="auto" className="mb-1 mx-auto">
                        <ProductCard imageUrl={product.imageUrl} name={product.name} price={product.price} oldPrice={product.oldPrice} reviews={product.reviews} />
                    </Col>
                ))}
            </Row>
            <div className="d-flex justify-content-center mt-4">
                <Button variant="danger" className="text-white btn-lg">
                    View All
                </Button>
            </div>
        </Container>
    );
};

export default VerticalLazy;
