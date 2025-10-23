<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderDetail;
use App\Models\Product;
use App\Models\Cart;
use App\Helpers\ResponseHelper;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Tymon\JWTAuth\Facades\JWTAuth;

class OrderController extends Controller
{
    /**
     * Get user orders with optional status filter
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        try {
            // Get token from cookie
            $token = $request->cookie('tokenjwt');
            if (!$token) {
                return ResponseHelper::unauthorized('No token provided');
            }

            // Set the token for JWTAuth
            JWTAuth::setToken($token);
            $user = JWTAuth::authenticate();

            if (!$user) {
                return ResponseHelper::unauthorized('User not found');
            }

            // Get status filter from request
            $status = $request->query('status');

            $query = Order::with(['orderDetails.product.productImages'])
                ->where('user_id', $user->id)
                ->select([
                    'id',
                    'full_name',
                    'phone_number',
                    'address',
                    'detail_address',
                    'province',
                    'district',
                    'sub_district',
                    'village',
                    'postal_code',
                    'coupon_discount',
                    'payment_method',
                    'total_price',
                    'status',
                    'tracking_message',
                    'created_at',
                    'updated_at'
                ])
                ->orderBy('created_at', 'desc');

            // Apply status filter if provided
            if ($status !== null && is_numeric($status)) {
                $query->where('status', (int)$status);
            }

            $orders = $query->get();

            // Transform the response to match API documentation
            // Note: All monetary values are in IDR integer format (e.g., 129000000 = Rp 129.000.000)
            $transformedOrders = $orders->map(function ($order) {
                return [
                    'id' => $order->id,
                    'invoice_code' => 'INV-' . str_pad($order->id, 6, '0', STR_PAD_LEFT),
                    'full_name' => $order->full_name,
                    'phone_number' => $order->phone_number,
                    'address' => $order->address,
                    'detail_address' => $order->detail_address,
                    'province' => $order->province,
                    'district' => $order->district,
                    'sub_district' => $order->sub_district,
                    'village' => $order->village,
                    'postal_code' => $order->postal_code,
                    'coupon_discount' => $order->coupon_discount, // IDR integer format
                    'payment_method' => $order->payment_method,
                    'total_price' => $order->total_price, // IDR integer format
                    'status' => $order->status,
                    'tracking_message' => $order->tracking_message,
                    'created_at' => $order->created_at,
                    'updated_at' => $order->updated_at,
                    'order_details' => $order->orderDetails->map(function ($detail) {
                        return [
                            'id' => $detail->id,
                            'quantity' => $detail->quantity,
                            'total_price' => $detail->total_price,
                            'product' => $detail->product ? [
                                'id' => $detail->product->id,
                                'name' => $detail->product->name,
                                'price' => $detail->product->price,
                                'product_images' => $detail->product->productImages->map(function ($image) {
                                    return [
                                        'name' => $image->name
                                    ];
                                })
                            ] : null
                        ];
                    })
                ];
            });

            return ResponseHelper::successWithData('Orders retrieved successfully', $transformedOrders);
        } catch (Exception $e) {
            return ResponseHelper::error('Failed to retrieve orders: ' . $e->getMessage());
        }
    }

    /**
     * Create a new order
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        try {
            // Get token from cookie
            $token = $request->cookie('tokenjwt');
            if (!$token) {
                return ResponseHelper::unauthorized('No token provided');
            }

            // Set the token for JWTAuth
            JWTAuth::setToken($token);
            $user = JWTAuth::authenticate();

            if (!$user) {
                return ResponseHelper::unauthorized('User not found');
            }

            // Debug log - check received data
            Log::info('OrderController - Received request data:', $request->all());

            // Validate request data
            $validator = Validator::make($request->all(), [
                'full_name' => 'required|string|max:255',
                'phone_number' => 'required|string|max:20',
                'address' => 'required|string|max:500',
                'detail_address' => 'nullable|string|max:500',
                'province' => 'required|string|max:100',
                'district' => 'required|string|max:100',
                'sub_district' => 'required|string|max:100',
                'village' => 'required|string|max:100',
                'postal_code' => 'required|string|max:10',
                'payment_method' => 'required|string|max:50',
                'coupon_discount' => 'nullable|integer|min:0',
                'cart_items' => 'required|array|min:1',
                'cart_items.*.product_id' => 'required|integer|exists:products,id',
                'cart_items.*.quantity' => 'required|integer|min:1'
            ]);

            if ($validator->fails()) {
                return ResponseHelper::fieldError($validator->errors()->toArray());
            }

            $validatedData = $validator->validated();

            DB::beginTransaction();

            try {
                // Calculate total price
                $totalPrice = 0;
                $orderItems = [];

                foreach ($validatedData['cart_items'] as $item) {
                    $product = Product::find($item['product_id']);
                    if (!$product) {
                        throw new Exception("Product with ID {$item['product_id']} not found");
                    }

                    $itemTotal = $product->price * $item['quantity'];
                    $totalPrice += $itemTotal;

                    $orderItems[] = [
                        'product_id' => $product->id,
                        'quantity' => $item['quantity'],
                        'total_price' => $itemTotal,
                        'product' => $product
                    ];
                }

                // Apply coupon discount if provided
                $couponDiscount = $validatedData['coupon_discount'] ?? 0;
                $finalTotal = max(0, $totalPrice - $couponDiscount);

                // Create order
                $order = Order::create([
                    'user_id' => $user->id,
                    'full_name' => $validatedData['full_name'],
                    'phone_number' => $validatedData['phone_number'],
                    'address' => $validatedData['address'],
                    'detail_address' => $validatedData['detail_address'],
                    'province' => $validatedData['province'],
                    'district' => $validatedData['district'],
                    'sub_district' => $validatedData['sub_district'],
                    'village' => $validatedData['village'],
                    'postal_code' => $validatedData['postal_code'],
                    'payment_method' => $validatedData['payment_method'],
                    'coupon_discount' => $couponDiscount,
                    'total_price' => $finalTotal,
                    'status' => 0, // 0: pending
                    'tracking_message' => 'Order placed successfully'
                ]);

                // Create order details
                foreach ($orderItems as $item) {
                    OrderDetail::create([
                        'order_id' => $order->id,
                        'product_id' => $item['product_id'],
                        'quantity' => $item['quantity'],
                        'total_price' => $item['total_price']
                    ]);
                }

                // Clear user's cart items that were ordered
                foreach ($validatedData['cart_items'] as $item) {
                    Cart::where('user_id', $user->id)
                        ->where('product_id', $item['product_id'])
                        ->delete();
                }

                DB::commit();

                // Load relationships for response
                $order->load(['orderDetails.product.productImages']);

                // Transform response
                $transformedOrder = [
                    'id' => $order->id,
                    'invoice_code' => 'INV-' . str_pad($order->id, 6, '0', STR_PAD_LEFT),
                    'full_name' => $order->full_name,
                    'phone_number' => $order->phone_number,
                    'address' => $order->address,
                    'detail_address' => $order->detail_address,
                    'province' => $order->province,
                    'district' => $order->district,
                    'sub_district' => $order->sub_district,
                    'village' => $order->village,
                    'postal_code' => $order->postal_code,
                    'coupon_discount' => $order->coupon_discount,
                    'payment_method' => $order->payment_method,
                    'total_price' => $order->total_price,
                    'status' => $order->status,
                    'tracking_message' => $order->tracking_message,
                    'created_at' => $order->created_at,
                    'updated_at' => $order->updated_at,
                    'order_details' => $order->orderDetails->map(function ($detail) {
                        return [
                            'id' => $detail->id,
                            'quantity' => $detail->quantity,
                            'total_price' => $detail->total_price,
                            'product' => $detail->product ? [
                                'id' => $detail->product->id,
                                'name' => $detail->product->name,
                                'price' => $detail->product->price,
                                'product_images' => $detail->product->productImages->map(function ($image) {
                                    return [
                                        'name' => $image->name
                                    ];
                                })
                            ] : null
                        ];
                    })
                ];

                return ResponseHelper::successWithData('Order created successfully', $transformedOrder);
            } catch (Exception $e) {
                DB::rollBack();
                throw $e;
            }
        } catch (Exception $e) {
            return ResponseHelper::error('Failed to create order: ' . $e->getMessage());
        }
    }
}
