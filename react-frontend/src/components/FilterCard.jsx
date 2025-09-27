import React from "react";
import { Card, Form, InputGroup, Button, Row, Col } from "react-bootstrap";
import { Search, Filter, ChevronLeft } from "react-bootstrap-icons";

const FilterCard = ({ searchTerm, setSearchTerm, selectedCategory, setSelectedCategory, priceRange, setPriceRange, setCurrentPage, setShowFilters, categories }) => {
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
                {/* Search */}
                <div className="mb-4">
                    <label className="form-label fw-semibold">Search Products</label>
                    <InputGroup>
                        <Form.Control type="text" placeholder="Search products..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        <InputGroup.Text>
                            <Search size={16} />
                        </InputGroup.Text>
                    </InputGroup>
                </div>

                {/* Category Filter */}
                <div className="mb-4">
                    <label className="form-label fw-semibold">Category</label>
                    <Form.Select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </Form.Select>
                </div>

                {/* Price Range Filter */}
                <div className="mb-4">
                    <label className="form-label fw-semibold">Price Range</label>
                    <Row>
                        <Col>
                            <Form.Control type="number" placeholder="Min" value={priceRange.min} onChange={(e) => setPriceRange((prev) => ({ ...prev, min: parseInt(e.target.value) || 0 }))} />
                        </Col>
                        <Col xs="auto" className="d-flex align-items-center">
                            <span>-</span>
                        </Col>
                        <Col>
                            <Form.Control type="number" placeholder="Max" value={priceRange.max} onChange={(e) => setPriceRange((prev) => ({ ...prev, max: parseInt(e.target.value) || 2000 }))} />
                        </Col>
                    </Row>
                </div>

                {/* Clear Filters */}
                <Button
                    variant="outline-danger"
                    size="sm"
                    className="w-100"
                    onClick={() => {
                        setSearchTerm("");
                        setSelectedCategory("All Categories");
                        setPriceRange({ min: 0, max: 2000 });
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
