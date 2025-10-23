import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { Container, Row, Col, Card, Button, Form, Badge, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Cart, Heart, Truck } from "react-bootstrap-icons";
import HorizontalLazy from "../components/HorizontalLazy";
import ProductReviews from "../components/ProductReviews";
import LoadingOverlay from "../components/LoadingOverlay";
import ProductService from "../services/productService";
import CartService from "../services/cartService";
import { useApiErrorHandler } from "../hooks/useApiErrorHandler";
import { useAuthStatus } from "../hooks/useAuthStatus";
import StarRating from "../components/StarRating";
import Countdown from "../components/Countdown";
import { formatPrice } from "../utils/formatters";

const ProductDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { handleError, showSuccess } = useApiErrorHandler();
    const { isLoggedIn } = useAuthStatus();

    // State untuk product data
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);

    // State untuk UI interactions
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedColor, setSelectedColor] = useState("");
    const [selectedSize, setSelectedSize] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [addingToCart, setAddingToCart] = useState(false);

    // Calculate stackable discount prices
    const calculateStackablePrice = () => {
        if (!product) return { originalPrice: 0, finalPrice: 0 };

        let originalPrice = parseFloat(product.price);
        let afterProductDiscount = originalPrice;

        // Apply product discount first (if any)
        if (product.discount && product.discount !== "0.00") {
            afterProductDiscount = originalPrice * (1 - parseFloat(product.discount) / 100);
        }

        // Apply flash sale discount on the already discounted price (stackable)
        let finalPrice = afterProductDiscount;
        if (product.sale?.sale_discount && product.sale.sale_discount !== "0.00") {
            finalPrice = afterProductDiscount * (1 - parseFloat(product.sale.sale_discount) / 100);
        }

        return {
            originalPrice: originalPrice,
            afterProductDiscount: afterProductDiscount,
            finalPrice: finalPrice,
            // totalDiscountPercentage: Math.round(((originalPrice - finalPrice) / originalPrice) * 100),
        };
    };

    // Fetch product data from API
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                setError(null);

                if (!id) {
                    setError("Product ID is required");
                    return;
                }

                const response = await ProductService.getProductById(id);
                const productData = response.data.data;

                if (!productData) {
                    setError("Product not found");
                    return;
                }

                setProduct(productData);

                // Set default selections setelah product loaded
                if (productData.variants?.variant_options?.length > 0) {
                    setSelectedColor(productData.variants.variant_options[0]?.name || "");
                    setSelectedSize(productData.variants.variant_options[0]?.name || "");
                }
            } catch (err) {
                console.error("Error fetching product:", err);
                const errorInfo = handleError(err);
                if (err.status === 404) {
                    setError("Product not found");
                } else {
                    setError(errorInfo.message || "Failed to load product");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id, handleError]);

    // Fetch related products based on category
    useEffect(() => {
        const fetchRelatedProducts = async () => {
            if (!product?.category?.id) return;

            try {
                const response = await ProductService.getProducts({
                    category_id: product.category.id,
                    items_per_page: 8,
                });

                // Filter out current product from related products
                const filteredProducts = response.data.data.filter((p) => p.id !== product.id);
                setRelatedProducts(filteredProducts);
            } catch (err) {
                console.error("Error fetching related products:", err);
                // Don't show error for related products, just keep it empty
                setRelatedProducts([]);
            }
        };

        fetchRelatedProducts();
    }, [product?.category?.id, product?.id]);

    const renderStars = (rating) => {
        return <StarRating rating={rating} />;
    };

    const handleAddToCart = async () => {
        if (!product) return;

        // Check if user is logged in using useAuthStatus
        if (!isLoggedIn) {
            showSuccess("Please login to add items to cart");
            navigate("/login");
            return;
        }

        try {
            setAddingToCart(true);

            await CartService.addToCart(product.id, quantity);
            showSuccess(`Added ${quantity} ${product.name} to cart successfully!`);

            // Optionally reset quantity to 1 after successful add
            setQuantity(1);
        } catch (err) {
            console.error("Error adding to cart:", err);
            const errorInfo = handleError(err);

            // Handle specific error cases
            if (err.status === 401) {
                showSuccess("Please login to add items to cart");
                navigate("/login");
            } else {
                // Don't show success, let handleError show the error
            }
        } finally {
            setAddingToCart(false);
        }
    };

    const handleBuyNow = () => {
        if (!product) return;

        // Check if user is logged in
        if (!isLoggedIn) {
            showSuccess("Please login to continue with purchase");
            navigate("/login");
            return;
        }

        // Create direct checkout URL with product details
        const checkoutParams = new URLSearchParams({
            product_id: product.id,
            quantity: quantity.toString(),
        });

        // Add variant if selected
        if (selectedSize) {
            // Find the selected variant option to get its ID
            const selectedOption = product.variants?.variant_options?.find((option) => option.name === selectedSize);
            if (selectedOption) {
                checkoutParams.append("variant_id", selectedOption.id);
            }
        }

        // Navigate to checkout with product parameters
        navigate(`/checkout?${checkoutParams.toString()}`);
    };

    // Loading state
    if (loading) {
        return <LoadingOverlay show={true} message="Loading product..." />;
    }

    // Error state
    if (error) {
        return (
            <MainLayout>
                <Container className="py-5">
                    <Alert variant="danger" className="text-center">
                        <h4>Error</h4>
                        <p>{error}</p>
                        <Button variant="outline-danger" onClick={() => navigate("/")}>
                            Back to Home
                        </Button>
                    </Alert>
                </Container>
            </MainLayout>
        );
    }

    // Product not found
    if (!product) {
        return (
            <MainLayout>
                <Container className="py-5">
                    <Alert variant="warning" className="text-center">
                        <h4>Product Not Found</h4>
                        <p>The product you're looking for doesn't exist.</p>
                        <Button variant="outline-warning" onClick={() => navigate("/")}>
                            Back to Home
                        </Button>
                    </Alert>
                </Container>
            </MainLayout>
        );
    }

    // Helper untuk mengambil gambar produk
    const getProductImages = () => {
        if (product.product_images && product.product_images.length > 0) {
            return product.product_images.map((img) => img.name);
        }
        return ["/product.png"]; // fallback image
    };

    const productImages = getProductImages();
    const priceInfo = calculateStackablePrice();
    const hasDiscount = (product.discount && parseFloat(product.discount) > 0) || (product.sale?.sale_discount && parseFloat(product.sale.sale_discount) > 0);
    const isFlashSale = product.sale && new Date(product.sale.start_date) <= new Date() && new Date(product.sale.end_date) >= new Date();

    return (
        <MainLayout>
            <Container className="py-4">
                {/* Breadcrumb */}
                <Row className="mb-4">
                    <Col>
                        <Link to="/" className="text-decoration-none">
                            <span className="text-muted">Home</span>
                        </Link>
                        <span className="mx-2 text-muted">/</span>
                        <Link to="/products" className="text-decoration-none">
                            <span className="text-muted">Products</span>
                        </Link>
                        <span className="mx-2 text-muted">/</span>
                        <span className="text-dark">{product.name}</span>
                    </Col>
                </Row>

                {/* Product Detail */}
                <Row className="mb-5">
                    {/* Product Images */}
                    <Col lg={6}>
                        <Row>
                            {/* Thumbnail Images */}
                            <Col md={2} className="mb-3 mb-md-0">
                                <div className="d-flex flex-column gap-2">
                                    {productImages.map((image, index) => (
                                        <div
                                            key={index}
                                            className={`bg-light p-2 rounded cursor-pointer ${selectedImage === index ? "border border-danger" : "border"}`}
                                            style={{ cursor: "pointer", height: "80px" }}
                                            onClick={() => setSelectedImage(index)}
                                        >
                                            <img src={image} alt={`Product ${index + 1}`} className="img-fluid h-100 w-100" style={{ objectFit: "contain" }} />
                                        </div>
                                    ))}
                                </div>
                            </Col>

                            {/* Main Image */}
                            <Col md={10}>
                                <div className="bg-light p-4 rounded" style={{ height: "400px" }}>
                                    <img src={productImages[selectedImage]} alt={product.name} className="img-fluid h-100 w-100" style={{ objectFit: "contain" }} />
                                </div>
                            </Col>
                        </Row>
                    </Col>

                    {/* Product Information */}
                    <Col lg={6}>
                        <div className="ps-lg-4">
                            {/* Flash Sale Card */}
                            {isFlashSale && (
                                <Card className="border-warning mb-3 shadow-sm bg-warning bg-opacity-10">
                                    <Card.Body className="p-3">
                                        <div className="d-flex justify-content-between align-items-start">
                                            {/* Left side - Title & Countdown */}
                                            <div>
                                                <div className="d-flex align-items-center mb-2">
                                                    <span className="fs-5 me-2">⚡</span>
                                                    <h5 className="text-warning fw-bold mb-0">Flash Sale</h5>
                                                </div>
                                                <div className="ms-0">
                                                    <Countdown endTime={product.sale.end_date} />
                                                </div>
                                            </div>

                                            {/* Right side - Discount Info */}
                                            <div className="text-end">
                                                <div className="mb-2">
                                                    <Badge bg="danger" className="px-3 py-2 rounded-3 fw-bold fs-6">
                                                        {Math.round(parseFloat(product.sale.sale_discount))}% OFF
                                                    </Badge>
                                                </div>
                                                <div className="small text-warning fw-medium">Limited Time!</div>
                                            </div>
                                        </div>
                                    </Card.Body>
                                </Card>
                            )}

                            {/* Product Title */}
                            <h2 className="fw-bold mb-2">{product.name}</h2>

                            {/* Rating and Reviews */}
                            <div className="d-flex align-items-center mb-3">
                                <div className="me-2">{renderStars(product.avg_rating || 0)}</div>
                                <span className="text-muted small">({product.total_rating || 0} Reviews)</span>
                                <span className="mx-2 text-muted">|</span>
                                <span className={`small ${product.stock > 0 ? "text-success" : "text-danger"}`}>{product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}</span>
                            </div>

                            {/* Price */}
                            <div className="mb-3">
                                <div className="d-flex align-items-center gap-3">
                                    <span className="fs-4 fw-bold text-danger">{formatPrice(priceInfo.finalPrice.toString())}</span>
                                    {hasDiscount && <span className="text-muted text-decoration-line-through">{formatPrice(priceInfo.originalPrice.toString())}</span>}
                                </div>

                                {/* Discount Information */}
                                {hasDiscount && (
                                    <div className="mt-2 d-flex gap-2 flex-wrap">
                                        {product.discount && parseFloat(product.discount) > 0 && (
                                            <small className="text-success fw-medium">
                                                <span className="badge bg-success bg-opacity-10 text-success border border-success">Product Discount: {Math.round(parseFloat(product.discount))}% OFF</span>
                                            </small>
                                        )}
                                        {product.sale?.sale_discount && parseFloat(product.sale.sale_discount) > 0 && (
                                            <small className="text-warning fw-medium">
                                                <span className="badge bg-warning bg-opacity-10 text-warning border border-warning">Flash Sale: {Math.round(parseFloat(product.sale.sale_discount))}% OFF</span>
                                            </small>
                                        )}
                                        {/* {priceInfo.totalDiscountPercentage > 0 && (
                                            <small className="text-primary fw-medium">
                                                <span className="badge bg-primary bg-opacity-10 text-primary border border-primary">Total Savings: {priceInfo.totalDiscountPercentage}%</span>
                                            </small>
                                        )} */}
                                    </div>
                                )}
                            </div>

                            {/* Description */}
                            <p className="text-muted mb-4">{product.description || "No description available."}</p>

                            <hr />

                            {/* Variants (if available) */}
                            {product.variants?.variant_options && product.variants.variant_options.length > 0 && (
                                <div className="mb-4">
                                    <div className="d-flex align-items-center mb-3">
                                        <span className="me-3 fw-medium">{product.variants.name}:</span>
                                        <div className="d-flex gap-2 flex-wrap">
                                            {product.variants.variant_options.map((option, index) => (
                                                <Button key={index} variant={selectedSize === option.name ? "danger" : "outline-secondary"} size="sm" className="px-3" onClick={() => setSelectedSize(option.name)}>
                                                    {option.name}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Quantity and Actions */}
                            <div className="d-flex align-items-center gap-3 mb-4">
                                <div className="d-flex align-items-center border rounded p-1">
                                    <Button variant="light" size="sm" className="border-0" onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={product.stock === 0}>
                                        -
                                    </Button>
                                    <span className="px-3 fw-medium">{quantity}</span>
                                    <Button variant="light" size="sm" className="border-0" onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} disabled={product.stock === 0}>
                                        +
                                    </Button>
                                </div>

                                <Button variant="danger" className="px-4 py-2 fw-semibold" onClick={handleBuyNow} disabled={product.stock === 0}>
                                    {product.stock > 0 ? "Buy Now" : "Out of Stock"}
                                </Button>

                                <Button variant="outline-secondary" size="sm" className="p-2" onClick={handleAddToCart} disabled={product.stock === 0 || addingToCart}>
                                    {addingToCart ? (
                                        <div className="spinner-border spinner-border-sm" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    ) : (
                                        <Cart size={20} />
                                    )}
                                </Button>
                            </div>

                            {/* Stock Info */}
                            {product.stock > 0 && product.stock <= 10 && (
                                <div className="mb-3">
                                    <small className="text-warning">Only {product.stock} items left in stock!</small>
                                </div>
                            )}

                            {/* Delivery Info */}
                            <Card className="border">
                                <Card.Body className="p-3">
                                    <div className="d-flex align-items-center mb-3">
                                        <Truck size={24} className="me-3" />
                                        <div>
                                            <div className="fw-medium">Free Delivery</div>
                                            <small className="text-muted">Enter your postal code for Delivery Availability</small>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </div>
                    </Col>
                </Row>

                {/* Product Reviews */}
                <ProductReviews productId={product.id} />
            </Container>
            {/* Related Products */}
            <HorizontalLazy title="Related Item" subTitle={product.category ? `${product.category.name} Products` : "Products"} products={relatedProducts} categoryId={product.category?.id} categoryName={product.category?.name} />
        </MainLayout>
    );
};

export default ProductDetailPage;
