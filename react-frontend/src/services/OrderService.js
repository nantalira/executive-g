import { authApi } from "./api";

class OrderService {
    /**
     * Create a new order
     * @param {Object} orderData - Order data from frontend
     * @param {Object} orderData.formData - Form data from checkout
     * @param {string} orderData.paymentMethod - Payment method selected
     * @param {Array} orderData.orderItems - Items to order
     * @param {Object} orderData.appliedCoupon - Applied coupon data
     * @param {Object} orderData.totals - Calculated totals
     * @returns {Promise} API response
     */
    static async createOrder(orderData) {
        // Map frontend data structure to API requirements
        const apiData = {
            // Map cart items to expected format
            cart_items: orderData.orderItems.map((item) => ({
                product_id: item.product_id || item.id,
                quantity: item.quantity,
            })),

            // Coupon discount in cents (if coupon applied)
            coupon_discount: orderData.appliedCoupon ? Math.round(orderData.appliedCoupon.discount_amount * 100) : 0,

            // Map form data fields to API expected field names
            full_name: orderData.formData.name,
            phone_number: orderData.formData.phoneNumber,
            address: orderData.formData.address,
            detail_address: orderData.formData.detailAddress || null,

            // Location fields (should be selected from address)
            province: orderData.formData.province,
            district: orderData.formData.district,
            sub_district: orderData.formData.sub_district,
            village: orderData.formData.village,
            postal_code: orderData.formData.postal_code,

            // Payment method
            payment_method: orderData.paymentMethod,
        };

        // Debug log to check data being sent
        console.log("OrderService - API Data being sent:", apiData);
        console.log("OrderService - Form Data received:", orderData.formData);

        return authApi.post("/orders", apiData);
    }

    /**
     * Get user orders filtered by status
     * @param {number|string} status - Order status (0=process, 1=deliveries, 2=delivered)
     * @returns {Promise} API response
     */
    static async getUserOrders(status = null) {
        const params = status !== null ? { status } : {};
        console.log("OrderService - getUserOrders called with status:", status, "params:", params);
        const response = await authApi.get("/orders", { params });
        console.log("OrderService - getUserOrders response:", response);
        return response;
    }

    /**
     * Get specific order details
     * @param {number} orderId - Order ID
     * @returns {Promise} API response
     */
    static async getOrderDetails(orderId) {
        return authApi.get(`/orders/${orderId}`);
    }

    /**
     * Map status from frontend format to API format
     * @param {string} frontendStatus - Frontend status (process, deliveries, delivered)
     * @returns {number} API status number
     */
    static mapStatusToAPI(frontendStatus) {
        const statusMap = {
            process: 0, // pending/process
            deliveries: 1, // shipped/deliveries
            delivered: 2, // delivered
        };
        return statusMap[frontendStatus] ?? null;
    }

    /**
     * Map status from API format to frontend format
     * @param {number} apiStatus - API status number
     * @returns {string} Frontend status string
     */
    static mapStatusFromAPI(apiStatus) {
        const statusMap = {
            0: "process",
            1: "deliveries",
            2: "delivered",
        };
        return statusMap[apiStatus] ?? "unknown";
    }
}

export default OrderService;
