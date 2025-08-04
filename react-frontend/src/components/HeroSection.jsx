// src/components/HeroSection.jsx
import React from "react";
import { Row, Col, Nav } from "react-bootstrap";
import { ChevronRight } from "react-bootstrap-icons";

const HeroSection = () => {
    return (
        <Row className="mt-4">
            <div className="bg-dark text-white p-5 d-flex flex-column flex-md-row align-items-center justify-content-around" style={{ minHeight: "344px" }}>
                <div className="text-center text-md-start">
                    <p className="fs-5">iPhone 14 Series</p>
                    <h1 className="display-4 fw-bold mb-4">Up to 10% off Voucher</h1>
                    <a href="#" className="text-white text-decoration-underline fw-bold">
                        Shop Now <ChevronRight />
                    </a>
                </div>
                {/* Ganti div ini dengan tag <img> untuk gambar sebenarnya */}
                <div style={{ width: "300px", height: "200px", backgroundColor: "#333", marginTop: "20px" }}>{/* Placeholder untuk gambar iPhone */}</div>
            </div>
        </Row>
    );
};

export default HeroSection;
