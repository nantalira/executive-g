import { publicApi } from "./api";

class SaleService {
    /**
     * Get active flash sale with products for homepage
     * @param {Object} params - Query parameters
     * @returns {Promise} API response
     */
    async getActiveFlashSaleWithProducts(params = {}) {
        const response = await publicApi.get("/flash-sales/product", { params });
        return response;
    }

    /**
     * Get flash sales schedule (active and upcoming) for filter card
     * @returns {Promise} API response
     */
    async getFlashSalesSchedule() {
        const response = await publicApi.get("/flash-sales/schedule");
        return response;
    }

    /**
     * @deprecated Use getActiveFlashSaleWithProducts() instead
     * Legacy method for backward compatibility
     */
    async getSales() {
        return this.getActiveFlashSaleWithProducts();
    }
}

export default new SaleService();
