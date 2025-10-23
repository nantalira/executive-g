// src/components/StarRating.jsx
import React from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const StarRating = ({ rating }) => {
    const stars = [];
    const totalStars = 5;

    for (let i = 1; i <= totalStars; i++) {
        if (i <= rating) {
            // Bintang penuh
            stars.push(<FaStar key={i} color="#FFAD33" />);
        } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
            // Bintang setengah
            stars.push(<FaStarHalfAlt key={i} color="#FFAD33" />);
        } else {
            // Bintang kosong
            stars.push(<FaRegStar key={i} color="#FFAD33" />);
        }
    }

    return <>{stars}</>;
};

export default StarRating;
