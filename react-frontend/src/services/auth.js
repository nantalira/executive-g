import { publicApi, authApi } from "./api";

class AuthService {
    /**
     * Login user - menggunakan authApi karena akan set cookie
     */
    async login(credentials) {
        const response = await authApi.post("/login", credentials);
        return response.data;
    }

    /**
     * Register user - menggunakan publicApi karena tidak perlu credentials
     */
    async register(userData) {
        const response = await publicApi.post("/register", userData);
        return response.data;
    }

    /**
     * Logout user - menggunakan authApi karena perlu cookie untuk logout
     */
    async logout() {
        const response = await authApi.post("/logout");
        return response.data;
    }

    /**
     * Refresh token - menggunakan authApi karena perlu cookie
     */
    async refresh() {
        try {
            const response = await publicApi.post("/refresh");
            return response.data;
        } catch (error) {
            // Jika refresh gagal, kemungkinan token sudah tidak valid
            throw error;
        }
    }

    /**
     * Get user profile - untuk testing authenticated routes
     */
    async getProfile() {
        const response = await authApi.get("/profile");
        return response.data;
    }
}

export default new AuthService();
