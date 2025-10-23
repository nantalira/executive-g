import React, { useState, useEffect, useMemo, useCallback } from "react";
import MainLayout from "../layouts/MainLayout";
import { Container, Row, Col, Table, Button, Form, Card, Spinner, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import CartService from "../services/CartService";
import CouponService from "../services/CouponService";
import { useApiErrorHandler } from "../hooks/useApiErrorHandler";
import { formatPrice } from "../utils/formatters";
import CustomPagination from "../components/CustomPagination";

// Memoized CartItem component untuk prevent unnecessary re-renders
const CartItem = React.memo(({ item, onItemSelect, onQuantityUpdate, onRemoveItem, updateLoading, pendingUpdates }) => {
    const hasPendingUpdate = pendingUpdates.has(item.id);

    return (
        <tr key={item.id} className="border-bottom">
            <td className="py-4 px-4">
                <Form.Check type="checkbox" checked={item.selected} onChange={(e) => onItemSelect(item.id, e.target.checked)} />
            </td>
            <td className="">
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
                        <Link to={`/products/${item.product_id}`} className="fw-medium text-decoration-none text-dark d-block" style={{ cursor: "pointer" }}>
                            {item.name}
                        </Link>
                    </div>
                </div>
            </td>
            <td className="py-4 px-4">
                <div>
                    {item.hasDiscount && <div className="text-muted text-decoration-line-through small">{formatPrice(item.originalPrice)}</div>}
                    <span className={item.hasDiscount ? "text-danger fw-medium" : ""}>{formatPrice(item.price)}</span>
                </div>
            </td>
            <td className="py-4 px-4">
                <div className="d-flex align-items-center">
                    <Form.Control
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => onQuantityUpdate(item.id, parseInt(e.target.value) || 1)}
                        disabled={updateLoading || hasPendingUpdate}
                        style={{
                            width: "80px",
                            textAlign: "center",
                        }}
                        className="border-2"
                    />
                    {hasPendingUpdate && <Spinner animation="border" size="sm" className="ms-2" />}
                </div>
            </td>
            <td className="py-4 px-4">
                <span className="fw-medium">{formatPrice(item.price * item.quantity)}</span>
            </td>
            <td className="py-4 px-4">
                <Button variant="outline-danger" size="sm" onClick={() => onRemoveItem(item.id)} disabled={updateLoading}>
                    Remove
                </Button>
            </td>
        </tr>
    );
});

