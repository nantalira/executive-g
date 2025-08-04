// src/pages/HomePage.jsx
import React from "react";
import { Container } from "react-bootstrap";
import Header from "../layouts/Header";
import Footer from "../layouts/Footer";
import HeroSection from "../components/HeroSection";
import HorizontalLazy from "../components/HorizontalLazy";
import CategorySection from "../components/CategorySection";
import NewArrival from "../components/NewArrival";
import Features from "../components/Features";
import VerticalLazy from "../components/VerticalLazy";

const HomePage = () => {
    return (
        <>
            <Header />
            <main style={{ paddingTop: "130px" }}>
                <Container>
                    <HeroSection />
                </Container>

                <HorizontalLazy title="Today's Flash Sales" subTitle="Limited Time Offers" />
                <CategorySection />
                <HorizontalLazy title="New Arrivals" subTitle="Best Selling Products" />
                <NewArrival />
                <VerticalLazy />
                <Features />

                {/* Explore Our Products bisa ditambahkan di sini dengan pola yang sama seperti BestSellers */}
            </main>
            <Footer />
        </>
    );
};

export default HomePage;
