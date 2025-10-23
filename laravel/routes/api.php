<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CarouselController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\RatingController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\FlashSaleController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AddressController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CouponController;
use App\Http\Controllers\OrderController;
use App\Helpers\ResponseHelper;

// Health check endpoint
Route::get('/health', function () {
    $data = [
        'status' => 'ok',
        'timestamp' => now()->toISOString(),
        'version' => '1.0.0',
        'environment' => app()->environment(),
        'laravel_version' => app()->version()
    ];

    return ResponseHelper::successWithData('API is running', $data);
});
// Unauthenticated routes
// Categories
Route::get('/categories', [CategoryController::class, 'getAll']);

// Carousels
Route::get('/carousels', [CarouselController::class, 'getAll']);

// Products
Route::get('/products/{product_id}', [ProductController::class, 'show']);
Route::get('/products', [ProductController::class, 'index']);

// Reviews
Route::get('/reviews/{product_id}', [RatingController::class, 'getProductReviews']);

// Master Data - Locations
Route::get('/provinces', [LocationController::class, 'provinces']);
Route::get('/districts/{province_id}', [LocationController::class, 'districts']);
Route::get('/sub-districts/{district_id}', [LocationController::class, 'subDistricts']);
Route::get('/villages/{sub_district_id}', [LocationController::class, 'villages']);

// Flash Sales
Route::get('/flash-sales/schedule', [FlashSaleController::class, 'getSchedule']);
Route::get('/flash-sales/product', [FlashSaleController::class, 'getActiveFlashSaleWithProducts']);

// Auth
Route::post('/login', [AuthController::class, 'login'])->name('login');
Route::post('/register', [AuthController::class, 'register']);
Route::post('/refresh', [AuthController::class, 'refresh']); // Tidak menggunakan middleware

// OTP and Password Reset (no auth required)
Route::get('/send-otp/{phone_number}', [AuthController::class, 'sendOtp']);
Route::post('/otp-verification/{user_id}', [AuthController::class, 'verifyOtp']);
Route::post('/forgot-password/{phone_number}', [AuthController::class, 'forgotPassword']);

// Coupon routes (public) - requires total_price query parameter
Route::get('/coupons/check/{code}', [CouponController::class, 'checkCoupon']);

// Authenticated routes - untuk endpoints lain yang butuh auth
Route::middleware('custom.jwt')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);
    Route::post('/change-password', [AuthController::class, 'changePassword']);

    // Address routes
    Route::get('/addresses', [AddressController::class, 'index']);
    Route::post('/addresses', [AddressController::class, 'store']);
    Route::get('/addresses/pinned', [AddressController::class, 'getPinnedAddress']);
    Route::get('/addresses/{id}', [AddressController::class, 'show']);
    Route::put('/addresses/{id}', [AddressController::class, 'update']);
    Route::delete('/addresses/{id}', [AddressController::class, 'destroy']);

    // Cart routes
    Route::get('/carts', [CartController::class, 'index']);
    Route::post('/carts', [CartController::class, 'store']);
    Route::put('/carts/{id}', [CartController::class, 'update']);
    Route::delete('/carts/{id}', [CartController::class, 'destroy']);

    // Coupon routes (authenticated)
    Route::post('/coupons/apply', [CouponController::class, 'applyCoupon']);

    // Order routes
    Route::get('/orders', [OrderController::class, 'index']);
    Route::post('/orders', [OrderController::class, 'store']);

    // Rating/Review routes
    Route::post('/reviews', [RatingController::class, 'store']);

    // Route lain yang membutuhkan authentication akan ditambahkan di sini
});
