import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
// Pastikan Pagination sudah diimpor dari react-bootstrap
import { Container, Row, Col, Button, Dropdown, Pagination } from "react-bootstrap";
import { Filter, ChevronLeft, ChevronRight } from "react-bootstrap-icons";
import MainLayout from "../layouts/MainLayout";
import ProductGrid from "../components/ProductGrid";
import FilterCard from "../components/FilterCard";
import { useCategories } from "../contexts/CategoryContext";
import useApiErrorHandler from "../hooks/useApiErrorHandler";
import ProductService from "../services/productService";
import CustomPagination from "../components/CustomPagination";
import saleService from "../services/saleService";

const ProductPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { handleError } = useApiErrorHandler();
    const { categories } = useCategories();

    // Initialize state from URL parameters
    const [selectedCategory, setSelectedCategory] = useState("All Categories");
    const [priceRange, setPriceRange] = useState({ min: 0, max: 2000 });
    const [sortBy, setSortBy] = useState("name");
    const [selectedSort, setSelectedSort] = useState(() => {
        const filterFromUrl = searchParams.get("filter");
        const flashSaleIdFromUrl = searchParams.get("flash_sale_id");
        // If there's a flash_sale_id but no filter, or filter is flash_sale, don't set selectedSort
        if (flashSaleIdFromUrl && (!filterFromUrl || filterFromUrl === "flash_sale")) {
            return "";
        }
        return filterFromUrl || "";
    });
    const [selectedFlashSale, setSelectedFlashSale] = useState(() => {
        return searchParams.get("flash_sale_id") || "";
    });
    const [showFilters, setShowFilters] = useState(true);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(() => {
        return parseInt(searchParams.get("page")) || 1;
    });
    const [totalPages, setTotalPages] = useState(1);
    const [flashSaleDiscount, setFlashSaleDiscount] = useState(null);

    // Initialize state from URL when categories load
    useEffect(() => {
        if (categories.length === 0) return;

        const categoryFromUrl = searchParams.get("category");
        const sortFromUrl = searchParams.get("filter");
        const flashSaleFromUrl = searchParams.get("flash_sale_id");
        const pageFromUrl = searchParams.get("page");

        // Set category if found in URL
        if (categoryFromUrl) {
            const matchedCategory = categories.find((cat) => cat.name.toLowerCase() === categoryFromUrl.toLowerCase());
            if (matchedCategory && matchedCategory.name !== selectedCategory) {
                setSelectedCategory(matchedCategory.name);
            }
        }

        // Set other filters
        if (sortFromUrl && sortFromUrl !== selectedSort) {
            setSelectedSort(sortFromUrl);
        }
        if (flashSaleFromUrl && flashSaleFromUrl !== selectedFlashSale) {
            setSelectedFlashSale(flashSaleFromUrl);
        }
        if (pageFromUrl) {
            const page = parseInt(pageFromUrl, 10);
            if (page !== currentPage) {
                setCurrentPage(page);
            }
        }
    }, [categories.length]); // Only depend on categories loading

    // Define fetchProducts function first
    const fetchProducts = useCallback(
        async (page) => {
            try {
                setLoading(true);
                const params = {
                    items_per_page: 6,
                    page: page,
                };

                // Add filters if selected
                if (selectedSort && selectedSort !== "") {
                    params.filter = selectedSort;
                }

                if (selectedFlashSale && selectedFlashSale !== "") {
                    params.filter = "flash_sale";
                    params.flash_sale_id = selectedFlashSale;

                    // Fetch flash sale discount when flash sale filter is active
                    try {
                        const flashSaleResponse = await saleService.getActiveFlashSaleWithProducts();
                        const activeFlashSale = flashSaleResponse.data.data.flash_sale;
                        if (activeFlashSale && activeFlashSale.id.toString() === selectedFlashSale) {
                            setFlashSaleDiscount(activeFlashSale.sale_discount);
                        }
                    } catch (flashSaleError) {
                        console.error("Failed to fetch flash sale discount:", flashSaleError);
                        setFlashSaleDiscount(null);
                    }
                } else {
                    setFlashSaleDiscount(null);
                }

                // Add category filter - but only if categories are loaded
                if (selectedCategory && selectedCategory !== "All Categories" && categories.length > 0) {
                    // Find category ID by name (case-insensitive matching)
                    const category = categories.find((cat) => cat.name.toLowerCase() === selectedCategory.toLowerCase());
                    if (category) {
                        params.category_id = category.id;
                    }
                }
                const response = await ProductService.getProducts(params);
                setProducts(response.data.data || []);
                setTotalPages(response.data.pagination.total_pages || 1);
            } catch (error) {
                handleError(error);
            } finally {
                setLoading(false);
            }
        },
        [selectedSort, selectedFlashSale, selectedCategory, categories, handleError]
    );

    // Update URL when filters change (separate from reading URL)
    useEffect(() => {
        if (categories.length === 0) return;

        const params = new URLSearchParams();

        if (selectedSort && selectedSort !== "") params.set("filter", selectedSort);
        if (selectedFlashSale && selectedFlashSale !== "") params.set("flash_sale_id", selectedFlashSale);
        if (selectedCategory && selectedCategory !== "All Categories") {
            params.set("category", selectedCategory.toLowerCase());
        }
        if (currentPage > 1) params.set("page", currentPage.toString());

        setSearchParams(params, { replace: true });
    }, [selectedSort, selectedFlashSale, selectedCategory, currentPage]);

    // Fetch products when dependencies change
    useEffect(() => {
        if (categories.length > 0) {
            window.scrollTo({ top: 0, behavior: "smooth" });
            fetchProducts(currentPage);
        }
    }, [currentPage, fetchProducts]);

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    const categoryOptions = useMemo(() => {
        return [{ id: 0, name: "All Categories" }, ...categories];
    }, [categories]);

    const processedProducts = useMemo(() => {
        return products.map((product) => ({
            id: product.id,
            imageUrl: product.product_images?.[0]?.name || "/product.png",
            name: product.name,
            price: product.discounted_price?.toString(),
            oldPrice: product.price?.toString(),
            reviews: product.total_rating || 0,
            discount: product.discount?.toString(),
            avg_rating: product.avg_rating,
        }));
    }, [products]);

    return (
        <>
            <MainLayout>
                <Container className="my-5 my-md-4">
                    <Row>
                        {/* Desktop Filters Sidebar (tidak ada perubahan) */}
                        {showFilters && (
                            <Col lg={3} md={4} className="d-none d-md-block mb-4">
                                <div style={{ position: "sticky", top: "120px", zIndex: 100 }}>
                                    <FilterCard
                                        selectedCategory={selectedCategory}
                                        setSelectedCategory={setSelectedCategory}
                                        priceRange={priceRange}
                                        setPriceRange={setPriceRange}
                                        setShowFilters={setShowFilters}
                                        setCurrentPage={setCurrentPage}
                                        categories={categoryOptions}
                                        selectedSort={selectedSort}
                                        setSelectedSort={setSelectedSort}
                                        selectedFlashSale={selectedFlashSale}
                                        setSelectedFlashSale={setSelectedFlashSale}
                                    />
                                </div>
                            </Col>
                        )}

                        {/* Products Section */}
                        <Col xs={12} lg={showFilters ? 9 : 12} md={showFilters ? 8 : 12}>
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
                                </div>

                                {/* Mobile Filters (sticky below toggle) */}
                                {showFilters && (
                                    <div className="d-block d-md-none">
                                        <FilterCard
                                            selectedCategory={selectedCategory}
                                            setSelectedCategory={setSelectedCategory}
                                            priceRange={priceRange}
                                            setPriceRange={setPriceRange}
                                            setShowFilters={setShowFilters}
                                            setCurrentPage={setCurrentPage}
                                            categories={categories}
                                            selectedSort={selectedSort}
                                            setSelectedSort={setSelectedSort}
                                            selectedFlashSale={selectedFlashSale}
                                            setSelectedFlashSale={setSelectedFlashSale}
                                        />
                                    </div>
                                )}
                            </div>

                            {!loading && (
                                <>
                                    {processedProducts.length > 0 ? (
                                        <ProductGrid products={processedProducts} showAllProducts={true} flashSaleDiscount={flashSaleDiscount} />
                                    ) : (
                                        <div className="text-center py-5">
                                            <h5 className="text-muted">No products found</h5>
                                        </div>
                                    )}

                                    <CustomPagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                                </>
                            )}
                        </Col>
                    </Row>
                </Container>
            </MainLayout>
        </>
    );
};

export default ProductPage;
