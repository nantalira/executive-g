// src/components/HeroSection.jsx
import React from "react";
import { Row, Carousel, Spinner, Alert } from "react-bootstrap";
import { ChevronRight } from "react-bootstrap-icons";

const HeroSection = ({ carousels = [], loading = false, error = null }) => {
    if (loading) {
        return (
            <Row className="mt-4">
                <div className="bg-dark text-white p-5 d-flex align-items-center justify-content-center" style={{ minHeight: "344px" }}>
                    <Spinner animation="border" variant="light" />
                </div>
            </Row>
        );
    }

    if (error) {
        return (
            <Row className="mt-4">
                <Alert variant="danger">Error loading carousel: {error}</Alert>
            </Row>
        );
    }

    if (!carousels.length) {
        return (
            <Row className="mt-4">
                <div className="bg-dark text-white p-5 d-flex flex-column flex-md-row align-items-center justify-content-around" style={{ minHeight: "344px" }}>
                    <div className="text-center text-md-start">
                        <p className="fs-5">No Carousel Available</p>
                        <h1 className="display-4 fw-bold mb-4">Check back later</h1>
                        <a href="#" className="text-white text-decoration-underline fw-bold">
                            Browse Products <ChevronRight />
                        </a>
                    </div>
                </div>
            </Row>
        );
    }

    return (
        <div className="mt-4 overflow-hidden w-100">
            <Carousel slide interval={3000} controls={false} touch={true}>
                {carousels.map((item, index) => (
                    <Carousel.Item key={item.id || index}>
                        <div
                            className="position-relative"
                            style={{
                                height: "344px",
                                background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${item.image})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                            }}
                        >
                            <div className="container h-100">
                                <div className="row h-100 align-items-end pb-3">
                                    <div className="col-12 col-md-6 text-white">
                                        <div className="p-4">
                                            <h2 className="fw-bold fs-4 mb-2">{item.title}</h2>
                                            <p className="mb-4">{item.description}</p>
                                            <a href={`/products/${item.product_id}`} className="text-white text-decoration-underline fw-bold">
                                                Shop Now <ChevronRight />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Carousel.Item>
                ))}
            </Carousel>
        </div>
    );
};

export default HeroSection;
