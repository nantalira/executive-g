// src/components/VerticalLazy.jsx
import React from "react";
import { Container, Button } from "react-bootstrap";
import ProductGrid from "./ProductGrid";
import SectionHeader from "./SectionHeader";

// Data produk dummy yang berbeda
const bestSellingProducts = [
    { id: 1, imageUrl: "https://exclusive-api.nantalira.site/storage/products/images/01K1K1VBA4KNQ63JXAF9B1W4ZH.jpg", name: "The north coat", price: "260", oldPrice: "360", reviews: 65 },
    { id: 2, imageUrl: "https://exclusive-api.nantalira.site/storage/products/images/01K1K1VBA4KNQ63JXAF9B1W4ZH.jpg", name: "Gucci duffle bag", price: "960", oldPrice: "1160", reviews: 82 },
    { id: 3, imageUrl: "https://exclusive-api.nantalira.site/storage/products/images/01K1K1VBA4KNQ63JXAF9B1W4ZH.jpg", name: "RGB liquid CPU Cooler", price: "160", oldPrice: "170", reviews: 91 },
    { id: 4, imageUrl: "https://exclusive-api.nantalira.site/storage/products/images/01K1K1VBA4KNQ63JXAF9B1W4ZH.jpg", name: "Small BookSelf", price: "360", reviews: 45 },
    { id: 5, imageUrl: "https://exclusive-api.nantalira.site/storage/products/images/01K1K1VBA4KNQ63JXAF9B1W4ZH.jpg", name: "The north coat", price: "260", oldPrice: "360", reviews: 65 },
    { id: 6, imageUrl: "https://exclusive-api.nantalira.site/storage/products/images/01K1K1VBA4KNQ63JXAF9B1W4ZH.jpg", name: "Gucci duffle bag", price: "960", oldPrice: "1160", reviews: 82 },
    { id: 7, imageUrl: "https://exclusive-api.nantalira.site/storage/products/images/01K1K1VBA4KNQ63JXAF9B1W4ZH.jpg", name: "RGB liquid CPU Cooler", price: "160", oldPrice: "170", reviews: 91 },
    { id: 8, imageUrl: "https://exclusive-api.nantalira.site/storage/products/images/01K1K1VBA4KNQ63JXAF9B1W4ZH.jpg", name: "Small BookSelf", price: "360", reviews: 45 },
];

const VerticalLazy = () => {
    return (
        <Container className="my-5">
            <SectionHeader title="This Month" subTitle="Explore Our Products" />
            <ProductGrid products={bestSellingProducts} maxProducts={8} />
            <div className="d-flex justify-content-center mt-4">
                <Button variant="danger" className="text-white btn-lg">
                    View All
                </Button>
            </div>
        </Container>
    );
};

export default VerticalLazy;
