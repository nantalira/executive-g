<?php

namespace App\Http\Controllers;

use App\Helpers\ResponseHelper;
use App\Models\Coupon;
use App\Models\CouponUsage;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Tymon\JWTAuth\Facades\JWTAuth;

class CouponController extends Controller
{
    /**
     * Check/validate coupon code and calculate discount
     * Public endpoint - no authentication required
     */
    public function checkCoupon(Request $request, $code)
    {
        try {
            // Validate input - total_price must be provided as query parameter
            $validated = $request->validate([
                'total_price' => 'required|numeric|min:0'
            ], [
                'total_price.required' => 'The total_price query parameter is required',
                'total_price.numeric' => 'The total_price must be a valid number',
                'total_price.min' => 'The total_price must be at least 0'
            ]);

            // Find active and valid coupon
            $coupon = Coupon::where('code', $code)
                ->active()
                ->valid()
                ->first();

            if (!$coupon) {
                return ResponseHelper::error('Coupon code is invalid or expired', 404);
            }

            // Check minimum purchase requirement
            if ($validated['total_price'] < $coupon->minimum_purchase) {
                return ResponseHelper::error(
                    'Minimum purchase of Rp' . number_format($coupon->minimum_purchase, 0, ',', '.') . ' required',
                    400
                );
            }

            // Check if coupon has usage limit
            if ($coupon->usage_limit && $coupon->getRemainingUsage() <= 0) {
                return ResponseHelper::error('Coupon usage limit has been exceeded', 400);
            }

            // Calculate discount amount
            $discountAmount = $coupon->calculateDiscount($validated['total_price']);

            // Return coupon details
            return ResponseHelper::successWithData('Coupon code is valid', [
                'id' => $coupon->id,
                'code' => $coupon->code,
                'name' => $coupon->name,
                'type' => $coupon->type,
                'value' => $coupon->value,
                'minimum_purchase' => $coupon->minimum_purchase,
                'maximum_discount' => $coupon->maximum_discount,
                'discount_amount' => $discountAmount,
                'final_total' => $validated['total_price'] - $discountAmount
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return ResponseHelper::fieldError($e->errors());
        } catch (Exception $e) {
            return ResponseHelper::error('Internal server error', 500);
        }
    }

    /**
     * Apply coupon to cart/order
     * Authenticated endpoint - requires user login
     */
    public function applyCoupon(Request $request)
    {
        try {
            // Get token from cookie and authenticate user
            $token = $request->cookie('tokenjwt');
            if (!$token) {
                return ResponseHelper::unauthorized('No token provided');
            }

            JWTAuth::setToken($token);
            $user = JWTAuth::authenticate();

            if (!$user) {
                return ResponseHelper::unauthorized('User not found');
            }

            // Validate input with clear error messages
            $validated = $request->validate([
                'coupon_code' => 'required|string|max:50',
                'total_price' => 'required|numeric|min:0',
                'cart_items' => 'nullable|array',
                'cart_items.*.product_id' => 'sometimes|required|integer',
                'cart_items.*.quantity' => 'sometimes|required|integer|min:1',
                'cart_items.*.price' => 'sometimes|required|numeric|min:0'
            ], [
                'coupon_code.required' => 'Coupon code is required',
                'total_price.required' => 'Total price is required',
                'total_price.numeric' => 'Total price must be a valid number',
                'total_price.min' => 'Total price must be at least 0'
            ]);

            $userId = $user->id;

            // Debug logging
            Log::info('Apply Coupon Request', [
                'user_id' => $userId,
                'coupon_code' => $validated['coupon_code'],
                'total_price' => $validated['total_price'],
                'total_price_type' => gettype($validated['total_price'])
            ]);

            // Find active and valid coupon
            $coupon = Coupon::where('code', $validated['coupon_code'])
                ->active()
                ->valid()
                ->first();

            if (!$coupon) {
                return ResponseHelper::error('Coupon code is invalid or expired', 404);
            }

            // Check minimum purchase requirement
            if ($validated['total_price'] < $coupon->minimum_purchase) {
                return ResponseHelper::error(
                    'Minimum purchase of Rp' . number_format($coupon->minimum_purchase, 0, ',', '.') . ' required',
                    400
                );
            }

            // Check global usage limit
            if ($coupon->usage_limit && $coupon->getRemainingUsage() <= 0) {
                return ResponseHelper::error('Coupon usage limit exceeded', 400);
            }

            // Check per-user usage limit
            if ($coupon->usage_limit_per_user) {
                $userUsageCount = $coupon->getUserUsageCount($userId);
                if ($userUsageCount >= $coupon->usage_limit_per_user) {
                    return ResponseHelper::error('You have already used this coupon', 400);
                }
            }

            // Calculate discount amount
            $discountAmount = $coupon->calculateDiscount($validated['total_price']);

            // Create coupon usage record
            DB::beginTransaction();

            $couponUsage = CouponUsage::create([
                'coupon_id' => $coupon->id,
                'user_id' => $userId,
                'discount_amount' => $discountAmount,
                'order_total' => $validated['total_price'],
                'used_at' => now()
            ]);

            DB::commit();

            // Return success response
            return ResponseHelper::successWithData('Coupon applied successfully', [
                'coupon_id' => $coupon->id,
                'coupon_code' => $coupon->code,
                'discount_amount' => $discountAmount,
                'original_total' => $validated['total_price'],
                'final_total' => $validated['total_price'] - $discountAmount,
                'usage_id' => $couponUsage->id
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            return ResponseHelper::fieldError($e->errors());
        } catch (Exception $e) {
            DB::rollBack();
            return ResponseHelper::error($e->getMessage(), 500);
        }
    }

    /**
     * Private method to validate if user can use the coupon
     */
    private function canUserUseCoupon(Coupon $coupon, $userId)
    {
        // Check global usage limit
        if ($coupon->usage_limit && $coupon->getRemainingUsage() <= 0) {
            return false;
        }

        // Check per-user usage limit
        if ($coupon->usage_limit_per_user) {
            $userUsageCount = $coupon->getUserUsageCount($userId);
            if ($userUsageCount >= $coupon->usage_limit_per_user) {
                return false;
            }
        }

        return true;
    }
}
