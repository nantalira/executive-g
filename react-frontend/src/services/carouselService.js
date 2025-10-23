// src/services/CarouselService.js
import { publicApi } from "./api";

class CarouselService {
    /**
     * Get carousels with optional filters
     * @param {Object} filters - Filter parameters (newArrival, items_per_page)
     */
    async getCarousels(filters = {}) {
        const params = new URLSearchParams();

        // Convert filters to snake_case for API consistency
        if (filters.newArrival !== undefined) {
            params.append("new_arrival", filters.newArrival);
        }
        if (filters.items_per_page) {
            params.append("items_per_page", filters.items_per_page);
        }

        const response = await publicApi.get(`/carousels?${params}`);
        return response;
    }

    /**
     * Get single carousel by ID
     * @param {number} id - Carousel ID
     */
    async getCarouselById(id) {
        const response = await publicApi.get(`/carousels/${id}`);
        return response;
    }
}

export default new CarouselService();
