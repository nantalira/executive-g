// src/pages/HomePage.jsx
import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import MainLayout from "../layouts/MainLayout";
import HeroSection from "../components/HeroSection";
import HorizontalLazy from "../components/HorizontalLazy";
import CategorySection from "../components/CategorySection";
import NewArrival from "../components/NewArrival";
import Features from "../components/Features";
import VerticalLazy from "../components/VerticalLazy";
import CarouselService from "../services/CarouselService";
import ProductService from "../services/productService";
import { useApiErrorHandler } from "../hooks/useApiErrorHandler";
import saleService from "../services/saleService";
import LoadingOverlay from "../components/LoadingOverlay";

const HomePage = () => {
    const [heroCarousels, setHeroCarousels] = useState([]);
    const [newArrivalCarousels, setNewArrivalCarousels] = useState([]);
    const [flashSale, setFlashSale] = useState([]);
    const [bestSellerProducts, setBestSellerProducts] = useState([]);
    const [productSale, setProductSale] = useState([]);
    const [regularProducts, setRegularProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { handleError } = useApiErrorHandler();
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            setLoading(true);
            // Fetch carousels and products in parallel
            const [heroResponse, newArrivalResponse, bestSellerResponse, regularProductsResponse, flashSaleResponse] = await Promise.all([
                CarouselService.getCarousels({ newArrival: false, items_per_page: 6 }),
                CarouselService.getCarousels({ newArrival: true, items_per_page: 4 }),
                ProductService.getProducts({ filter: "best_selling", items_per_page: 5 }),
                ProductService.getProducts({ items_per_page: 8 }),
                saleService.getActiveFlashSaleWithProducts({ items_per_page: 5 }),
            ]);

            setHeroCarousels(heroResponse.data.data || []);
            setNewArrivalCarousels(newArrivalResponse.data.data || []);
            setBestSellerProducts(bestSellerResponse.data.data || []);
            setRegularProducts(regularProductsResponse.data.data || []);

            // Handle new flash sale response structure
            const flashSaleData = flashSaleResponse.data.data;
            setFlashSale(flashSaleData.flash_sale ? [flashSaleData.flash_sale] : []);
            setProductSale(flashSaleData.products.data || []);
            // For now, use best sellers for flash sale products display
            // You can change this to use flashSaleData.products.data if you want actual flash sale products
        } catch (err) {
            const errorMessage = err.message || "Failed to fetch data";
            setError(errorMessage);
            handleError(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <MainLayout>
                <main>
                    <Container>
                        <HeroSection carousels={heroCarousels} loading={loading} error={error} />
                    </Container>

                    <HorizontalLazy
                        title="Today's"
                        subTitle="Flash Sales"
                        products={productSale}
                        showCountdown={true}
                        endTime={flashSale[0]?.end_date || null}
                        filter="flash_sale"
                        flashSaleId={flashSale[0]?.id}
                        flashSaleDiscount={flashSale[0]?.sale_discount}
                    />
                    <CategorySection />
                    <HorizontalLazy title="Best Sellers" subTitle="Our Most Popular Products" products={bestSellerProducts} filter="best_selling" />
                    <NewArrival carousels={newArrivalCarousels} />
                    <VerticalLazy products={regularProducts} />
                    <Features />

                    {/* Explore Our Products bisa ditambahkan di sini dengan pola yang sama seperti BestSellers */}
                </main>
            </MainLayout>
            <LoadingOverlay show={loading} message="Loading HomePage" subMessage="Please wait while we fetch your data..." />
        </>
    );
};

export default HomePage;
