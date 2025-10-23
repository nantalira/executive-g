// src/services/categoryService.js
import { publicApi } from "./api";

class CategoryService {
    /**
     * Get all categories
     * @returns {Promise} API response
     */
    async getCategories() {
        const response = await publicApi.get("/categories");
        return response.data;
    }
}

export default new CategoryService();
