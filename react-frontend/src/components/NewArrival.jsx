// src/components/NewArrival.jsx
import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import SectionHeader from "./SectionHeader";

const PromoCard = ({ title, description, image, bgColor, textColor, isLarge, productId, size = "medium" }) => {
    return (
        <Card
            className={`text-${textColor} border-0 h-100 position-relative overflow-hidden`}
            style={{
                backgroundColor: bgColor,
                minHeight: size === "large" ? "500px" : size === "medium" ? "240px" : "120px",
            }}
        >
            <div
                className="position-absolute w-100 h-100"
                style={{
                    backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url(${image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    top: 0,
                    left: 0,
                }}
            />
            <Card.Body className="d-flex flex-column justify-content-end p-4 position-relative">
                <Card.Title className="fw-bold fs-4">{title}</Card.Title>
                <Card.Text>{description}</Card.Text>
                <a href={`/products/${productId}`} className={`text-${textColor} text-decoration-underline fw-bold`}>
                    Shop Now
                </a>
            </Card.Body>
        </Card>
    );
};

const cardStyles = [
    { bgColor: "black", textColor: "white", size: "large" }, // Style untuk card pertama
    { bgColor: "#333", textColor: "white", size: "medium" }, // Style untuk card kedua
    { bgColor: "#ddd", textColor: "white", size: "small" }, // Style untuk card ketiga
    { bgColor: "#ddd", textColor: "white", size: "small" }, // Style untuk card keempat
];

const NewArrival = ({ carousels = [] }) => {
    // Fungsi untuk mendapatkan style berdasarkan index
    const getCardStyle = (index) => {
        return cardStyles[index] || cardStyles[cardStyles.length - 1];
    };

    // Fungsi untuk render card berdasarkan posisinya
    const renderCards = () => {
        if (!carousels.length) {
            return (
                <Col xs={12}>
                    <div className="text-center p-5">No new arrivals available</div>
                </Col>
            );
        }

        return (
            <>
                <Col lg={6}>
                    {/* Kartu Besar */}
                    {carousels[0] && <PromoCard productId={carousels[0].product_id} image={carousels[0].image} title={carousels[0].title} description={carousels[0].description} isLarge={true} {...getCardStyle(0)} />}
                </Col>
                <Col lg={6}>
                    <Row className="h-100">
                        {/* Card Medium */}
                        <Col xs={12} className="mb-2">
                            {carousels[1] && <PromoCard productId={carousels[1].product_id} image={carousels[1].image} title={carousels[1].title} description={carousels[1].description} {...getCardStyle(1)} />}
                        </Col>
                        {/* Card Small Kiri */}
                        <Col sm={6} className="mt-2">
                            {carousels[2] && <PromoCard productId={carousels[2].product_id} image={carousels[2].image} title={carousels[2].title} description={carousels[2].description} {...getCardStyle(2)} />}
                        </Col>
                        {/* Card Small Kanan */}
                        <Col sm={6} className="mt-2">
                            {carousels[3] && <PromoCard productId={carousels[3].product_id} image={carousels[3].image} title={carousels[3].title} description={carousels[3].description} {...getCardStyle(3)} />}
                        </Col>
                    </Row>
                </Col>
            </>
        );
    };

    return (
        <Container className="my-5">
            <SectionHeader title="Featured" subTitle="New Arrivals" />
            <Row className="g-4" style={{ minHeight: "500px" }}>
                {renderCards()}
            </Row>
        </Container>
    );
};

export default NewArrival;
