// src/components/HorizontalLazy.jsx
import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import ProductCard from "./ProductCard";
import SectionHeader from "./SectionHeader";

// Data produk dummy
const flashProducts = [
    { id: 1, imageUrl: "https://exclusive-api.nantalira.site/storage/products/images/01K1K1VBA4KNQ63JXAF9B1W4ZH.jpg", name: "HAVIT HV-G92 Gamepad", price: "120", oldPrice: "160", reviews: 88 },
    { id: 2, imageUrl: "https://exclusive-api.nantalira.site/storage/products/images/01K1K1VBA4KNQ63JXAF9B1W4ZH.jpg", name: "AK-900 Wired Keyboard", price: "960", oldPrice: "1160", reviews: 75 },
    { id: 3, imageUrl: "https://exclusive-api.nantalira.site/storage/products/images/01K1K1VBA4KNQ63JXAF9B1W4ZH.jpg", name: "IPS LCD Gaming Monitor", price: "370", oldPrice: "400", reviews: 99 },
    { id: 4, imageUrl: "https://exclusive-api.nantalira.site/storage/products/images/01K1K1VBA4KNQ63JXAF9B1W4ZH.jpg", name: "S-Series Comfort Chair", price: "375", oldPrice: "400", reviews: 102 },
    { id: 5, imageUrl: "https://exclusive-api.nantalira.site/storage/products/images/01K1K1VBA4KNQ63JXAF9B1W4ZH.jpg", name: "S-Series Comfort Chair", price: "375", oldPrice: "400", reviews: 102 },
];

const HorizontalLazy = ({ title, subTitle, children }) => {
    return (
        <Container className="my-5">
            <SectionHeader title={title} subTitle={subTitle}>
                {children}
                <div className="ms-auto">
                    <Button variant="danger" className="text-white">
                        View All
                    </Button>
                </div>
            </SectionHeader>
            <Row className="flex-nowrap overflow-auto g-4">
                {flashProducts.map((product) => (
                    <Col key={product.id} xs="auto">
                        <ProductCard imageUrl={product.imageUrl} name={product.name} price={product.price} oldPrice={product.oldPrice} reviews={product.reviews} />
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default HorizontalLazy;
