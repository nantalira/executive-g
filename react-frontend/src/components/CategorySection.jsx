// src/components/CategorySection.jsx
import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Phone, Laptop, Watch, Camera, Headset, Joystick } from "react-bootstrap-icons";
import SectionHeader from "./SectionHeader";
import CategoryCard from "./CategoryCard";

const categories = [
    { id: 1, name: "Phones", icon: <Phone /> },
    { id: 2, name: "Computers", icon: <Laptop /> },
    { id: 3, name: "SmartWatch", icon: <Watch /> },
    { id: 4, name: "Camera", icon: <Camera /> },
    { id: 5, name: "HeadPhones", icon: <Headset /> },
    { id: 6, name: "Gaming", icon: <Joystick /> },
];

const CategorySection = () => {
    return (
        <Container className="my-5 py-5 border-bottom">
            <SectionHeader title="Categories" subTitle="Explore Our Categories" buttonText="View All" />
            <Row xs={2} md={3} lg={6} className="g-4">
                {categories.map((category) => (
                    <Col key={category.id}>
                        <CategoryCard name={category.name} icon={category.icon} />
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default CategorySection;
