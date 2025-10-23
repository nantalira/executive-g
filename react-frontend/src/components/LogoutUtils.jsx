import React from "react";
import { AuthService } from "../services";

/**
 * Simple logout function that can be used anywhere
 */
export const handleLogout = async () => {
    try {
        const authService = new AuthService();
        await authService.logout();
        console.log("Logout successful");

        // Clear auth status
        localStorage.removeItem("isLoggedIn");

        // Dispatch event untuk update components
        window.dispatchEvent(
            new CustomEvent("authStatusChanged", {
                detail: { isLoggedIn: false },
            })
        );

        // Redirect ke login
        window.location.href = "/login";
    } catch (error) {
        console.error("Logout error:", error);

        // Clear auth status even if API call fails
        localStorage.removeItem("isLoggedIn");
        window.dispatchEvent(
            new CustomEvent("authStatusChanged", {
                detail: { isLoggedIn: false },
            })
        );

        // Tetap redirect meskipun error
        window.location.href = "/login";
    }
};

/**
 * Simple logout button component
 */
export const LogoutButton = ({ children = "Logout", className = "btn btn-outline-danger btn-sm" }) => {
    return (
        <button className={className} onClick={handleLogout}>
            {children}
        </button>
    );
};
