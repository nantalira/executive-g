import { authApi } from "./api";

class ReviewService {
    /**
     * Create a new review for a product
     * @param {Object} reviewData - Review data from frontend
     * @param {number} reviewData.product_id - Product ID to review
     * @param {number} reviewData.rating - Rating (1-5)
     * @param {string} reviewData.message - Review message/comment
     * @param {File|null} reviewData.picture - Review image file (optional)
     * @returns {Promise} API response
     */
    static async createReview(reviewData) {
        // Map frontend data structure to API requirements
        const apiData = {
            product_id: reviewData.product_id,
            rating: reviewData.rating,
            comment: reviewData.message, // Map 'message' to 'comment' for API
        };

        // Handle image upload if present
        if (reviewData.picture) {
            // Create FormData for file upload
            const formData = new FormData();

            // Append all fields
            Object.keys(apiData).forEach((key) => {
                formData.append(key, apiData[key]);
            });

            // Append image file
            formData.append("image", reviewData.picture);

            return authApi.post("/reviews", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
        } else {
            // Send as JSON if no image
            return authApi.post("/reviews", apiData);
        }
    }

    /**
     * Get reviews for a specific product
     * @param {number} productId - Product ID
     * @param {Object} options - Query options
     * @param {number} options.page - Page number
     * @param {number} options.items_per_page - Items per page
     * @returns {Promise} API response
     */
    static async getProductReviews(productId, options = {}) {
        const params = {
            items_per_page: options.items_per_page || 15,
            page: options.page || 1,
        };

        return authApi.get(`/reviews/${productId}`, { params });
    }

    /**
     * Validate review data before submission
     * @param {Object} reviewData - Review data to validate
     * @returns {Object} Validation result
     */
    static validateReviewData(reviewData) {
        const errors = {};

        if (!reviewData.product_id) {
            errors.product_id = ["Product ID is required"];
        }

        if (!reviewData.rating || reviewData.rating < 1 || reviewData.rating > 5) {
            errors.rating = ["Rating must be between 1 and 5"];
        }

        if (!reviewData.message || reviewData.message.trim().length === 0) {
            errors.comment = ["Review message is required"];
        }

        // Validate image file if present
        if (reviewData.picture) {
            const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
            const maxSize = 5 * 1024 * 1024; // 5MB

            if (!allowedTypes.includes(reviewData.picture.type)) {
                errors.image = ["Image must be JPEG, PNG, or GIF format"];
            }

            if (reviewData.picture.size > maxSize) {
                errors.image = errors.image || [];
                errors.image.push("Image size must be less than 5MB");
            }
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors,
        };
    }

    /**
     * Validate review data before submission (alias for validateReviewData)
     * @param {Object} reviewData - Review data to validate
     * @returns {Object} Validation result
     */
    static validateReview(reviewData) {
        return this.validateReviewData(reviewData);
    }

    /**
     * Format review data for display
     * @param {Object} review - Raw review data from API
     * @returns {Object} Formatted review data
     */
    static formatReviewForDisplay(review) {
        return {
            id: review.id,
            productId: review.product_id,
            userId: review.user_id,
            rating: review.rating,
            comment: review.comment,
            image: review.image,
            createdAt: new Date(review.created_at),
            user: review.user
                ? {
                      id: review.user.id,
                      name: review.user.name,
                  }
                : null,
        };
    }
}

export default ReviewService;
