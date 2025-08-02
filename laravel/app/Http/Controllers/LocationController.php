<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Province;
use App\Models\District;
use App\Models\SubDistrict;
use App\Models\Villages;
use App\Helpers\ResponseHelper;
use Exception;
use Illuminate\Http\JsonResponse;

class LocationController extends Controller
{
    /**
     * Get all provinces
     *
     * @return JsonResponse
     */
    public function provinces(): JsonResponse
    {
        try {
            $perPage = request()->query('items_per_page', 15); // Default to 15 items per page if not provided
            $search = request()->query('search', '');

            $query = Province::select('id', 'name')
                ->orderBy('name', 'asc');

            if ($search) {
                $query->where('name', 'like', "%{$search}%");
            }

            $provinces = $query->paginate($perPage);

            return ResponseHelper::successWithPagination('Provinces retrieved successfully', $provinces);
        } catch (Exception $e) {
            return ResponseHelper::error($e->getMessage() ?: 'Internal server error');
        }
    }

    /**
     * Get all districts of a province
     *
     * @param int $provinceId
     * @return JsonResponse
     */
    public function districts(int $provinceId): JsonResponse
    {
        try {
            $perPage = request()->query('items_per_page', 15);
            $search = request()->query('search', '');

            $query = District::where('province_id', $provinceId)
                ->select('id', 'province_id', 'name');

            if ($search) {
                $query->where('name', 'like', "%{$search}%");
            }

            $districts = $query->orderBy('name', 'asc')->paginate($perPage);

            return ResponseHelper::successWithPagination('Districts retrieved successfully', $districts);
        } catch (Exception $e) {
            return ResponseHelper::error($e->getMessage() ?: 'Internal server error');
        }
    }

    /**
     * Get all sub districts of a district
     *
     * @param int $districtId
     * @return JsonResponse
     */
    public function subDistricts(int $districtId): JsonResponse
    {
        try {
            $perPage = request()->query('items_per_page', 15);
            $search = request()->query('search', '');

            $query = SubDistrict::where('district_id', $districtId)
                ->select('id', 'district_id', 'name');

            if ($search) {
                $query->where('name', 'like', "%{$search}%");
            }

            $subDistricts = $query->orderBy('name', 'asc')->paginate($perPage);

            return ResponseHelper::successWithPagination('Sub districts retrieved successfully', $subDistricts);
        } catch (Exception $e) {
            return ResponseHelper::error($e->getMessage() ?: 'Internal server error');
        }
    }

    /**
     * Get all postal codes of a sub district
     *
     * @param int $subDistrictId
     * @return JsonResponse
     */
    public function postalCodes(int $subDistrictId): JsonResponse
    {
        try {
            $perPage = request()->query('items_per_page', 15);
            $search = request()->query('search', '');

            $query = Villages::where('sub_district_id', $subDistrictId)
                ->select('id', 'sub_district_id', 'name', 'postal_code');

            if ($search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('postal_code', 'like', "%{$search}%");
            }

            $postalCodes = $query->orderBy('name', 'asc')->paginate($perPage);

            return ResponseHelper::successWithPagination('Postal codes retrieved successfully', $postalCodes);
        } catch (Exception $e) {
            return ResponseHelper::error($e->getMessage() ?: 'Internal server error');
        }
    }
}
