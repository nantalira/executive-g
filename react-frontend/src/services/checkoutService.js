import { authApi } from "./api";

const checkoutService = {
    /**
     * Create direct checkout session from product detail
     */
    async createDirectCheckout(productId, quantity = 1, variantId = null) {
        try {
            const response = await authApi.post("/checkout/direct", {
                product_id: productId,
                quantity: quantity,
                variant_id: variantId,
            });

            return {
                success: true,
                message: response.data.message,
                data: response.data.data,
            };
        } catch (error) {
            let errorMessage = "Failed to create checkout session";

            if (error.response?.data?.errors?.message) {
                errorMessage = error.response.data.errors.message[0];
            } else if (error.response?.data?.errors) {
                const validationErrors = error.response.data.errors;
                const firstError = Object.values(validationErrors)[0];
                errorMessage = Array.isArray(firstError) ? firstError[0] : firstError;
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }

            return {
                success: false,
                error: errorMessage,
                statusCode: error.response?.status,
            };
        }
    },

    /**
     * Get checkout session data
     */
    async getCheckoutSession(sessionId) {
        try {
            const response = await authApi.get(`/checkout/session/${sessionId}`);

            return {
                success: true,
                data: response.data.data,
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || "Failed to get checkout session",
                statusCode: error.response?.status,
            };
        }
    },

    /**
     * Place order from checkout session
     */
    async placeOrder(checkoutData) {
        try {
            const response = await authApi.post("/orders", checkoutData);

            return {
                success: true,
                message: response.data.message,
                data: response.data.data,
            };
        } catch (error) {
            let errorMessage = "Failed to place order";

            if (error.response?.data?.errors?.message) {
                errorMessage = error.response.data.errors.message[0];
            } else if (error.response?.data?.errors) {
                const validationErrors = error.response.data.errors;
                const firstError = Object.values(validationErrors)[0];
                errorMessage = Array.isArray(firstError) ? firstError[0] : firstError;
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }

            return {
                success: false,
                error: errorMessage,
                statusCode: error.response?.status,
            };
        }
    },
};

export default checkoutService;
