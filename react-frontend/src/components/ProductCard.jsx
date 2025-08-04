import React from "react";
import { Card } from "react-bootstrap"; // Mengimpor komponen Card

const ProductCard = ({ imageUrl, name, price, oldPrice, reviews }) => {
    return (
        // Menggunakan komponen Card sebagai pembungkus utama
        <Card style={{ width: "18rem", border: "none" }}>
            {/* Bagian untuk gambar produk dengan background abu-abu muda */}
            <div className="bg-light d-flex justify-content-center align-items-center" style={{ height: "250px" }}>
                <Card.Img variant="top" src={imageUrl} style={{ maxWidth: "70%", maxHeight: "70%", objectFit: "contain" }} />
            </div>

            {/* Badan kartu untuk menampilkan informasi teks */}
            <Card.Body className="px-0 pt-3">
                <Card.Title as="h3" className="fs-6 fw-bold">
                    {name}
                </Card.Title>
                <Card.Text as="div">
                    <span className="text-danger me-2">${price}</span>
                    {oldPrice && <span className="text-muted text-decoration-line-through">${oldPrice}</span>}
                </Card.Text>
                <Card.Text as="div" className="text-muted">
                    <span>({reviews} Reviews)</span>
                </Card.Text>
            </Card.Body>
        </Card>
    );
};

export default ProductCard;
