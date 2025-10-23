import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check localStorage untuk initial state
        const storedAuthStatus = localStorage.getItem("isLoggedIn");
        const storedUser = localStorage.getItem("user");

        if (storedAuthStatus === "true") {
            setIsAuthenticated(true);
            if (storedUser) {
                try {
                    setUser(JSON.parse(storedUser));
                } catch (error) {
                    console.error("Error parsing stored user:", error);
                    localStorage.removeItem("user");
                }
            }
        }
        setLoading(false);

        // Listen untuk custom event ketika auth status berubah
        const handleAuthChange = (event) => {
            setIsAuthenticated(event.detail.isLoggedIn);
            if (!event.detail.isLoggedIn) {
                setUser(null);
                localStorage.removeItem("user");
            }
        };

        window.addEventListener("authStatusChanged", handleAuthChange);

        return () => {
            window.removeEventListener("authStatusChanged", handleAuthChange);
        };
    }, []);

    const login = (userData) => {
        setUser(userData);
        setIsAuthenticated(true);

        // Update localStorage
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("user", JSON.stringify(userData));

        // Dispatch custom event
        window.dispatchEvent(
            new CustomEvent("authStatusChanged", {
                detail: { isLoggedIn: true },
            })
        );
    };

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);

        // Clear localStorage
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("user");

        // Dispatch custom event
        window.dispatchEvent(
            new CustomEvent("authStatusChanged", {
                detail: { isLoggedIn: false },
            })
        );
    };

    const updateAuthStatus = (status) => {
        setIsAuthenticated(status);

        if (status) {
            localStorage.setItem("isLoggedIn", "true");
        } else {
            setUser(null);
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("user");
        }

        // Dispatch custom event
        window.dispatchEvent(
            new CustomEvent("authStatusChanged", {
                detail: { isLoggedIn: status },
            })
        );
    };

    const value = {
        user,
        isAuthenticated,
        loading,
        login,
        logout,
        updateAuthStatus,
        setUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export { AuthContext };
