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

// Health check endpoint
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'message' => 'API is running',
        'timestamp' => now()->toISOString(),
        'version' => '1.0.0',
        'environment' => app()->environment(),
        'laravel_version' => app()->version()
    ]);
});
// Unauthenticated routes
// Categories
Route::get('/categories', [CategoryController::class, 'getAll']);

// Carousel
Route::get('/carousel', [CarouselController::class, 'getAll']);

// Products
Route::get('/products/flash-sale', [ProductController::class, 'flashSale']);
Route::get('/products/{product_id}', [ProductController::class, 'show']);
Route::get('/products', [ProductController::class, 'index']);

// Reviews
Route::get('/reviews/{product_id}', [RatingController::class, 'getProductReviews']);

// Master Data - Locations
Route::get('/provinces', [LocationController::class, 'provinces']);
Route::get('/districts/{province_id}', [LocationController::class, 'districts']);
Route::get('/sub_districts/{district_id}', [LocationController::class, 'subDistricts']);
Route::get('/postalcodes/{sub_district_id}', [LocationController::class, 'postalCodes']);

// Flash Sale
Route::get('/flash-sale', [FlashSaleController::class, 'getAll']);
Route::get('/flash-sale/{id}', [FlashSaleController::class, 'getById']);

// Auth
Route::post('/login', [AuthController::class, 'login'])->name('login');
Route::post('/register', [AuthController::class, 'register']);

// OTP and Password Reset (no auth required)
Route::get('/send-otp/{phone_number}', [AuthController::class, 'sendOtp']);
Route::post('/otp-verification/{user_id}', [AuthController::class, 'verifyOtp']);
Route::post('/forgot-password/{phone_number}', [AuthController::class, 'forgotPassword']);

// Authenticated routes - untuk endpoints lain yang butuh auth
Route::middleware('custom.jwt')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/change-password/{user_id}', [AuthController::class, 'changePassword']);
    // Route lain yang membutuhkan authentication akan ditambahkan di sini
});
