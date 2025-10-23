<?php

namespace App\Http\Controllers;

use App\Helpers\ResponseHelper;
use App\Models\Cart;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class CartController extends Controller
{
    /**
     * Get all products in user's cart with pagination
     */
    public function index(Request $request)
    {
        try {
            $user = Auth::user();

            if (!$user) {
                return ResponseHelper::fieldError(['user_id' => ['User ID is required']]);
            }

            // Get pagination parameters
            $perPage = $request->get('per_page', 10); // Default 10 items per page
            $perPage = min($perPage, 50); // Max 50 items per page

            // Get cart items with product details including discounts and flash sales
            $cartItems = Cart::with(['product' => function ($query) {
                $query->select('id', 'name', 'price', 'discount', 'sale_id')
                    ->with([
                        'sale' => function ($saleQuery) {
                            $saleQuery->select('id', 'discount as sale_discount', 'start_date', 'end_date')
                                ->where('start_date', '<=', now())
                                ->where('end_date', '>=', now());
                        },
                        'productImages' => function ($imageQuery) {
                            $imageQuery->select('id', 'product_id', 'name')
                                ->orderBy('pinned', 'desc')
                                ->orderBy('id', 'asc')
                                ->limit(1);
                        }
                    ]);
            }])
                ->where('user_id', $user->id)
                ->where('is_purchased', false)
                ->orderBy('created_at', 'desc')
                ->paginate($perPage);

            $cartItems->getCollection()->transform(function ($cartItem) {
                $product = $cartItem->product;
                if ($product->productImages) {
                    $product->productImages->transform(function ($image) {
                        $image->name = $image->image_url;
                        return $image;
                    });
                }
                return $cartItem;
            });

            return ResponseHelper::successWithPagination('Cart fetched successfully', $cartItems);
        } catch (\Exception $e) {
            return ResponseHelper::error('Internal server error: ' . $e->getMessage());
        }
    }

    /**
     * Add product to cart
     */
    public function store(Request $request)
    {
        try {
            $user = Auth::user();

            if (!$user) {
                return ResponseHelper::fieldError(['user_id' => ['User ID is required']]);
            }

            $validator = Validator::make($request->all(), [
                'product_id' => 'required|integer|exists:products,id',
                'quantity' => 'required|integer|min:1'
            ]);

            if ($validator->fails()) {
                return ResponseHelper::fieldError($validator->errors()->toArray());
            }

            // Check if product exists
            $product = Product::find($request->product_id);
            if (!$product) {
                return ResponseHelper::notFound('Product not found');
            }

            // Check if item already exists in cart
            $existingCartItem = Cart::where('user_id', $user->id)
                ->where('product_id', $request->product_id)
                ->where('is_purchased', false)
                ->first();

            if ($existingCartItem) {
                // Update quantity only - price will be calculated real-time
                $existingCartItem->quantity += $request->quantity;
                $existingCartItem->save();
            } else {
                // Create new cart item - no price stored, calculated real-time
                Cart::create([
                    'user_id' => $user->id,
                    'product_id' => $request->product_id,
                    'quantity' => $request->quantity,
                    'is_purchased' => false
                ]);
            }

            return ResponseHelper::created('Product added to cart successfully');
        } catch (\Exception $e) {
            return ResponseHelper::error('Internal server error: ' . $e->getMessage());
        }
    }

    /**
     * Update product quantity in cart
     */
    public function update(Request $request, $id)
    {
        try {
            $user = Auth::user();

            if (!$user) {
                return ResponseHelper::fieldError(['user_id' => ['User ID is required']]);
            }

            $validator = Validator::make($request->all(), [
                'quantity' => 'required|integer|min:1'
            ]);

            if ($validator->fails()) {
                return ResponseHelper::fieldError($validator->errors()->toArray());
            }

            // Find cart item
            $cartItem = Cart::where('id', $id)
                ->where('user_id', $user->id)
                ->where('is_purchased', false)
                ->first();

            if (!$cartItem) {
                return ResponseHelper::notFound('Product not found in cart');
            }

            // Update quantity
            $cartItem->quantity = $request->quantity;
            $cartItem->save();

            return ResponseHelper::success('Product updated in cart successfully');
        } catch (\Exception $e) {
            return ResponseHelper::error('Internal server error: ' . $e->getMessage());
        }
    }

    /**
     * Remove product from cart
     */
    public function destroy($id)
    {
        try {
            $user = Auth::user();

            if (!$user) {
                return ResponseHelper::fieldError(['user_id' => ['User ID is required']]);
            }

            // Find cart item
            $cartItem = Cart::where('id', $id)
                ->where('user_id', $user->id)
                ->where('is_purchased', false)
                ->first();

            if (!$cartItem) {
                return ResponseHelper::notFound('Product not found in cart');
            }

            // Delete cart item
            $cartItem->delete();

            return ResponseHelper::success('Product removed from cart successfully');
        } catch (\Exception $e) {
            return ResponseHelper::error('Internal server error: ' . $e->getMessage());
        }
    }
}
