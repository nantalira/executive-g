import { authApi } from "./api";

class CartService {
    /**
     * Get all cart items for authenticated user with pagination
     */
    async getCartItems(params = {}) {
        const queryParams = new URLSearchParams(params).toString();
        const url = queryParams ? `/carts?${queryParams}` : "/carts";
        const response = await authApi.get(url);
        return response;
    }

    /**
     * Add product to cart
     */
    async addToCart(productId, quantity = 1) {
        const response = await authApi.post("/carts", {
            product_id: productId,
            quantity: quantity,
        });
        return response;
    }

    /**
     * Update cart item quantity
     */
    async updateCartItem(cartId, quantity) {
        const response = await authApi.put(`/carts/${cartId}`, {
            quantity: quantity,
        });
        return response;
    }

    /**
     * Remove item from cart
     */
    async removeFromCart(cartId) {
        const response = await authApi.delete(`/carts/${cartId}`);
        return response;
    }
}

export default new CartService();
