import { useState, useCallback } from "react";
import { toast } from "react-toastify";

/**
 * Custom hook untuk menangani error dari API axios
 * Prioritas error handling:
 * 1. err.data.message[0] - Error message dari API
 * 2. err.data.message.field[0] - Validation error per field
 * 3. err.message - Error message dari service/axios
 * 4. Default error message - Fallback error
 */
export const useApiErrorHandler = () => {
    const [validationErrors, setValidationErrors] = useState({});

    /**
     * Mengextract pesan error utama dari response
     */
    const extractMainErrorMessage = useCallback((err) => {
        // Prioritas 1: err.data.errors.message[0] (Main API error message)
        if (err.data?.errors?.message && Array.isArray(err.data.errors.message) && err.data.errors.message.length > 0) {
            return err.data.errors.message[0];
        }

        // Prioritas 2: err.data.message (API error message string)
        if (err.data?.message && typeof err.data.message === "string") {
            return err.data.message;
        }

        // Prioritas 3: err.message (Service/axios error)
        if (err.message) {
            return err.message;
        }

        // Fallback berdasarkan status code
        if (err.status) {
            switch (err.status) {
                case 400:
                    return "Permintaan tidak valid. Periksa data yang Anda masukkan.";
                case 401:
                    return "Kredensial tidak valid. Periksa email dan password Anda.";
                case 403:
                    return "Anda tidak memiliki izin untuk mengakses resource ini.";
                case 404:
                    return "Data yang diminta tidak ditemukan.";
                case 422:
                    return "Data yang dikirim tidak valid.";
                case 500:
                    return "Terjadi kesalahan pada server. Silakan coba lagi nanti.";
                case 502:
                case 503:
                    return "Layanan sedang tidak tersedia. Silakan coba lagi nanti.";
                default:
                    return "Terjadi kesalahan yang tidak dikenal.";
            }
        }

        // Default fallback
        return "Terjadi kesalahan. Silakan coba lagi.";
    }, []);

    /**
     * Mengextract validation errors dari response
     */
    const extractValidationErrors = useCallback((err) => {
        const validationErrs = {};

        // Cek apakah ada err.data.message dengan struktur field validation
        if (err.data?.message && typeof err.data.message === "object" && !Array.isArray(err.data.message)) {
            // Format: { email: ["Error message"], password: ["Error message"] }
            Object.keys(err.data.message).forEach((field) => {
                const fieldErrors = err.data.message[field];
                if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
                    validationErrs[field] = fieldErrors[0]; // Ambil error pertama
                } else if (typeof fieldErrors === "string") {
                    validationErrs[field] = fieldErrors;
                }
            });
        }

        // Cek format Laravel validation errors (err.data.errors)
        // Tapi skip field 'message' karena itu untuk main error
        if (err.data?.errors && typeof err.data.errors === "object") {
            Object.keys(err.data.errors).forEach((field) => {
                // Skip 'message' field karena itu untuk main error
                if (field === "message") return;

                const fieldErrors = err.data.errors[field];
                if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
                    validationErrs[field] = fieldErrors[0]; // Ambil error pertama
                } else if (typeof fieldErrors === "string") {
                    validationErrs[field] = fieldErrors;
                }
            });
        }

        return validationErrs;
    }, []);

    /**
     * Main function untuk handle error
     */
    const handleError = useCallback(
        (err, defaultMessage = "Terjadi kesalahan. Silakan coba lagi.") => {
            console.log("🚨 Error Details:", err); // Debug log

            // Extract validation errors
            const validationErrs = extractValidationErrors(err);
            setValidationErrors(validationErrs);

            // Extract main error message
            const mainErrorMessage = extractMainErrorMessage(err) || defaultMessage;

            // Check if this is a main error (has err.data.errors.message) or validation error
            const hasMainError = err.data?.errors?.message && Array.isArray(err.data.errors.message);

            // Show toast if:
            // 1. Ada main error (err.data.errors.message array)
            // 2. Tidak ada validation errors (berarti pure main error)
            // 3. Status bukan 404 (Not Found)
            if ((hasMainError || Object.keys(validationErrs).length === 0) && err.status !== 404) {
                toast.error(mainErrorMessage, {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            } // Return processed error untuk keperluan lain
            return {
                message: mainErrorMessage,
                validationErrors: validationErrs,
                status: err.status || null,
                data: err.data || null,
            };
        },
        [extractMainErrorMessage, extractValidationErrors]
    );

    /**
     * Clear validation errors
     */
    const clearValidationErrors = useCallback(() => {
        setValidationErrors({});
    }, []);

    /**
     * Clear error tertentu
     */
    const clearFieldError = useCallback((fieldName) => {
        setValidationErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[fieldName];
            return newErrors;
        });
    }, []);

    /**
     * Check apakah ada validation error untuk field tertentu
     */
    const hasFieldError = useCallback(
        (fieldName) => {
            return Boolean(validationErrors[fieldName]);
        },
        [validationErrors]
    );

    /**
     * Get validation error untuk field tertentu
     */
    const getFieldError = useCallback(
        (fieldName) => {
            return validationErrors[fieldName] || "";
        },
        [validationErrors]
    );

    /**
     * Show success toast
     */
    const showSuccess = useCallback((message) => {
        toast.success(message, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
    }, []);

    return {
        validationErrors,
        handleError,
        clearValidationErrors,
        clearFieldError,
        hasFieldError,
        getFieldError,
        showSuccess,
        setValidationErrors,
    };
};

export default useApiErrorHandler;
