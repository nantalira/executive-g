import { authApi } from "./api";

class AddressService {
    /**
     * Get all addresses for authenticated user
     */
    async getAddresses() {
        const response = await authApi.get(`/addresses`);
        return response.data;
    }

    /**
     * Add new address for authenticated user
     */
    async addAddress(addressData) {
        const response = await authApi.post(`/addresses`, addressData);
        return response.data;
    }

    /**
     * Update address
     */
    async updateAddress(addressId, addressData) {
        const response = await authApi.put(`/addresses/${addressId}`, addressData);
        return response.data;
    }

    /**
     * Delete address
     */
    async deleteAddress(addressId) {
        const response = await authApi.delete(`/addresses/${addressId}`);
        return response.data;
    }

    /**
     * Get pinned address for authenticated user
     */
    async getPinnedAddress() {
        const response = await authApi.get(`/addresses/pinned`);
        return response.data;
    }

    /**
     * Get specific address by ID
     */
    async getAddress(addressId) {
        const response = await authApi.get(`/addresses/${addressId}`);
        return response.data;
    }
}

export default AddressService;