const CartPage = () => {
    const [loading, setLoading] = useState(true);
    const [couponCode, setCouponCode] = useState("");
    const [selectAll, setSelectAll] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [pagination, setPagination] = useState({
        current_page: 1,
        per_page: 10,
        total: 0,
        last_page: 1,
    });
    const [error, setError] = useState(null);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [pendingUpdates, setPendingUpdates] = useState(new Map());
    const [couponLoading, setCouponLoading] = useState(false);
    const [checkedCoupon, setCheckedCoupon] = useState(null);
    const [couponError, setCouponError] = useState(null);
    const [couponSuccess, setCouponSuccess] = useState(null);
    const { handleError } = useApiErrorHandler();

    // Fetch cart items from API with pagination
    const fetchCartItems = useCallback(
        async (page = 1, perPage = 10) => {
            try {
                setLoading(true);
                setError(null);

                const cartService = new CartService();
                const response = await cartService.getCartItems({ page, per_page: perPage });
                const items = response.data.data || [];
                const paginationData = response.data.pagination || {};

                // Set pagination info
                setPagination({
                    current_page: paginationData.current_page || 1,
                    per_page: paginationData.items_per_page || 10,
                    total: paginationData.total_items || 0,
                    last_page: paginationData.total_pages || 1,
                });

                // Transform API data to match component state structure
                const transformedItems = items.map((item) => {
                    const originalPrice = parseFloat(item.product?.price) || 0;
                    let discountedPrice = originalPrice;

                    // Apply product discount if exists
                    if (item.product?.discount && parseFloat(item.product.discount) > 0) {
                        discountedPrice = discountedPrice * (1 - parseFloat(item.product.discount) / 100);
                    }

                    // Apply flash sale discount if exists and active
                    if (item.product?.sale?.sale_discount && parseFloat(item.product.sale.sale_discount) > 0) {
                        discountedPrice = discountedPrice * (1 - parseFloat(item.product.sale.sale_discount) / 100);
                    }

                    const hasDiscount = discountedPrice < originalPrice;

                    // Get product image - Backend menggunakan relation 'productImages'
                    const productImage = item.product?.product_images?.[0]?.name || item.product?.productImages?.[0]?.name || "public/product.png";

                    return {
                        id: item.id,
                        name: item.product?.name || "Unknown Product",
                        price: Math.round(discountedPrice),
                        originalPrice: originalPrice,
                        hasDiscount: hasDiscount,
                        discountAmount: hasDiscount ? originalPrice - discountedPrice : 0,
                        quantity: item.quantity,
                        selected: false,
                        image: productImage,
                        product_id: item.product?.id,
                    };
                });

                setCartItems(transformedItems);

                // Don't persist coupon across page reloads - coupon is for preview only
            } catch (err) {
                const errorInfo = handleError(err);
                setError(errorInfo.message || "Failed to load cart items");
            } finally {
                setLoading(false);
            }
        },
        [handleError]
    );

    // Initial fetch
    useEffect(() => {
        fetchCartItems(1, 3);
    }, [fetchCartItems]);

    // Handle page change
    const handlePageChange = useCallback(
        (page) => {
            // Reset coupon when changing pages
            setCheckedCoupon(null);
            setCouponCode("");
            setCouponError(null);
            setCouponSuccess(null);

            fetchCartItems(page, 3);
        },
        [fetchCartItems]
    );

    // Cleanup pending updates
    useEffect(() => {
        return () => {
            pendingUpdates.forEach(({ timeoutId }) => {
                clearTimeout(timeoutId);
            });
        };
    }, [pendingUpdates]);

    // Reset coupon on component unmount
    useEffect(() => {
        return () => {
            setCheckedCoupon(null);
            setCouponCode("");
            setCouponError(null);
            setCouponSuccess(null);
        };
    }, []);

    // Memoized calculation untuk performa yang lebih baik
    const { subtotal, total, shipping, discount, finalTotal, totalSavings, originalSubtotal } = useMemo(() => {
        const selectedItems = cartItems.filter((item) => item.selected);

        const calculatedOriginalSubtotal = selectedItems.reduce((sum, item) => sum + item.originalPrice * item.quantity, 0);
        const calculatedSubtotal = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const productSavings = calculatedOriginalSubtotal - calculatedSubtotal;
        const shippingCost = 0;

        let couponDiscountAmount = 0;
        if (checkedCoupon && calculatedSubtotal >= (checkedCoupon.minimum_purchase || 0)) {
            // Prioritize using pre-calculated discount_amount from backend
            if (checkedCoupon.discount_amount !== undefined && checkedCoupon.discount_amount !== null) {
                couponDiscountAmount = parseFloat(checkedCoupon.discount_amount);
            } else {
                // Fallback: calculate discount on frontend (should match backend logic)
                if (checkedCoupon.type === "percentage") {
                    couponDiscountAmount = (calculatedSubtotal * checkedCoupon.value) / 100;
                    if (checkedCoupon.maximum_discount) {
                        couponDiscountAmount = Math.min(couponDiscountAmount, checkedCoupon.maximum_discount);
                    }
                } else {
                    couponDiscountAmount = checkedCoupon.value;
                }
                // Ensure discount doesn't exceed subtotal
                couponDiscountAmount = Math.min(couponDiscountAmount, calculatedSubtotal);
            }

            // Round to 2 decimal places
            couponDiscountAmount = Math.round(couponDiscountAmount * 100) / 100;
        }

        const finalTotalAmount = calculatedSubtotal + shippingCost - couponDiscountAmount;
        const totalSavingsAmount = productSavings + couponDiscountAmount;

        return {
            originalSubtotal: calculatedOriginalSubtotal,
            subtotal: calculatedSubtotal,
            total: calculatedSubtotal + shippingCost,
            shipping: shippingCost,
            discount: couponDiscountAmount,
            finalTotal: Math.max(finalTotalAmount, 0),
            totalSavings: totalSavingsAmount,
        };
    }, [cartItems, checkedCoupon]);

    // Handle select all checkbox
    const handleSelectAll = useCallback((checked) => {
        setSelectAll(checked);
        setCartItems((items) => items.map((item) => ({ ...item, selected: checked })));
    }, []);

    // Handle individual item selection
    const handleItemSelect = useCallback((id, checked) => {
        setCartItems((items) => {
            const updatedItems = items.map((item) => (item.id === id ? { ...item, selected: checked } : item));
            const allSelected = updatedItems.every((item) => item.selected);
            setSelectAll(allSelected);
            return updatedItems;
        });
    }, []);

    // Handle quantity change dengan debouncing
    const updateQuantity = useCallback(
        async (id, newQuantity) => {
            if (newQuantity < 1) return;

            setCartItems((items) => items.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)));

            setPendingUpdates((prev) => {
                const newMap = new Map(prev);
                if (newMap.has(id)) {
                    clearTimeout(newMap.get(id).timeoutId);
                }

                const timeoutId = setTimeout(async () => {
                    try {
                        const cartService = new CartService();
                        await cartService.updateCartItem(id, newQuantity);
                        setPendingUpdates((current) => {
                            const updated = new Map(current);
                            updated.delete(id);
                            return updated;
                        });
                    } catch (err) {
                        const errorInfo = handleError(err);
                        setError(errorInfo.message || "Failed to update item quantity");
                    }
                }, 500);

                newMap.set(id, { quantity: newQuantity, timeoutId });
                return newMap;
            });
        },
        [handleError]
    );

    // Handle remove item
    const removeItem = useCallback(
        async (id) => {
            try {
                setUpdateLoading(true);
                setPendingUpdates((prev) => {
                    const newMap = new Map(prev);
                    if (newMap.has(id)) {
                        clearTimeout(newMap.get(id).timeoutId);
                        newMap.delete(id);
                    }
                    return newMap;
                });

                const cartService = new CartService();
                await cartService.removeFromCart(id);

                // Refresh current page after removal
                await fetchCartItems(pagination.current_page, pagination.per_page);
            } catch (err) {
                const errorInfo = handleError(err);
                setError(errorInfo.message || "Failed to remove item from cart");
            } finally {
                setUpdateLoading(false);
            }
        },
        [handleError, fetchCartItems, pagination]
    );

    // Handle coupon check
    const checkCoupon = useCallback(async () => {
        if (!couponCode.trim()) {
            setCouponError("Please enter a coupon code");
            return;
        }

        if (subtotal === 0) {
            setCouponError("Please select items before checking coupon");
            return;
        }

        try {
            setCouponLoading(true);
            setCouponError(null);
            setCouponSuccess(null);

            const couponService = new CouponService();
            const response = await couponService.checkCoupon(couponCode.trim(), subtotal);

            if (response.success && response.data) {
                // Store coupon data with backend-calculated discount amount
                const couponWithDiscount = {
                    ...response.data.coupon,
                    discount_amount: response.data.discount_amount,
                };

                setCheckedCoupon(couponWithDiscount);
                const discountPreview = response.data.discount_amount;
                setCouponSuccess(`Valid coupon! You'll save ${formatPrice(discountPreview)} with this coupon`);

                // Don't save to localStorage - coupon is for preview only
            } else {
                setCouponError(response.error || "Invalid coupon code");
                setCheckedCoupon(null);
            }
        } catch (err) {
            setCouponError("Failed to check coupon. Please try again.");
            setCheckedCoupon(null);
        } finally {
            setCouponLoading(false);
        }
    }, [couponCode, subtotal]);

    // Handle coupon removal
    const removeCoupon = useCallback(() => {
        setCheckedCoupon(null);
        setCouponError(null);
        setCouponSuccess(null);
        setCouponCode("");
    }, []);

    // Handle proceed to checkout
    const handleProceedToCheckout = useCallback(() => {
        const selectedItems = cartItems.filter((item) => item.selected);
        const selectedItemIds = selectedItems.map((item) => item.id);
        localStorage.setItem("selectedCartItems", JSON.stringify(selectedItemIds));

        // Note: Coupon will not be saved to localStorage
        // User will need to re-enter coupon in checkout page
        // Cart coupon is only for preview/estimation purposes
    }, [cartItems]);

    return (
        <MainLayout>
            <Container className="py-4">
                {/* Breadcrumb */}
                <Row>
                    <Col className="mb-4">
                        <Link to="/" className="text-decoration-none">
                            <span className="text-muted">Home</span>
                        </Link>
                        <span className="mx-1 text-muted">/</span>
                        <span className="text-dark">Cart</span>
                    </Col>
                </Row>

                {/* Error Alert */}
                {error && (
                    <Row className="mb-4">
                        <Col>
                            <Alert variant="danger" onClose={() => setError(null)} dismissible>
                                {error}
                            </Alert>
                        </Col>
                    </Row>
                )}

                {/* Loading State */}
                {loading && (
                    <Row className="mb-4">
                        <Col className="text-center py-5">
                            <Spinner animation="border" variant="danger" />
                            <p className="mt-2 text-muted">Loading cart items...</p>
                        </Col>
                    </Row>
                )}

                {/* Empty Cart State */}
                {!loading && cartItems.length === 0 && pagination.total === 0 && (
                    <Row className="mb-4">
                        <Col className="text-center py-5">
                            <h5>Your cart is empty</h5>
                            <p className="text-muted">Add some items to your cart to continue shopping</p>
                            <Button as={Link} to="/" variant="danger">
                                Continue Shopping
                            </Button>
                        </Col>
                    </Row>
                )}

                {/* Cart Table */}
                {!loading && (cartItems.length > 0 || pagination.total > 0) && (
                    <Row className="mb-4">
                        <Col lg={8} className="mb-4 mb-lg-0">
                            {/* Cart Info */}
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <div>
                                    <small className="text-muted">
                                        Showing {cartItems.length} of {pagination.total} items
                                        {pagination.total > pagination.per_page && ` • Page ${pagination.current_page} of ${pagination.last_page}`}
                                    </small>
                                </div>
                            </div>

                            <div className="bg-white shadow-sm rounded">
                                <Table responsive className="mb-0">
                                    <thead className="border-bottom">
                                        <tr>
                                            <th className="py-3 px-4" style={{ width: "50px" }}>
                                                <Form.Check type="checkbox" checked={selectAll} onChange={(e) => handleSelectAll(e.target.checked)} />
                                            </th>
                                            <th className="py-3 px-4 fw-normal text-muted">Product</th>
                                            <th className="py-3 px-4 fw-normal text-muted">Price</th>
                                            <th className="py-3 px-4 fw-normal text-muted">Quantity</th>
                                            <th className="py-3 px-4 fw-normal text-muted">Subtotal</th>
                                            <th className="py-3 px-4 fw-normal text-muted">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cartItems.map((item) => (
                                            <CartItem key={item.id} item={item} onItemSelect={handleItemSelect} onQuantityUpdate={updateQuantity} onRemoveItem={removeItem} updateLoading={updateLoading} pendingUpdates={pendingUpdates} />
                                        ))}
                                    </tbody>
                                </Table>
                            </div>

                            {/* Pagination */}
                            <CustomPagination currentPage={pagination.current_page} totalPages={pagination.last_page} onPageChange={handlePageChange} />
                        </Col>

                        <Col lg={4}>
                            {/* Cart Total Card */}
                            <Card className="border-2 mb-4">
                                <Card.Header className="bg-white border-0 py-3">
                                    <h5 className="mb-0 fw-bold">Cart Total</h5>
                                </Card.Header>
                                <Card.Body className="py-3">
                                    <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
                                        <span className="text-muted">Subtotal:</span>
                                        <span className="fw-medium">{formatPrice(subtotal)}</span>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
                                        <span className="text-muted">Shipping:</span>
                                        <span className="fw-medium text-success">{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
                                    </div>
                                    {checkedCoupon && discount > 0 && (
                                        <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
                                            <span className="text-danger">Discount :</span>
                                            <span className="fw-medium text-danger">-{formatPrice(discount)}</span>
                                        </div>
                                    )}
                                    <div className="d-flex justify-content-between align-items-center py-3 fw-bold fs-5">
                                        <span>Total:</span>
                                        <span className="text-danger">{formatPrice(checkedCoupon && discount > 0 ? finalTotal : total)}</span>
                                    </div>
                                    {subtotal === 0 && cartItems.length > 0 && <small className="text-muted d-block mb-2 text-center">Please select items to proceed</small>}
                                    {checkedCoupon && subtotal > 0 && subtotal < checkedCoupon.minimum_purchase && (
                                        <small className="text-warning d-block mb-2 text-center">Add {formatPrice(checkedCoupon.minimum_purchase - subtotal)} more to use this coupon</small>
                                    )}
                                    <Button as={Link} to="/checkout" variant="danger" size="lg" className="w-100 mt-2 fw-semibold text-decoration-none" disabled={subtotal === 0} onClick={handleProceedToCheckout}>
                                        Process to Checkout
                                    </Button>
                                </Card.Body>
                            </Card>

                            {/* Coupon Code Section */}
                            <Card className="border-2">
                                <Card.Header className="bg-white border-0 py-3">
                                    <h6 className="mb-0 fw-bold">Have a Coupon?</h6>
                                </Card.Header>
                                <Card.Body className="py-3">
                                    {checkedCoupon && (
                                        <div className="alert alert-info d-flex justify-content-between align-items-center mb-3">
                                            <div>
                                                <strong>{checkedCoupon.code}</strong> - Valid Coupon
                                                <br />
                                                <small className="text-muted">
                                                    {checkedCoupon.type === "percentage" ? `${checkedCoupon.value}% discount` : `${formatPrice(checkedCoupon.value)} discount`}
                                                    {checkedCoupon.minimum_purchase > 0 && ` (min. purchase: ${formatPrice(checkedCoupon.minimum_purchase)})`}
                                                </small>
                                            </div>
                                            <Button variant="outline-secondary" size="sm" onClick={removeCoupon}>
                                                Remove
                                            </Button>
                                        </div>
                                    )}

                                    <div className="d-flex flex-column flex-sm-row gap-2">
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter coupon code"
                                            value={couponCode}
                                            onChange={(e) => {
                                                setCouponCode(e.target.value.toUpperCase());
                                                setCouponError(null);
                                                setCouponSuccess(null);
                                            }}
                                            className="border-2"
                                            style={{ flexGrow: 1 }}
                                            onKeyPress={(e) => {
                                                if (e.key === "Enter") {
                                                    checkCoupon();
                                                }
                                            }}
                                            disabled={couponLoading}
                                        />
                                        <Button variant="danger" className="fw-semibold px-4" style={{ whiteSpace: "nowrap" }} onClick={checkCoupon} disabled={couponLoading || !couponCode.trim() || subtotal === 0}>
                                            {couponLoading ? <Spinner animation="border" size="sm" /> : "Check Coupon"}
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

                                    <small className="text-muted mt-2 d-block">Check your coupon to validate if it can be used. Coupon discount will be applied during checkout.</small>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                )}
            </Container>
        </MainLayout>
    );
};

export default CartPage;
