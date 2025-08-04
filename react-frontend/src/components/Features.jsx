// src/components/Features.jsx
import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Truck, Headset, ShieldCheck } from "react-bootstrap-icons";

const featureData = [
    { icon: <Truck size={50} />, title: "FREE AND FAST DELIVERY", text: "Free delivery for all orders over $140" },
    { icon: <Headset size={50} />, title: "24/7 CUSTOMER SERVICE", text: "Friendly 24/7 customer support" },
    { icon: <ShieldCheck size={50} />, title: "MONEY BACK GUARANTEE", text: "We reurn money within 30 days" },
];

const Features = () => {
    return (
        <Container className="my-5 py-5">
            <Row className="text-center">
                {featureData.map((feature) => (
                    <Col lg={4} key={feature.title}>
                        <div className="mb-3">{feature.icon}</div>
                        <h5 className="fw-bold">{feature.title}</h5>
                        <p>{feature.text}</p>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default Features;
