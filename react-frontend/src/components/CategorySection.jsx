// src/components/CategorySection.jsx
import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import SectionHeader from "./SectionHeader";
import CategoryCard from "./CategoryCard";
import { useCategories } from "../contexts/CategoryContext";

const CategorySection = () => {
    const { categories: allCategories, loading } = useCategories();
    const categories = allCategories.slice(0, 6); // Ambil 6 categories pertama

    if (loading) {
        return (
            <Container className="my-5 py-5 border-bottom">
                <SectionHeader title="Categories" subTitle="Explore Our Categories" buttonText="View All" />
                <div className="text-center py-5">
                    <div className="spinner-border text-danger" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </Container>
        );
    }

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
