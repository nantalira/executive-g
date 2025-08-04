// src/components/NewArrival.jsx
import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import SectionHeader from "./SectionHeader";

const PromoCard = ({ title, description, image, bgColor, textColor, isLarge }) => {
    return (
        <Card className={`text-${textColor} border-0 h-100`} style={{ backgroundColor: bgColor }}>
            <Card.Body className="d-flex flex-column justify-content-end p-4">
                <Card.Title className="fw-bold fs-4">{title}</Card.Title>
                <Card.Text>{description}</Card.Text>
                <a href="#" className={`text-${textColor} text-decoration-underline`}>
                    Shop Now
                </a>
            </Card.Body>
        </Card>
    );
};

const NewArrival = () => {
    return (
        <Container className="my-5">
            <SectionHeader title="Featured" subTitle="New Arrivals" />
            <Row className="g-4" style={{ minHeight: "500px" }}>
                <Col lg={6}>
                    {/* Kartu Besar (PS5) */}
                    <PromoCard title="PlayStation 5" description="Black and White version of the PS5 coming out on sale." bgColor="black" textColor="white" isLarge={true} />
                </Col>
                <Col lg={6}>
                    <Row className=" h-100">
                        <Col xs={12} className="mb-2">
                            {/* Kartu Atas (Women's Collections) */}
                            <PromoCard title="Women's Collections" description="Featured woman collections that give you another vibe." bgColor="#333" textColor="white" />
                        </Col>
                        <Col sm={6} className="mt-2">
                            {/* Kartu Kiri Bawah (Speakers) */}
                            <PromoCard title="Speakers" description="Amazon wireless speakers." bgColor="#ddd" textColor="black" />
                        </Col>
                        <Col sm={6} className="mt-2">
                            {/* Kartu Kanan Bawah (Perfume) */}
                            <PromoCard title="Perfume" description="GUCCI INTENSE OUD EDP" bgColor="#ddd" textColor="black" />
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    );
};

export default NewArrival;
