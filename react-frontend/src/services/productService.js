import { publicApi } from "./api";

class ProductService {
    /**
     * Get products with optional filters
     **/
    async getProducts(filters = {}) {
        const params = new URLSearchParams();
        Object.keys(filters).forEach((key) => {
            params.append(key, filters[key]);
        });

        const response = await publicApi.get(`/products?${params}`);
        return response;
    }

    /**
     * Get single product by ID
     **/
    async getProductById(productId) {
        const response = await publicApi.get(`/products/${productId}`);
        return response;
    }

    /**
     * Get product reviews by product ID with pagination
     **/
    async getProductReviews(productId, params = {}) {
        const queryParams = new URLSearchParams();
        Object.keys(params).forEach((key) => {
            if (params[key] !== undefined && params[key] !== null) {
                queryParams.append(key, params[key]);
            }
        });

        const queryString = queryParams.toString();
        const url = queryString ? `/reviews/${productId}?${queryString}` : `/reviews/${productId}`;

        const response = await publicApi.get(url);
        return response;
    }
}

export default new ProductService();
