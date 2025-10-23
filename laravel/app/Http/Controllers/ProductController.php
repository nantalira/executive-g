<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\FlashSale;
use App\Helpers\ResponseHelper;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    /**
     * Get all products with filters
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $categoryId = $request->query('category_id');
            $perPage = request()->query('items_per_page', 15); // Default to 15 items per page if not provided
            $search = request()->query('search', '');
            $filter = request()->query('filter', '');
            $flashSaleId = $request->query('flash_sale_id');

            // Validate parameters
            if ($categoryId && !is_numeric($categoryId)) {
                return ResponseHelper::fieldError([
                    'category_id' => ['Category ID must be a number']
                ]);
            }

            $query = Product::with([
                'productImages' => function ($q) {
                    $q->select('product_id', 'name')
                        ->where('pinned', 1);
                }
            ])
                ->select('id', 'name', 'price', 'discount', 'avg_rating', 'total_rating');

            if ($categoryId) {
                $query->where('category_id', $categoryId)->orderBy('created_at', 'desc');
            }
            if ($filter === 'best_selling') {
                $query->orderBy('total_sold', 'desc');
            } elseif ($filter === 'new_arrival') {
                $query->orderBy('created_at', 'desc');
            } elseif ($filter === 'price_asc') {
                $query->orderBy('price', 'asc');
            } elseif ($filter === 'price_desc') {
                $query->orderBy('price', 'desc');
            } elseif ($filter === 'flash_sale') {
                if ($flashSaleId) {
                    $query->where('sale_id', $flashSaleId);
                } else {
                    // Auto-detect active flash sales
                    $activeFlashSaleIds = FlashSale::where('start_date', '<=', now()->utc())
                        ->where('end_date', '>=', now()->utc())
                        ->pluck('id')
                        ->toArray();
                    if (!empty($activeFlashSaleIds)) {
                        $query->whereIn('sale_id', $activeFlashSaleIds);
                    } else {
                        // No active flash sales, return empty result
                        $query->where('id', -1); // Force empty result
                    }
                }
                $query->orderBy('created_at', 'desc');
            } else {
                $query->orderBy('name', 'asc');
            }

            if ($search) {
                $query->where('name', 'like', "%{$search}%");
            }

            $products = $query->paginate($perPage);

            // Transform product images to include full URL
            $products->getCollection()->transform(function ($product) {
                if ($product->productImages) {
                    $product->productImages->transform(function ($image) {
                        $image->name = $image->image_url;
                        return $image;
                    });
                }
                return $product;
            });

            return ResponseHelper::successWithPagination('Products retrieved successfully', $products);
        } catch (Exception $e) {
            return ResponseHelper::error('Internal server error');
        }
    }

    /**
     * Get product details
     *
     * @param int $productId
     * @return JsonResponse
     */
    public function show(int $productId): JsonResponse
    {
        try {
            if (!is_numeric($productId)) {
                return ResponseHelper::fieldError([
                    'product_id' => ['Product ID must be a number']
                ]);
            }

            $product = Product::with([
                'productImages' => function ($q) {
                    $q->select('product_id', 'name', 'pinned');
                },
                'sale' => function ($q) {
                    $q->select('id', 'discount as sale_discount', 'start_date', 'end_date');
                },
                'category' => function ($q) {
                    $q->select('id', 'name');
                },
                'variants' => function ($q) {
                    $q->select('id', 'name')
                        ->with(['variantOptions' => function ($q) {
                            $q->select('variant_id', 'name');
                        }]);
                }
            ])
                ->select('id', 'name', 'price', 'discount', 'avg_rating', 'total_rating', 'stock', 'description', 'sale_id', 'category_id', 'variant_id')
                ->find($productId);

            if (!$product) {
                return ResponseHelper::notFound('Product not found');
            }

            // Transform product images to include full URL
            if ($product->productImages) {
                $product->productImages->transform(function ($image) {
                    $image->name = $image->image_url;
                    return $image;
                });
            }

            return ResponseHelper::successWithData('Product details retrieved successfully', $product);
        } catch (Exception $e) {
            return ResponseHelper::error($e->getMessage() ?: 'Internal server error');
        }
    }
}
