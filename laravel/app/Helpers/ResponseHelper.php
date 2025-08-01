<?php

namespace App\Helpers;

use Illuminate\Http\JsonResponse;

class ResponseHelper
{
    /**
     * Success message response
     * Schema: SuccessMessageResponse
     */
    public static function success(string $message, int $statusCode = 200): JsonResponse
    {
        return response()->json([
            'message' => $message
        ], $statusCode);
    }

    /**
     * Success with single data response
     * Schema: SuccessWithDataResponse
     */
    public static function successWithData(string $message, $data, int $statusCode = 200): JsonResponse
    {
        return response()->json([
            'message' => $message,
            'data' => $data
        ], $statusCode);
    }

    /**
     * Success with pagination response (can handle Laravel paginator or manual data/pagination)
     * Schema: SuccessWithPaginationResponse
     */
    public static function successWithPagination(string $message, $data, int $statusCode = 200): JsonResponse
    {
        $response = [
            'message' => $message,
            'data' => $data->items(),
            'pagination' => [
                'current_page' => $data->currentPage(),
                'total_pages' => $data->lastPage(),
                'total_items' => $data->total(),
                'items_per_page' => $data->perPage()
            ]
        ];

        return response()->json($response, $statusCode);
    }

    /**
     * Field error response (validation errors)
     * Schema: FieldErrorResponse
     */
    public static function fieldError(array $errors, int $statusCode = 400): JsonResponse
    {
        return response()->json([
            'errors' => $errors
        ], $statusCode);
    }

    /**
     * API error response
     * Schema: ApiErrorResponse
     */
    public static function error(string $message, int $statusCode = 500): JsonResponse
    {
        return response()->json([
            'errors' => [
                'message' => [$message]
            ]
        ], $statusCode);
    }

    /**
     * Not found error
     */
    public static function notFound(string $message = 'Resource not found'): JsonResponse
    {
        return response()->json([
            'errors' => [
                'message' => [$message]
            ]
        ], 404);
    }

    /**
     * Created response
     */
    public static function created(string $message, $data = null): JsonResponse
    {
        if ($data) {
            return self::successWithData($message, $data, 201);
        }
        return self::success($message, 201);
    }
}
