<?php

namespace App\Http\Controllers\Api;

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
            $bestSeller = $request->query('best_seller', false);

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
            if ($bestSeller) {
                $query->orderBy('total_sold', 'desc');
            } else {
                $query->orderBy('created_at', 'desc');
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
                    $q->select('id', 'discount as sale_discount');
                }
            ])
                ->select('id', 'name', 'price', 'discount', 'avg_rating', 'total_rating', 'sale_id')
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

    /**
     * Get all products in flash sale
     *
     * @param int $saleId
     * @return JsonResponse
     */
    public function flashSale(Request $request): JsonResponse
    {
        try {
            $perPage = request()->query('items_per_page', 15); // Default to 15 items per page if not provided
            $search = $request->query('search', '');

            $query = Product::with([
                'productImages' => function ($q) {
                    $q->select('product_id', 'name')
                        ->where('pinned', 1);
                },
                'sale' => function ($q) {
                    $q->select('id', 'discount as sale_discount', 'start_date', 'end_date');
                }
            ])
                ->whereHas('sale', function ($q) {
                    $q->where('start_date', '<=', now())
                        ->where('end_date', '>', now());
                });
            if ($search) {
                $query->where('name', 'like', "%{$search}%");
            }
            $flashSale = $query->select('id', 'name', 'price', 'discount', 'avg_rating', 'total_rating', 'sale_id')
                ->orderBy('created_at', 'desc')
                ->paginate($perPage);
                
            // Transform product images to include full URL
            $flashSale->getCollection()->transform(function ($product) {
                if ($product->productImages) {
                    $product->productImages->transform(function ($image) {
                        $image->name = $image->image_url;
                        return $image;
                    });
                }
                return $product;
            });
                
            return ResponseHelper::successWithPagination('Flash sale products retrieved successfully', $flashSale);
        } catch (Exception $e) {
            return ResponseHelper::error($e->getMessage() ?: 'Internal server error');
        }
    }
}
