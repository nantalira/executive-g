// src/contexts/CategoryContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import CategoryService from "../services/CategoryService";

const CategoryContext = createContext();

export const CategoryProvider = ({ children }) => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            setError(null);
            const categoryService = new CategoryService();
            const response = await categoryService.getCategories(); // Ambil semua categories
            setCategories(response.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
            setError(error);
            // Fallback ke data static jika API gagal
            setCategories([
                { id: 1, name: "Phones", icon: "Phone" },
                { id: 2, name: "Computers", icon: "Laptop" },
                { id: 3, name: "SmartWatch", icon: "Watch" },
                { id: 4, name: "Camera", icon: "Camera" },
                { id: 5, name: "HeadPhones", icon: "Headset" },
                { id: 6, name: "Gaming", icon: "Joystick" },
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const value = {
        categories,
        loading,
        error,
        refetch: fetchCategories,
        // Helper functions
        getTopCategories: (limit = 6) => categories.slice(0, limit),
        getCategoryById: (id) => categories.find((cat) => cat.id === id),
        getCategoryByName: (name) => categories.find((cat) => cat.name.toLowerCase() === name.toLowerCase()),
    };

    return <CategoryContext.Provider value={value}>{children}</CategoryContext.Provider>;
};

// Custom hook untuk menggunakan CategoryContext
export const useCategories = () => {
    const context = useContext(CategoryContext);
    if (context === undefined) {
        throw new Error("useCategories must be used within a CategoryProvider");
    }
    return context;
};
