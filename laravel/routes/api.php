<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\CarouselController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\RatingController;
use App\Http\Controllers\Api\LocationController;

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

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

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
