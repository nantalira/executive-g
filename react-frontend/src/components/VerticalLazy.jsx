// src/components/VerticalLazy.jsx
import React, { useMemo } from "react";
import { Container, Button } from "react-bootstrap";
import ProductGrid from "./ProductGrid";
import SectionHeader from "./SectionHeader";
import { Link } from "react-router-dom";

const VerticalLazy = ({ products = [] }) => {
    const processedProducts = useMemo(() => {
        // Mapping ini sekarang hanya berjalan saat allProducts berubah
        return products.map((product) => {
            const defaultImage = "/product.png";
            const imageUrl = product.product_images?.[0]?.name || defaultImage;

            return {
                id: product.id,
                imageUrl: imageUrl,
                name: product.name,
                price: product.discounted_price?.toString(),
                oldPrice: product.price?.toString(),
                reviews: product.total_rating || 0,
                discount: product.discount?.toString(),
                avg_rating: product.avg_rating,
            };
        });
    }, [products]);
    return (
        <Container className="my-5">
            <SectionHeader title="This Month" subTitle="Explore Our Products" />
            <ProductGrid products={processedProducts} maxProducts={8} />
            <div className="d-flex justify-content-center mt-4">
                <Link to={`/products`}>
                    <Button variant="danger" className="text-white btn-lg">
                        View All
                    </Button>
                </Link>
            </div>
        </Container>
    );
};

export default VerticalLazy;
