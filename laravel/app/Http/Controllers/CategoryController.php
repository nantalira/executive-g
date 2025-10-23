<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Helpers\ResponseHelper;
use Exception;
use Illuminate\Http\JsonResponse;

class CategoryController extends Controller
{
    /**
     * Get all categories
     *
     * @return JsonResponse
     */
    public function getAll(): JsonResponse
    {
        try {
            $categories = Category::select('id', 'name', 'icon')
                ->orderBy('id')
                ->get();

            return ResponseHelper::successWithData('Categories retrieved successfully', $categories);
        } catch (Exception $e) {
            return ResponseHelper::error('Internal server error');
        }
    }
}
