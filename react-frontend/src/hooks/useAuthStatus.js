import { useState, useEffect } from "react";

/**
 * Hook untuk mengecek login status
 * Karena cookie httpOnly, kita gunakan localStorage untuk tracking status
 * dan periodically check dengan API call
 */
export const useAuthStatus = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check localStorage first untuk initial state
        const storedAuthStatus = localStorage.getItem("isLoggedIn");
        if (storedAuthStatus === "true") {
            setIsLoggedIn(true);
        }
        setLoading(false);

        // Listen untuk custom event ketika auth status berubah
        const handleAuthChange = (event) => {
            setIsLoggedIn(event.detail.isLoggedIn);
        };

        window.addEventListener("authStatusChanged", handleAuthChange);

        return () => {
            window.removeEventListener("authStatusChanged", handleAuthChange);
        };
    }, []);

    const updateAuthStatus = (status) => {
        setIsLoggedIn(status);

        // Update localStorage
        if (status) {
            localStorage.setItem("isLoggedIn", "true");
        } else {
            localStorage.removeItem("isLoggedIn");
        }

        // Dispatch custom event untuk update components lain
        window.dispatchEvent(
            new CustomEvent("authStatusChanged", {
                detail: { isLoggedIn: status },
            })
        );
    };

    const refreshAuthStatus = () => {
        // Force refresh dengan check localStorage
        const storedAuthStatus = localStorage.getItem("isLoggedIn");
        setIsLoggedIn(storedAuthStatus === "true");
    };

    return {
        isLoggedIn,
        loading,
        updateAuthStatus,
        refreshAuthStatus,
    };
};
