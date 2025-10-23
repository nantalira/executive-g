// src/components/CategoryCard.jsx
import React, { useState } from "react";
import { Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import * as Icons from "react-bootstrap-icons";

const CategoryCard = ({ icon, name }) => {
    const [isHovered, setIsHovered] = useState(false);
    const navigate = useNavigate();

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    const handleClick = () => {
        // Navigate to products page with category filter (lowercase for URL consistency)
        navigate(`/products?category=${encodeURIComponent(name.toLowerCase())}`);
    };

    // Determine current state styling
    const cardClasses = `text-center p-4 h-100 d-flex flex-column justify-content-center align-items-center border-2 ${isHovered ? "bg-danger text-white border-danger" : "bg-light text-dark border-secondary-subtle"}`;

    return (
        <Card
            className={cardClasses}
            style={{
                cursor: "pointer",
                transition: "all 0.3s ease",
                userSelect: "none",
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleClick();
                }
            }}
        >
            <div className="fs-1 mb-3" style={{ transition: "color 0.3s ease" }}>
                {icon && Icons[icon] ? React.createElement(Icons[icon]) : <Icons.Tag />}
            </div>
            <Card.Text className="fw-medium mb-0" style={{ transition: "color 0.3s ease" }}>
                {name}
            </Card.Text>
        </Card>
    );
};

export default CategoryCard;
