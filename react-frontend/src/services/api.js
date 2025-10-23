import axios from "axios";

// HTTP client untuk API publik (tanpa credentials)
const publicApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
    timeout: parseInt(import.meta.env.VITE_TIMEOUT) || 10000,
});

// HTTP client untuk API yang memerlukan authentication (dengan credentials)
const authApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
    withCredentials: true, // Untuk mengirim cookie JWT
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
    timeout: parseInt(import.meta.env.VITE_TIMEOUT) || 10000,
});

// Flag untuk menghindari multiple refresh calls secara bersamaan
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

// Response interceptor untuk error handling dengan auto-refresh logic
const createAuthInterceptor = (client) => {
    return client.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;

            // Jika error 401 (Unauthorized) dan bukan request refresh atau login
            if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url.includes("/refresh") && !originalRequest.url.includes("/login")) {
                if (isRefreshing) {
                    // Jika sedang refresh, queue request ini
                    return new Promise((resolve, reject) => {
                        failedQueue.push({ resolve, reject });
                    })
                        .then(() => {
                            return client(originalRequest);
                        })
                        .catch((err) => {
                            return Promise.reject(err);
                        });
                }

                originalRequest._retry = true;
                isRefreshing = true;

                try {
                    // Coba refresh token
                    await client.post("/refresh");

                    processQueue(null);

                    // Update auth status jika refresh berhasil
                    const updateAuthStatus = () => {
                        localStorage.setItem("isLoggedIn", "true");
                        window.dispatchEvent(
                            new CustomEvent("authStatusChanged", {
                                detail: { isLoggedIn: true },
                            })
                        );
                    };
                    updateAuthStatus();

                    // Retry original request
                    return client(originalRequest);
                } catch (refreshError) {
                    processQueue(refreshError, null);

                    // Refresh gagal, logout user
                    const updateAuthStatus = () => {
                        localStorage.removeItem("isLoggedIn");
                        window.dispatchEvent(
                            new CustomEvent("authStatusChanged", {
                                detail: { isLoggedIn: false },
                            })
                        );
                    };
                    updateAuthStatus();

                    // Redirect ke halaman login jika memungkinkan
                    if (window.location.pathname !== "/login" && window.location.pathname !== "/register") {
                        window.location.href = "/login";
                    }

                    return Promise.reject(refreshError);
                } finally {
                    isRefreshing = false;
                }
            }

            // Handle error lainnya
            if (error.response) {
                // Server responded dengan error status
                throw {
                    message: error.response.data?.message || "Request failed",
                    data: error.response.data,
                    status: error.response.status,
                };
            }

            // Network error atau error lainnya
            throw {
                message: "Network error. Please check your connection.",
                data: null,
                status: null,
            };
        }
    );
};

// Response interceptor untuk publicApi (tanpa auto-refresh)
const errorHandler = (error) => {
    if (error.response) {
        // Server responded dengan error status
        throw {
            message: error.response.data?.message || "Request failed",
            data: error.response.data,
            status: error.response.status,
        };
    }

    // Network error atau error lainnya
    throw {
        message: "Network error. Please check your connection.",
        data: null,
        status: null,
    };
};

// Apply interceptor
publicApi.interceptors.response.use((response) => response, errorHandler);
createAuthInterceptor(authApi);

export { publicApi, authApi };
