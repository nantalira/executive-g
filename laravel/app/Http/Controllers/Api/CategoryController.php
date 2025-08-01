<?php

namespace App\Http\Controllers\Api;

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
            $perPage = request()->query('items_per_page', 15); // Default to 15 items per page if not provided
            $search = request()->query('search', '');
            $query = Category::select('id', 'name');

            if ($search) {
                $query->where('name', 'like', "%{$search}%");
            }

            $categories = $query->paginate($perPage);

            return ResponseHelper::successWithPagination('Categories retrieved successfully', $categories);
        } catch (Exception $e) {
            return ResponseHelper::error('Internal server error');
        }
    }
}
