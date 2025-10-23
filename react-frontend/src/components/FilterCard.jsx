import React, { useState, useEffect } from "react";
import { Card, Form, InputGroup, Button, Row, Col } from "react-bootstrap";
import { Search, Filter, ChevronLeft } from "react-bootstrap-icons";
import SaleService from "../services/SaleService";

const FilterCard = ({ selectedCategory, setSelectedCategory, priceRange, setPriceRange, setCurrentPage, setShowFilters, categories, selectedSort, setSelectedSort, selectedFlashSale, setSelectedFlashSale }) => {
    const [flashSalesSchedule, setFlashSalesSchedule] = useState({ active: [], upcoming: [] });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchFlashSalesSchedule();
    }, []);

    const fetchFlashSalesSchedule = async () => {
        try {
            setLoading(true);
            const saleService = new SaleService();
            const response = await saleService.getFlashSalesSchedule();
            setFlashSalesSchedule(response.data.data);
        } catch (error) {
            console.error("Failed to fetch flash sales schedule:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSortChange = (e) => {
        setSelectedSort(e.target.value);
        // Clear flash sale when regular sort is selected
        if (e.target.value && e.target.value !== "") {
            setSelectedFlashSale("");
        }
        setCurrentPage(1);
    };

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
        setCurrentPage(1);
    };

    const handleFlashSaleChange = (e) => {
        setSelectedFlashSale(e.target.value);
        // Clear regular sort when flash sale is selected
        if (e.target.value && e.target.value !== "") {
            setSelectedSort("");
        }
        setCurrentPage(1);
    };

    return (
        <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-bottom">
                <div className="d-flex justify-content-between align-items-center">
                    <h6 className="mb-0 fw-bold">
                        <Filter className="me-2" />
                        Filters
                    </h6>
                    <Button variant="link" size="sm" className="p-0 text-muted" onClick={() => setShowFilters(false)}>
                        <ChevronLeft size={18} />
                    </Button>
                </div>
            </Card.Header>
            <Card.Body>
                {/* Category Filter */}
                <div className="mb-4">
                    <label className="form-label fw-semibold">Category</label>
                    <Form.Select value={selectedCategory} onChange={handleCategoryChange}>
                        {categories.map((category) => (
                            <option key={category.id} value={category.name}>
                                {category.name}
                            </option>
                        ))}
                    </Form.Select>
                </div>

                {/* Sorting Filter */}
                <div className="mb-4">
                    <label className="form-label fw-semibold">Sort by:</label>
                    <Form.Select value={selectedSort} onChange={handleSortChange}>
                        <option value="">Default (Name A-Z)</option>
                        <option value="best_selling">Best Selling</option>
                        <option value="new_arrival">New Arrival</option>
                        <option value="price_asc">Price: Low to High</option>
                        <option value="price_desc">Price: High to Low</option>
                    </Form.Select>
                </div>

                {/* Flash Sale Filter */}
                <div className="mb-4">
                    <label className="form-label fw-semibold">Flash Sale:</label>
                    <Form.Select value={selectedFlashSale} onChange={handleFlashSaleChange} disabled={loading}>
                        <option value="">All Products</option>
                        {flashSalesSchedule.active?.map((sale) => (
                            <option key={`active-${sale.id}`} value={sale.id}>
                                🔥 Active - {sale.display_time}
                            </option>
                        ))}
                        {flashSalesSchedule.upcoming?.map((sale) => (
                            <option key={`upcoming-${sale.id}`} value={sale.id}>
                                ⏰ Upcoming - {sale.display_time}
                            </option>
                        ))}
                    </Form.Select>
                    {loading && <small className="text-muted">Loading flash sales...</small>}
                </div>

                {/* Clear Filters */}
                <Button
                    variant="outline-danger"
                    size="sm"
                    className="w-100"
                    onClick={() => {
                        setSelectedCategory("All Categories");
                        setPriceRange({ min: 0, max: 2000 });
                        setSelectedSort && setSelectedSort("");
                        setSelectedFlashSale && setSelectedFlashSale("");
                        setCurrentPage(1);
                    }}
                >
                    Clear Filters
                </Button>
            </Card.Body>
        </Card>
    );
};

export default FilterCard;
