import { publicApi, authApi } from "./api";

const couponService = {
    /**
     * Check/validate coupon code and calculate discount
     * Public endpoint - no authentication required
     */
    async checkCoupon(couponCode, totalPrice) {
        try {
            const response = await publicApi.get(`/coupons/check/${couponCode}`, {
                params: {
                    total_price: totalPrice,
                },
            });

            return {
                success: true,
                message: response.data.message,
                data: response.data.data,
            };
        } catch (error) {
            // Handle different error response structures
            let errorMessage = "Failed to validate coupon";

            if (error.response?.data?.errors?.message) {
                // Handle Laravel validation errors: {"errors":{"message":["error message"]}}
                errorMessage = Array.isArray(error.response.data.errors.message) ? error.response.data.errors.message[0] : error.response.data.errors.message;
            } else if (error.response?.data?.message) {
                // Handle direct message: {"message": "error message"}
                errorMessage = error.response.data.message;
            } else if (error.response?.data?.error) {
                // Handle error field: {"error": "error message"}
                errorMessage = error.response.data.error;
            }

            return {
                success: false,
                error: errorMessage,
                statusCode: error.response?.status,
            };
        }
    },

    /**
     * Apply coupon to cart/order
     * Requires authentication
     */
    async applyCoupon(couponCode, totalPrice, cartItems = null) {
        try {
            const requestData = {
                coupon_code: couponCode,
                total_price: totalPrice,
            };

            // Only include cart_items if provided
            if (cartItems && cartItems.length > 0) {
                requestData.cart_items = cartItems;
            }

            const response = await authApi.post("/coupons/apply", requestData);

            return {
                success: true,
                message: response.data.message,
                data: response.data.data,
            };
        } catch (error) {
            // Handle different error response structures
            let errorMessage = "Failed to apply coupon";

            if (error.response?.data?.errors?.message) {
                // Handle Laravel validation errors: {"errors":{"message":["error message"]}}
                errorMessage = Array.isArray(error.response.data.errors.message) ? error.response.data.errors.message[0] : error.response.data.errors.message;
            } else if (error.response?.data?.errors) {
                // Handle other validation errors
                const validationErrors = error.response.data.errors;
                const firstError = Object.values(validationErrors)[0];
                errorMessage = Array.isArray(firstError) ? firstError[0] : firstError;
            } else if (error.response?.data?.message) {
                // Handle direct message: {"message": "error message"}
                errorMessage = error.response.data.message;
            } else if (error.response?.data?.error) {
                // Handle error field: {"error": "error message"}
                errorMessage = error.response.data.error;
            }

            return {
                success: false,
                error: errorMessage,
                statusCode: error.response?.status,
            };
        }
    },

    /**
     * Format coupon display for UI
     */
    formatCouponDisplay(coupon) {
        if (!coupon) return "";

        if (coupon.type === "percentage") {
            return `${coupon.value}% OFF`;
        } else {
            return `Rp${this.formatPrice(coupon.value)} OFF`;
        }
    },

    /**
     * Format price display
     */
    formatPrice(amount) {
        return new Intl.NumberFormat("id-ID").format(amount);
    },

    /**
     * Calculate discount preview
     */
    calculateDiscountPreview(coupon, totalPrice) {
        if (!coupon || totalPrice < coupon.minimum_purchase) {
            return {
                discount: 0,
                finalTotal: totalPrice,
                eligible: false,
                minimumRequired: coupon?.minimum_purchase || 0,
            };
        }

        let discountAmount = 0;

        if (coupon.type === "percentage") {
            discountAmount = (totalPrice * coupon.value) / 100;
            if (coupon.maximum_discount) {
                discountAmount = Math.min(discountAmount, coupon.maximum_discount);
            }
        } else {
            discountAmount = Math.min(coupon.value, totalPrice);
        }

        return {
            discount: discountAmount,
            finalTotal: totalPrice - discountAmount,
            eligible: true,
            savings: discountAmount,
        };
    },
};

export default couponService;
