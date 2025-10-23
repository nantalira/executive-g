<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Rating;
use App\Models\Product;
use App\Models\Order;
use App\Helpers\ResponseHelper;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Tymon\JWTAuth\Facades\JWTAuth;

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

            // Get reviews with pagination
            $perPage = request()->query('items_per_page', 15);

            $reviews = Rating::with(['user:id,name'])
                ->where('product_id', $productId)
                ->select('id', 'product_id', 'user_id', 'rating', 'comment', 'image', 'created_at')
                ->orderBy('created_at', 'desc')
                ->paginate($perPage);

            return ResponseHelper::successWithPagination('Reviews fetched successfully', $reviews);
        } catch (Exception $e) {
            return ResponseHelper::error('Internal server error');
        }
    }

    /**
     * Create a new review/rating
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        try {
            // Get token from cookie
            $token = $request->cookie('tokenjwt');
            if (!$token) {
                return ResponseHelper::unauthorized('No token provided');
            }

            // Set the token for JWTAuth
            JWTAuth::setToken($token);
            $user = JWTAuth::authenticate();

            if (!$user) {
                return ResponseHelper::unauthorized('User not found');
            }

            // Validate request data
            $validator = Validator::make($request->all(), [
                'product_id' => 'required|integer|exists:products,id',
                'rating' => 'required|integer|min:1|max:5',
                'comment' => 'required|string|max:1000',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120' // 5MB max
            ]);

            if ($validator->fails()) {
                return ResponseHelper::fieldError($validator->errors()->toArray());
            }

            $validatedData = $validator->validated();

            // Check if user has already reviewed this product
            $existingRating = Rating::where('user_id', $user->id)
                ->where('product_id', $validatedData['product_id'])
                ->first();

            if ($existingRating) {
                return ResponseHelper::error('You have already reviewed this product', 400);
            }

            // Verify that user has ordered this product and order is delivered
            $hasOrderedProduct = Order::where('user_id', $user->id)
                ->where('status', 2) // delivered status
                ->whereHas('orderDetails', function ($query) use ($validatedData) {
                    $query->where('product_id', $validatedData['product_id']);
                })
                ->exists();

            if (!$hasOrderedProduct) {
                return ResponseHelper::error('You can only review products from delivered orders', 400);
            }

            // Handle image upload if provided
            $imagePath = null;
            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $imageName = time() . '_' . $image->getClientOriginalName();
                $imagePath = $image->storeAs('reviews', $imageName, 'public');
            }

            // Create the rating
            $rating = Rating::create([
                'user_id' => $user->id,
                'product_id' => $validatedData['product_id'],
                'rating' => $validatedData['rating'],
                'comment' => $validatedData['comment'],
                'image' => $imagePath
            ]);

            // Load relationships for response
            $rating->load(['user:id,name', 'product:id,name']);

            // Transform response
            $transformedRating = [
                'id' => $rating->id,
                'user_id' => $rating->user_id,
                'product_id' => $rating->product_id,
                'rating' => $rating->rating,
                'comment' => $rating->comment,
                'image' => $rating->image ? Storage::url($rating->image) : null,
                'created_at' => $rating->created_at,
                'updated_at' => $rating->updated_at,
                'user' => [
                    'id' => $rating->user->id,
                    'name' => $rating->user->name
                ],
                'product' => [
                    'id' => $rating->product->id,
                    'name' => $rating->product->name
                ]
            ];

            return ResponseHelper::successWithData('Review created successfully', $transformedRating);
        } catch (Exception $e) {
            return ResponseHelper::error('Failed to create review: ' . $e->getMessage());
        }
    }
}
