<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Rating;
use App\Models\Product;
use App\Helpers\ResponseHelper;
use Exception;
use Illuminate\Http\JsonResponse;

class RatingController extends Controller
{
    /**
     * Get all reviews of a product
     *
     * @param int $productId
     * @return JsonResponse
     */
    public function getProductReviews(int $productId): JsonResponse
    {
        try {
            if (!is_numeric($productId)) {
                return ResponseHelper::fieldError([
                    'product_id' => ['Product ID must be a number']
                ]);
            }

            $product = Product::find($productId);

            if (!$product) {
                return ResponseHelper::notFound('Product not found');
            }

            $reviews = Rating::with(['user:id,name'])
                ->where('product_id', $productId)
                ->select('id', 'product_id', 'user_id', 'rating', 'comment', 'created_at', 'updated_at')
                ->orderBy('created_at', 'desc')
                ->get();

            // Calculate average rating
            $averageRating = $reviews->avg('rating');
            $totalReviews = $reviews->count();

            $responseData = [
                'reviews' => $reviews,
                'average_rating' => round($averageRating, 2),
                'total_reviews' => $totalReviews
            ];

            return ResponseHelper::successWithData('Product reviews retrieved successfully', $responseData);
        } catch (Exception $e) {
            return ResponseHelper::error('Internal server error');
        }
    }
}
