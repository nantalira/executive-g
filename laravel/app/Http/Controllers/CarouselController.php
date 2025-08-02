<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Carousel;
use App\Helpers\ResponseHelper;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CarouselController extends Controller
{

    public function getAll(): JsonResponse
    {
        try {
            $perPage = request()->query('items_per_page', 15); // Default to 15 items per page if not provided
            $newArrival = request()->query('new_arrival', 'false');

            $query = Carousel::select('id', 'image', 'title', 'description', 'product_id');


            if ($newArrival == 'true') {
                $query->where('is_new', 1);
            } else if ($newArrival == 'false') {
                $query->where('is_new', 0);
            }

            $carousels = $query->orderBy('created_at', 'desc')->paginate($perPage);
            $carousels->getCollection()->transform(function ($item) {
                $item->image = env('APP_URL') . Storage::url($item->image);
                return $item;
            });

            return ResponseHelper::successWithPagination('Carousel images retrieved successfully', $carousels);
        } catch (Exception $e) {
            return ResponseHelper::error($e->getMessage() ?: 'Internal server error');
        }
    }
}
