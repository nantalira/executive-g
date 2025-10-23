<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\FlashSale;
use App\Helpers\ResponseHelper;
use App\Models\Product;

class FlashSaleController extends Controller
{
    /**
     * Get flash sales schedule (active and upcoming)
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getSchedule(Request $request)
    {
        try {
            $currentTime = now()->utc();

            // Get active flash sales
            $active = FlashSale::select('id', 'start_date', 'end_date', 'discount as sale_discount')
                ->where('start_date', '<=', $currentTime)
                ->where('end_date', '>=', $currentTime)
                ->get()
                ->map(function ($sale) use ($currentTime) {
                    $endTime = $sale->end_date;
                    $timeRemaining = $endTime->diffInSeconds($currentTime, false);

                    $sale->status = 'active';
                    $sale->time_remaining_seconds = max(0, $timeRemaining);
                    $sale->display_time = $sale->start_date->format('h:i A') . ' - ' . $sale->end_date->format('h:i A');

                    return $sale;
                });

            // Get upcoming flash sales (next 5)
            $upcoming = FlashSale::select('id', 'start_date', 'end_date', 'discount as sale_discount')
                ->where('start_date', '>', $currentTime)
                ->orderBy('start_date')
                ->limit(5)
                ->get()
                ->map(function ($sale) use ($currentTime) {
                    $startTime = $sale->start_date;
                    $startsIn = $currentTime->diffInSeconds($startTime, false);

                    $sale->status = 'upcoming';
                    $sale->starts_in_seconds = max(0, $startsIn);
                    $sale->display_time = $sale->start_date->format('h:i A') . ' - ' . $sale->end_date->format('h:i A');

                    return $sale;
                });

            return ResponseHelper::successWithData('Flash sales schedule retrieved successfully', [
                'server_time' => $currentTime->toISOString(),
                'active' => $active,
                'upcoming' => $upcoming
            ]);
        } catch (\Exception $e) {
            return ResponseHelper::error('Failed to retrieve flash sales schedule');
        }
    }

    /**
     * Get active flash sale with its products
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getActiveFlashSaleWithProducts(Request $request)
    {
        try {
            $perPage = $request->query('items_per_page', 15);
            $search = $request->query('search', '');
            $currentTime = now()->toISOString();

            // Get the first active flash sale
            $activeFlashSale = FlashSale::select('id', 'start_date', 'end_date', 'discount as sale_discount')
                ->where('start_date', '<=', $currentTime)
                ->where('end_date', '>=', $currentTime)
                ->first();

            if (!$activeFlashSale) {
                return ResponseHelper::successWithData('No active flash sales found', [
                    'flash_sale' => null,
                    'products' => []
                ]);
            }

            // Build query for products in this flash sale
            $query = Product::with([
                'productImages' => function ($q) {
                    $q->select('product_id', 'name')
                        ->where('pinned', 1);
                }
            ])
                ->select('id', 'name', 'price', 'discount', 'avg_rating', 'total_rating')
                ->where('sale_id', $activeFlashSale->id)
                ->orderBy('created_at', 'desc');

            // Apply search filter if provided
            if ($search) {
                $query->where('name', 'like', "%{$search}%");
            }

            // Paginate results
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

            $result = [
                'flash_sale' => $activeFlashSale,
                'products' => [
                    'data' => $products->items(),
                    'pagination' => [
                        'current_page' => $products->currentPage(),
                        'total_pages' => $products->lastPage(),
                        'total_items' => $products->total(),
                        'items_per_page' => $products->perPage()
                    ]
                ]
            ];

            return ResponseHelper::successWithData('Active flash sale with products retrieved successfully', $result);
        } catch (\Exception $e) {
            return ResponseHelper::error('Failed to retrieve active flash sale with products');
        }
    }
}
