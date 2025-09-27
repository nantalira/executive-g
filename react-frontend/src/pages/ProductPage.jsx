import React, { useState, useMemo } from "react";
import { Container, Row, Col, Breadcrumb, Form, InputGroup, Button, Dropdown, Pagination, Card } from "react-bootstrap";
import { Search, Filter, Grid, List, ChevronLeft, ChevronRight } from "react-bootstrap-icons";
import MainLayout from "../layouts/MainLayout";
import ProductGrid from "../components/ProductGrid";
import FilterCard from "../components/FilterCard";
const ProductPage = () => {
    // State management
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All Categories");
    const [priceRange, setPriceRange] = useState({ min: 0, max: 2000 });
    const [sortBy, setSortBy] = useState("name");
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(8);
    const [showFilters, setShowFilters] = useState(true);

    // Sample products data (expanded)
    const allProducts = [
        { id: 1, imageUrl: "https://exclusive-api.nantalira.site/storage/products/images/01K1K1VBA4KNQ63JXAF9B1W4ZH.jpg", name: "The north coat", price: "260", oldPrice: "360", reviews: 65, category: "Fashion" },
        { id: 2, imageUrl: "https://exclusive-api.nantalira.site/storage/products/images/01K1K1VBA4KNQ63JXAF9B1W4ZH.jpg", name: "Gucci duffle bag", price: "960", oldPrice: "1160", reviews: 82, category: "Fashion" },
        { id: 3, imageUrl: "https://exclusive-api.nantalira.site/storage/products/images/01K1K1VBA4KNQ63JXAF9B1W4ZH.jpg", name: "RGB liquid CPU Cooler", price: "160", oldPrice: "170", reviews: 91, category: "Electronics" },
        { id: 4, imageUrl: "https://exclusive-api.nantalira.site/storage/products/images/01K1K1VBA4KNQ63JXAF9B1W4ZH.jpg", name: "Small BookSelf", price: "360", reviews: 45, category: "Furniture" },
        { id: 5, imageUrl: "https://exclusive-api.nantalira.site/storage/products/images/01K1K1VBA4KNQ63JXAF9B1W4ZH.jpg", name: "Gaming Chair", price: "450", oldPrice: "550", reviews: 78, category: "Furniture" },
        { id: 6, imageUrl: "https://exclusive-api.nantalira.site/storage/products/images/01K1K1VBA4KNQ63JXAF9B1W4ZH.jpg", name: "Wireless Headphones", price: "120", oldPrice: "150", reviews: 92, category: "Electronics" },
        { id: 7, imageUrl: "https://exclusive-api.nantalira.site/storage/products/images/01K1K1VBA4KNQ63JXAF9B1W4ZH.jpg", name: "Designer Jacket", price: "180", oldPrice: "220", reviews: 67, category: "Fashion" },
        { id: 8, imageUrl: "https://exclusive-api.nantalira.site/storage/products/images/01K1K1VBA4KNQ63JXAF9B1W4ZH.jpg", name: "Smart Watch", price: "300", reviews: 89, category: "Electronics" },
        { id: 9, imageUrl: "https://exclusive-api.nantalira.site/storage/products/images/01K1K1VBA4KNQ63JXAF9B1W4ZH.jpg", name: "Coffee Table", price: "280", oldPrice: "320", reviews: 56, category: "Furniture" },
        { id: 10, imageUrl: "https://exclusive-api.nantalira.site/storage/products/images/01K1K1VBA4KNQ63JXAF9B1W4ZH.jpg", name: "Running Shoes", price: "95", oldPrice: "120", reviews: 74, category: "Fashion" },
        { id: 11, imageUrl: "https://exclusive-api.nantalira.site/storage/products/images/01K1K1VBA4KNQ63JXAF9B1W4ZH.jpg", name: "Bluetooth Speaker", price: "80", reviews: 85, category: "Electronics" },
        { id: 12, imageUrl: "https://exclusive-api.nantalira.site/storage/products/images/01K1K1VBA4KNQ63JXAF9B1W4ZH.jpg", name: "Office Desk", price: "400", oldPrice: "480", reviews: 63, category: "Furniture" },
    ];

    const categories = ["All Categories", "Fashion", "Electronics", "Furniture"];

    // Filter and sort products
    const filteredProducts = useMemo(() => {
        let filtered = allProducts.filter((product) => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === "All Categories" || product.category === selectedCategory;
            const matchesPrice = parseInt(product.price) >= priceRange.min && parseInt(product.price) <= priceRange.max;
            return matchesSearch && matchesCategory && matchesPrice;
        });

        // Sort products
        filtered.sort((a, b) => {
            switch (sortBy) {
                case "price-low":
                    return parseInt(a.price) - parseInt(b.price);
                case "price-high":
                    return parseInt(b.price) - parseInt(a.price);
                case "reviews":
                    return b.reviews - a.reviews;
                default:
                    return a.name.localeCompare(b.name);
            }
        });

        return filtered;
    }, [searchTerm, selectedCategory, priceRange, sortBy]);

    // Pagination
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <>
            <MainLayout>
                <Container className="my-5 my-md-4">
                    <Row>
                        {/* Desktop Filters Sidebar */}
                        {showFilters && (
                            <Col lg={3} md={4} className="d-none d-md-block mb-4">
                                <div style={{ position: "sticky", top: "120px", zIndex: 100 }}>
                                    <FilterCard
                                        searchTerm={searchTerm}
                                        setSearchTerm={setSearchTerm}
                                        selectedCategory={selectedCategory}
                                        setSelectedCategory={setSelectedCategory}
                                        priceRange={priceRange}
                                        setPriceRange={setPriceRange}
                                        setCurrentPage={setCurrentPage}
                                        setShowFilters={setShowFilters}
                                        categories={categories}
                                    />
                                </div>
                            </Col>
                        )}

                        {/* Products Section */}
                        <Col xs={12} lg={showFilters ? 9 : 12} md={showFilters ? 8 : 12}>
                            {/* Sort Controls and Filter Toggle */}
                            <div
                                style={{
                                    position: "sticky",
                                    top: "120px",
                                    zIndex: 100,
                                }}
                            >
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    {/* Filter Toggle Button */}
                                    <div className="bg-white">
                                        <Button variant="outline-secondary" size="sm" onClick={() => setShowFilters(!showFilters)} className="d-flex align-items-center gap-2">
                                            {showFilters ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
                                            <Filter size={16} />
                                            {showFilters ? "Hide Filters" : "Show Filters"}
                                        </Button>
                                    </div>
                                    <div className="bg-white">
                                        <Dropdown>
                                            <Dropdown.Toggle variant="outline-secondary" size="sm">
                                                <span className=" me-2">Sort by:</span>
                                                {sortBy === "name" && "Name A-Z"}
                                                {sortBy === "price-low" && "Price: Low to High"}
                                                {sortBy === "price-high" && "Price: High to Low"}
                                                {sortBy === "reviews" && "Most Reviews"}
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu>
                                                <Dropdown.Item onClick={() => setSortBy("name")}>Name A-Z</Dropdown.Item>
                                                <Dropdown.Item onClick={() => setSortBy("price-low")}>Price: Low to High</Dropdown.Item>
                                                <Dropdown.Item onClick={() => setSortBy("price-high")}>Price: High to Low</Dropdown.Item>
                                                <Dropdown.Item onClick={() => setSortBy("reviews")}>Most Reviews</Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div>
                                </div>

                                {/* Mobile Filters (sticky below toggle) */}
                                {showFilters && (
                                    <div className="d-block d-md-none">
                                        <FilterCard
                                            searchTerm={searchTerm}
                                            setSearchTerm={setSearchTerm}
                                            selectedCategory={selectedCategory}
                                            setSelectedCategory={setSelectedCategory}
                                            priceRange={priceRange}
                                            setPriceRange={setPriceRange}
                                            setCurrentPage={setCurrentPage}
                                            setShowFilters={setShowFilters}
                                            categories={categories}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Products Grid */}
                            {currentProducts.length > 0 ? (
                                <ProductGrid products={currentProducts} showAllProducts={true} />
                            ) : (
                                <div className="text-center py-5">
                                    <h5 className="text-muted">No products found</h5>
                                    <p className="text-muted">Try adjusting your filters or search terms</p>
                                </div>
                            )}

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="d-flex justify-content-center mt-5">
                                    <Pagination>
                                        <Pagination.Prev disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)} />

                                        {[...Array(totalPages)].map((_, index) => {
                                            const pageNumber = index + 1;
                                            return (
                                                <Pagination.Item key={pageNumber} active={pageNumber === currentPage} onClick={() => handlePageChange(pageNumber)}>
                                                    {pageNumber}
                                                </Pagination.Item>
                                            );
                                        })}

                                        <Pagination.Next disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)} />
                                    </Pagination>
                                </div>
                            )}
                        </Col>
                    </Row>
                </Container>
            </MainLayout>
        </>
    );
};

export default ProductPage;
