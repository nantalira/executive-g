// src/components/ProductCard.jsx
import React from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom"; // <-- 1. Impor Link
import { formatPrice } from "../utils/formatters";
import StarRating from "./StarRating";

// <-- 2. Tambahkan 'id' sebagai prop
const ProductCard = ({ id, imageUrl, name, price, oldPrice, reviews, discount, avg_rating, flashSaleDiscount }) => {
    // Calculate stackable discount prices
    const calculateStackablePrice = () => {
        let finalPrice = parseFloat(oldPrice || price);
        let afterProductDiscount = finalPrice;

        // Apply product discount first (if any)
        if (discount && discount !== "0.00") {
            afterProductDiscount = finalPrice * (1 - parseFloat(discount) / 100);
        }

        // Apply flash sale discount on the already discounted price (stackable)
        let afterFlashSaleDiscount = afterProductDiscount;
        if (flashSaleDiscount && flashSaleDiscount !== "0.00") {
            afterFlashSaleDiscount = afterProductDiscount * (1 - parseFloat(flashSaleDiscount) / 100);
        }

        return {
            originalPrice: finalPrice,
            afterProductDiscount: afterProductDiscount,
            finalPrice: afterFlashSaleDiscount,
            // totalDiscountPercentage: Math.round(((finalPrice - afterFlashSaleDiscount) / finalPrice) * 100),
        };
    };

    const priceInfo = calculateStackablePrice();

    return (
        // 3. Bungkus semuanya dengan komponen Link
        <Link to={`/products/${id}`} style={{ textDecoration: "none", color: "inherit" }}>
            <Card style={{ width: "18rem", border: "none" }}>
                {/* Bagian gambar produk */}
                <div className="bg-light d-flex justify-content-center align-items-center position-relative" style={{ height: "250px" }}>
                    {/* Product discount badge */}
                    {discount !== "0.00" && (
                        <div
                            className="position-absolute top-0 start-0 bg-danger text-white ms-3 px-2 py-1 rounded"
                            style={{
                                fontSize: "0.75rem",
                                fontWeight: "bold",
                                zIndex: 1,
                                marginTop: "8px",
                            }}
                        >
                            -{Math.round(discount)}%
                        </div>
                    )}

                    {/* Flash sale discount badge */}
                    {flashSaleDiscount && flashSaleDiscount !== "0.00" && (
                        <div
                            className="position-absolute top-0 end-0 bg-warning text-dark me-3 px-2 py-1 rounded"
                            style={{
                                fontSize: "0.75rem",
                                fontWeight: "bold",
                                zIndex: 1,
                                marginTop: "8px",
                            }}
                        >
                            Flash -{Math.round(flashSaleDiscount)}%
                        </div>
                    )}

                    <Card.Img variant="top" src={imageUrl} style={{ maxWidth: "70%", maxHeight: "70%", objectFit: "contain" }} />
                </div>

                {/* Badan kartu */}
                <Card.Body className="px-0 pt-3">
                    <Card.Title as="h3" className="fs-6 fw-bold">
                        {name}
                    </Card.Title>

                    {/* Harga produk */}
                    <Card.Text as="div" className="mb-2">
                        <span className="text-danger me-2 fw-bold">{formatPrice(priceInfo.finalPrice.toString())}</span>
                        {(discount !== "0.00" || (flashSaleDiscount && flashSaleDiscount !== "0.00")) && <span className="text-muted text-decoration-line-through">{formatPrice(priceInfo.originalPrice.toString())}</span>}
                        {/* {discount !== "0.00" && flashSaleDiscount && flashSaleDiscount !== "0.00" && (
                            <div className="mt-1">
                                <small className="text-success">Total Save: {priceInfo.totalDiscountPercentage}%</small>
                            </div>
                        )} */}
                    </Card.Text>

                    {/* Rating bintang */}
                    <div className="d-flex align-items-center">
                        <StarRating rating={avg_rating} />
                        <span className="text-muted ms-2">({reviews})</span>
                    </div>
                </Card.Body>
            </Card>
        </Link>
    );
};

export default ProductCard;
