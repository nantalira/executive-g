import React, { useState, useEffect, useCallback } from "react";
import MainLayout from "../layouts/MainLayout";
import { Container, Row, Col, Button, Form, Spinner, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import CartService from "../services/cartService";
import couponService from "../services/couponService";
import ProductService from "../services/productService";
import addressService from "../services/addressService";
import OrderService from "../services/orderService";
import AddressSelectionModal from "../components/AddressSelectionModal";
import { useApiErrorHandler } from "../hooks/useApiErrorHandler";
import { formatPrice } from "../utils/formatters";
import { useLocation, useNavigate } from "react-router-dom";

const CheckoutPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        phoneNumber: "",
        address: "",
        detailAddress: "",
        province: "",
        district: "",
        sub_district: "",
        village: "",
        postal_code: "",
    });

    const [paymentMethod, setPaymentMethod] = useState("cash");
    const [couponCode, setCouponCode] = useState("");
    const [loading, setLoading] = useState(true);
    const [orderItems, setOrderItems] = useState([]);
    const [couponLoading, setCouponLoading] = useState(false);
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [couponError, setCouponError] = useState(null);
    const [couponSuccess, setCouponSuccess] = useState(null);
    const [error, setError] = useState(null);
    const [checkoutType, setCheckoutType] = useState("cart");
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [addressLoading, setAddressLoading] = useState(false);
    const [redirecting, setRedirecting] = useState(false);
    const { handleError } = useApiErrorHandler();

    // Helper function to format complete address
    const formatCompleteAddress = (address) => {
        const addressParts = [address.address, address.village, address.sub_district, address.district, address.province, address.postal_code].filter((part) => part && part.trim() !== "");

        return addressParts.join(", ");
    };

    // Handle direct checkout from product detail
    const handleDirectCheckout = useCallback(async (productId, quantity = 1, variantId = null) => {
        try {
            const productResponse = await ProductService.getProductById(productId);
            const product = productResponse.data?.data || productResponse.data;

            if (!product) {
                setError("Product not found");
                return;
            }

            let finalPrice = parseFloat(product.price) || 0;

            if (product.discount && product.discount !== "0.00") {
                finalPrice = finalPrice * (1 - parseFloat(product.discount) / 100);
            }

            if (product.sale?.sale_discount && product.sale.sale_discount !== "0.00") {
                finalPrice = finalPrice * (1 - parseFloat(product.sale.sale_discount) / 100);
            }

            const orderItem = {
                id: `direct_${productId}`,
                product_id: productId,
                name: product.name || "Product",
                price: finalPrice,
                quantity: parseInt(quantity) || 1,
                image: product.images?.[0]?.name || product.image || "public/product.png",
                variant_id: variantId,
                original_price: parseFloat(product.price) || 0,
            };

            setOrderItems([orderItem]);
        } catch (err) {
            if (err.response?.status === 404) {
                setError("Product not found. The product may have been removed or is no longer available.");
            } else {
                setError("Failed to setup direct checkout. Please try again or contact support.");
            }
        }
    }, []);

    // Handle checkout from cart
    const handleCartCheckout = useCallback(async () => {
        try {
            const response = await CartService.getCartItems();
            const items = response.data.data || [];

            const selectedItemIds = JSON.parse(localStorage.getItem("selectedCartItems") || "[]");
            const selectedItems = items.filter((item) => selectedItemIds.includes(item.id));

            if (selectedItems.length === 0) {
                setError("No items selected for checkout");
                return;
            }

            const transformedItems = selectedItems.map((item) => {
                // Calculate the final price considering discounts
                const originalPrice = parseFloat(item.product?.price) || 0;
                let finalPrice = originalPrice;

                // Apply product discount if exists
                if (item.product?.discount && parseFloat(item.product.discount) > 0) {
                    finalPrice = finalPrice * (1 - parseFloat(item.product.discount) / 100);
                }

                // Apply flash sale discount if exists and active
                if (item.product?.sale?.sale_discount && parseFloat(item.product.sale.sale_discount) > 0) {
                    finalPrice = finalPrice * (1 - parseFloat(item.product.sale.sale_discount) / 100);
                }

                // Get product image
                const productImage = item.product?.product_images?.[0]?.name || item.product?.productImages?.[0]?.name || "public/product.png";

                const transformedItem = {
                    id: item.id,
                    name: item.product?.name || "Unknown Product",
                    price: Math.round(finalPrice),
                    quantity: parseInt(item.quantity) || 1,
                    image: productImage,
                    product_id: item.product?.id,
                    original_price: originalPrice,
                };

                return transformedItem;
            });

            setOrderItems(transformedItems);

            // Note: No longer loading coupon from localStorage
            // User must enter coupon again in checkout for security and data consistency
        } catch (err) {
            setError("Failed to load cart items");
        }
    }, []);

    // Fetch pinned address
    const fetchPinnedAddress = useCallback(async () => {
        try {
            setAddressLoading(true);
            const response = await addressService.getPinnedAddress();

            // Check if response has data (success response structure: { message, data })
            if (response && response.data) {
                const address = response.data;
                setFormData({
                    name: address.fullname || "",
                    phoneNumber: address.phone || "",
                    address: formatCompleteAddress(address),
                    detailAddress: address.detail || "",
                    province: address.province || "",
                    district: address.district || "",
                    sub_district: address.sub_district || "",
                    village: address.village || "",
                    postal_code: address.postal_code || "",
                });
            } else if (response && response.message) {
                // No pinned address available - show error and redirect
                setRedirecting(true);
                handleError(
                    {
                        message: "You must have a default address to proceed with checkout. Please add an address first.",
                        status: 400,
                    },
                    "Address required for checkout"
                );

                // Redirect to address management page
                setTimeout(() => {
                    navigate("/profile/address");
                }, 2000);

                return false; // Indicate failure
            } else {
                // Unexpected response structure - treat as no address
                setRedirecting(true);
                handleError(
                    {
                        message: "You must have a default address to proceed with checkout. Please add an address first.",
                        status: 400,
                    },
                    "Address required for checkout"
                );

                setTimeout(() => {
                    navigate("/profile/address");
                }, 2000);

                return false;
            }
        } catch (err) {
            // Handle API errors (including 404 for no pinned address)
            if (err.status === 404) {
                // No pinned address exists
                setRedirecting(true);
                handleError(
                    {
                        message: "You must have a default address to proceed with checkout. Please add an address first.",
                        status: 400,
                    },
                    "Address required for checkout"
                );

                setTimeout(() => {
                    navigate("/profile/address");
                }, 2000);

                return false;
            } else {
                // Other API errors
                handleError(err, "Failed to load address information");
                return false;
            }
        } finally {
            setAddressLoading(false);
        }

        return true; // Indicate success
    }, [handleError, navigate]);

    // Handle address selection from modal
    const handleAddressSelect = (address) => {
        setFormData({
            name: address.fullname || "",
            phoneNumber: address.phone || "",
            address: formatCompleteAddress(address),
            detailAddress: address.detail || "",
            province: address.province || "",
            district: address.district || "",
            sub_district: address.sub_district || "",
            village: address.village || "",
            postal_code: address.postal_code || "",
        });
    };

    useEffect(() => {
        const fetchCheckoutData = async () => {
            try {
                setLoading(true);
                setError(null);

                const searchParams = new URLSearchParams(location.search);
                const productId = searchParams.get("product_id");
                const quantity = searchParams.get("quantity");
                const variantId = searchParams.get("variant_id");

                // Fetch pinned address first - if it fails, don't continue
                const hasAddress = await fetchPinnedAddress();
                if (!hasAddress) {
                    // Address validation failed, fetchPinnedAddress will handle error and redirect
                    setLoading(false);
                    return;
                }

                // Continue with checkout data loading only if address is available
                if (productId) {
                    setCheckoutType("direct");
                    await handleDirectCheckout(productId, quantity, variantId);
                } else {
                    setCheckoutType("cart");
                    await handleCartCheckout();
                }
            } catch (err) {
                handleError(err, "Failed to load checkout data");
            } finally {
                setLoading(false);
            }
        };

        fetchCheckoutData();
    }, [location, handleDirectCheckout, handleCartCheckout, fetchPinnedAddress, handleError]);

    // Calculate totals with coupon
    const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = 0;

    let discount = 0;
    if (appliedCoupon && subtotal >= (appliedCoupon.minimum_purchase || 0)) {
        // Prioritize using pre-calculated discount_amount from backend
        if (appliedCoupon.discount_amount !== undefined && appliedCoupon.discount_amount !== null) {
            discount = parseFloat(appliedCoupon.discount_amount);
        } else {
            // Fallback: calculate discount on frontend (should match backend logic)
            if (appliedCoupon.type === "percentage") {
                // Calculate percentage discount
                discount = (subtotal * (appliedCoupon.value || 0)) / 100;

                // Apply maximum discount limit if set
                if (appliedCoupon.maximum_discount && appliedCoupon.maximum_discount > 0) {
                    discount = Math.min(discount, parseFloat(appliedCoupon.maximum_discount));
                }
            } else {
                // Fixed discount type
                discount = parseFloat(appliedCoupon.value || 0);
            }

            // Ensure discount doesn't exceed subtotal
            discount = Math.min(discount, subtotal);
        }

        // Round to 2 decimal places
        discount = Math.round(discount * 100) / 100;
    }

    const total = Math.max(subtotal + shipping - discount, 0);

    // Note: applyCouponFromCart function removed as we no longer use localStorage for coupons

    const applyCoupon = useCallback(async () => {
        if (!couponCode.trim()) {
            setCouponError("Please enter a coupon code");
            return;
        }

        if (subtotal === 0) {
            setCouponError("Cannot apply coupon to empty order");
            return;
        }

        try {
            setCouponLoading(true);
            setCouponError(null);
            setCouponSuccess(null);

            console.log("Applying coupon:", couponCode.trim(), "for subtotal:", subtotal); // Debug log

            const response = await couponService.applyCoupon(couponCode.trim(), subtotal);

            console.log("Coupon service response:", response); // Debug log

            // Check for success response
            if (response.success && response.data) {
                // First get coupon details from check endpoint to get full coupon data
                try {
                    const checkResponse = await couponService.checkCoupon(couponCode.trim(), subtotal);
                    console.log("Check coupon response:", checkResponse); // Debug log

                    let appliedCouponData;
                    if (checkResponse.success && checkResponse.data) {
                        appliedCouponData = {
                            ...checkResponse.data,
                            discount_amount: response.data.discount_amount,
                        };
                    } else {
                        // Fallback: use data from applyCoupon response
                        appliedCouponData = {
                            code: response.data.coupon_code || couponCode.trim(),
                            name: response.data.coupon_code || couponCode.trim(),
                            type: "fixed", // Default since we don't have this info
                            value: response.data.discount_amount,
                            minimum_purchase: 0,
                            discount_amount: response.data.discount_amount,
                        };
                    }

                    setAppliedCoupon(appliedCouponData);
                    setCouponSuccess(`Coupon applied! You saved ${formatPrice(response.data.discount_amount || 0)}`);
                } catch (checkError) {
                    console.log("Check coupon failed, using fallback:", checkError);
                    // Use fallback data from applyCoupon response
                    const fallbackCouponData = {
                        code: response.data.coupon_code || couponCode.trim(),
                        name: response.data.coupon_code || couponCode.trim(),
                        type: "fixed",
                        value: response.data.discount_amount,
                        minimum_purchase: 0,
                        discount_amount: response.data.discount_amount,
                    };

                    setAppliedCoupon(fallbackCouponData);
                    setCouponSuccess(`Coupon applied! You saved ${formatPrice(response.data.discount_amount || 0)}`);
                }
            } else {
                // Handle error response
                console.log("Coupon application failed:", response);
                setCouponError(response.error || response.message || "Failed to apply coupon");
            }
        } catch (err) {
            console.error("Coupon application error:", err);
            // Use handleError hook for better error handling
            const errorInfo = handleError(err, "Failed to apply coupon");
            setCouponError(errorInfo.message || "Failed to apply coupon. Please try again.");
        } finally {
            setCouponLoading(false);
        }
    }, [couponCode, subtotal, handleError]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const orderData = {
                formData,
                paymentMethod,
                orderItems,
                appliedCoupon,
                totals: {
                    subtotal,
                    shipping,
                    discount,
                    total,
                },
            };

            // Create order using OrderService
            const response = await OrderService.createOrder(orderData);

            // Show success message
            setError(null);

            // Clean up cart items if checkout from cart
            if (checkoutType === "cart") {
                localStorage.removeItem("selectedCartItems");
                // Optionally remove items from server cart as well
                // await CartService.clearCart();
            }

            // Navigate to success page or order details
            navigate("/profile/orders/process", {
                state: {
                    message: "Order created successfully!",
                    activeTab: "process",
                },
            });
        } catch (error) {
            handleError(error, "Failed to create order");
        } finally {
            setLoading(false);
        }
    };

    return (
        <MainLayout>
            <Container className="py-4">
                <Row>
                    <Col className="mb-4">
                        <Link to="/" className="text-decoration-none">
                            <span className="text-muted">Home</span>
                        </Link>
                        <span className="mx-1 text-muted">/</span>
                        <span className="text-dark">Checkout</span>
                    </Col>
                </Row>

                {error && (
                    <Row className="mb-4">
                        <Col>
                            <Alert variant="danger" onClose={() => setError(null)} dismissible>
                                {error}
                            </Alert>
                        </Col>
                    </Row>
                )}

                {loading && (
                    <Row className="mb-4">
                        <Col className="text-center py-5">
                            <Spinner animation="border" variant="danger" />
                            <p className="mt-2 text-muted">{redirecting ? "Redirecting to address management..." : "Loading checkout data..."}</p>
                        </Col>
                    </Row>
                )}

                {!loading && orderItems.length === 0 && (
                    <Row className="mb-4">
                        <Col className="text-center py-5">
                            {checkoutType === "direct" ? (
                                <>
                                    <h5>Product not found</h5>
                                    <p className="text-muted">The product you're trying to purchase could not be found</p>
                                    <Button as={Link} to="/" variant="danger">
                                        Back to Home
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <h5>No items selected for checkout</h5>
                                    <p className="text-muted">Please go back to cart and select items to checkout</p>
                                    <Button as={Link} to="/cart" variant="danger">
                                        Back to Cart
                                    </Button>
                                </>
                            )}
                        </Col>
                    </Row>
                )}

                {!loading && orderItems.length > 0 && (
                    <Row>
                        <Col lg={7} className="mb-4 mb-lg-0">
                            <Form onSubmit={handleSubmit}>
                                <Row className="mb-3">
                                    <Col>
                                        <Form.Label className="text-muted small">Name *</Form.Label>
                                        <Form.Control type="text" name="name" value={formData.name} readOnly className="bg-light border-0 py-2" style={{ backgroundColor: "#f5f5f5" }} />
                                    </Col>
                                </Row>

                                <Row className="mb-3">
                                    <Col>
                                        <Form.Label className="text-muted small">Phone Number *</Form.Label>
                                        <Form.Control type="tel" name="phoneNumber" value={formData.phoneNumber} readOnly className="bg-light border-0 py-2" style={{ backgroundColor: "#f5f5f5" }} />
                                    </Col>
                                </Row>

                                <Row className="mb-3">
                                    <Col>
                                        <Form.Label className="text-muted small">Address *</Form.Label>
                                        <Form.Control as="textarea" rows={3} name="address" value={formData.address} readOnly className="bg-light border-0 py-2" style={{ backgroundColor: "#f5f5f5", resize: "none" }} />
                                    </Col>
                                </Row>

                                <Row className="mb-4">
                                    <Col>
                                        <Form.Label className="text-muted small">Detail Address (optional)</Form.Label>
                                        <Form.Control as="textarea" rows={2} name="detailAddress" value={formData.detailAddress} readOnly className="bg-light border-0 py-2" style={{ backgroundColor: "#f5f5f5", resize: "none" }} />
                                    </Col>
                                </Row>

                                <Button variant="danger" className="fw-semibold px-4 py-2" onClick={() => setShowAddressModal(true)} disabled={addressLoading}>
                                    {addressLoading ? (
                                        <>
                                            <Spinner animation="border" size="sm" className="me-2" />
                                            Loading...
                                        </>
                                    ) : (
                                        "Edit Address"
                                    )}
                                </Button>
                            </Form>
                        </Col>

                        <Col lg={5}>
                            <div className="ps-lg-4">
                                <div className="mb-4">
                                    {orderItems.map((item) => (
                                        <div key={item.id} className="d-flex align-items-center justify-content-between mb-3">
                                            <div className="d-flex align-items-center">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    style={{
                                                        width: "54px",
                                                        height: "54px",
                                                        objectFit: "cover",
                                                        borderRadius: "4px",
                                                    }}
                                                    className="me-3"
                                                />
                                                <div>
                                                    <div className="fw-medium">{item.name}</div>
                                                    <small className="text-muted">x{item.quantity}</small>
                                                </div>
                                            </div>
                                            <div className="fw-medium">{formatPrice(item.price)}</div>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-bottom pb-3 mb-3">
                                    <div className="d-flex justify-content-between mb-2">
                                        <span>Subtotal:</span>
                                        <span className="fw-medium">{formatPrice(subtotal)}</span>
                                    </div>
                                    <div className="d-flex justify-content-between mb-2">
                                        <span>Shipping:</span>
                                        <span className="fw-medium">Free</span>
                                    </div>
                                    {appliedCoupon && discount > 0 && (
                                        <div className="d-flex justify-content-between mb-2">
                                            <span className="text-danger">Discount ({appliedCoupon.code}):</span>
                                            <span className="fw-medium text-danger">-{formatPrice(discount)}</span>
                                        </div>
                                    )}
                                    <div className="d-flex justify-content-between fs-5 fw-bold">
                                        <span>Total:</span>
                                        <span>{formatPrice(total)}</span>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <div className="mb-3">
                                        <Form.Check type="radio" name="paymentMethod" id="bank" label="Bank" value="bank" checked={paymentMethod === "bank"} onChange={(e) => setPaymentMethod(e.target.value)} />
                                        <Form.Check type="radio" name="paymentMethod" id="cash" label="Cash on delivery" value="cash" checked={paymentMethod === "cash"} onChange={(e) => setPaymentMethod(e.target.value)} className="mt-2" />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    {appliedCoupon && (
                                        <div className="alert alert-success d-flex justify-content-between align-items-center mb-3">
                                            <div>
                                                <strong>{appliedCoupon.code}</strong> applied!
                                                <br />
                                                <small className="text-muted">
                                                    {appliedCoupon.name} -{appliedCoupon.type === "percentage" ? ` ${appliedCoupon.value}% discount` : ` ${formatPrice(appliedCoupon.value)} discount`}
                                                </small>
                                            </div>
                                        </div>
                                    )}

                                    {!appliedCoupon && (
                                        <>
                                            <div className="d-flex gap-2">
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Coupon Code"
                                                    value={couponCode}
                                                    onChange={(e) => {
                                                        setCouponCode(e.target.value.toUpperCase());
                                                        setCouponError(null);
                                                        setCouponSuccess(null);
                                                    }}
                                                    className="border-2"
                                                    onKeyPress={(e) => {
                                                        if (e.key === "Enter") {
                                                            applyCoupon();
                                                        }
                                                    }}
                                                    disabled={couponLoading}
                                                />
                                                <Button variant="danger" className="fw-semibold px-4" style={{ whiteSpace: "nowrap" }} onClick={applyCoupon} disabled={couponLoading || !couponCode.trim()}>
                                                    {couponLoading ? <Spinner animation="border" size="sm" /> : "Apply Coupon"}
                                                </Button>
                                            </div>

                                            {couponSuccess && (
                                                <div className="alert alert-success mt-2 mb-0 py-2">
                                                    <small>{couponSuccess}</small>
                                                </div>
                                            )}

                                            {couponError && (
                                                <div className="alert alert-danger mt-2 mb-0 py-2">
                                                    <small>{couponError}</small>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>

                                <Button type="submit" variant="danger" size="lg" className="w-100 fw-semibold" onClick={handleSubmit}>
                                    Place Order
                                </Button>
                            </div>
                        </Col>
                    </Row>
                )}

                {/* Address Selection Modal */}
                <AddressSelectionModal show={showAddressModal} onHide={() => setShowAddressModal(false)} onAddressSelect={handleAddressSelect} />
            </Container>
        </MainLayout>
    );
};

export default CheckoutPage;
