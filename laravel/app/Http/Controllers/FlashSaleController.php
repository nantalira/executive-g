<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\FlashSale;
use App\Helpers\ResponseHelper;

class FlashSaleController extends Controller
{
    /**
     * Get all flash sales
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getAll()
    {
        $perPage = request()->query('items_per_page', 15); // Default to 15

        $query = FlashSale::select('id', 'start_date', 'end_date', 'discount as sale_discount')
            ->addSelect([
                'status' => function ($query) {
                    $now = now();
                    $query->selectRaw("
                CASE
                    WHEN start_date > ? THEN 'upcoming'
                    WHEN start_date <= ? AND end_date >= ? THEN 'active'
                    ELSE 'expired'
                END
                ", [$now, $now, $now]);
                }
            ]);

        $flashSales = $query->orderBy('start_date', 'desc')->paginate($perPage);

        return ResponseHelper::successWithPagination('Flash sales retrieved successfully', $flashSales);
    }

    /**
     * Get flash sale by ID
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function getById($id)
    {
        $flashSale = FlashSale::select('id', 'start_date', 'end_date', 'discount as sale_discount')
            ->addSelect([
                'status' => function ($query) {
                    $now = now();
                    $query->selectRaw("
                CASE
                    WHEN start_date > ? THEN 'upcoming'
                    WHEN start_date <= ? AND end_date >= ? THEN 'active'
                    ELSE 'expired'
                END
                ", [$now, $now, $now]);
                }
            ])
            ->find($id);

        if (!$flashSale) {
            return ResponseHelper::error('Flash sale not found', 404);
        }

        return ResponseHelper::successWithData('Flash sale retrieved successfully', $flashSale);
    }
}
