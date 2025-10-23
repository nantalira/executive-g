<?php

namespace App\Http\Controllers;

use App\Helpers\ResponseHelper;
use App\Models\Address;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class AddressController extends Controller
{
    /**
     * Get all addresses of a user
     */
    public function index(Request $request): JsonResponse
    {
        try {
            // Get token from cookie
            $token = $request->cookie('tokenjwt');

            if (!$token) {
                return ResponseHelper::error('No token provided', 401);
            }

            // Set the token for JWTAuth
            JWTAuth::setToken($token);
            $authenticatedUser = JWTAuth::authenticate();

            if (!$authenticatedUser) {
                return ResponseHelper::error('Unauthorized', 401);
            }

            $addresses = Address::where('user_id', $authenticatedUser->id)->get();

            if ($addresses->isEmpty()) {
                return ResponseHelper::error('Addresses not found', 404);
            }

            return ResponseHelper::successWithData('Addresses fetched successfully', $addresses);
        } catch (JWTException $e) {
            return ResponseHelper::error('Token is invalid', 401);
        } catch (Exception $e) {
            return ResponseHelper::error($e->getMessage() ?: 'Internal server error', 500);
        }
    }

    /**
     * Store a new address
     */
    public function store(Request $request): JsonResponse
    {
        try {
            // Get token from cookie
            $token = $request->cookie('tokenjwt');

            if (!$token) {
                return ResponseHelper::error('No token provided', 401);
            }

            // Set the token for JWTAuth
            JWTAuth::setToken($token);
            $authenticatedUser = JWTAuth::authenticate();

            if (!$authenticatedUser) {
                return ResponseHelper::error('Unauthorized', 401);
            }

            // Validate input sesuai API docs
            $validator = Validator::make($request->all(), [
                'fullname' => 'required|string|max:255',
                'phone' => 'required|string|max:20',
                'address' => 'required|string|max:500',
                'detail' => 'nullable|string|max:500',
                'province' => 'required|string|max:100',
                'district' => 'required|string|max:100',
                'sub_district' => 'required|string|max:100',
                'village' => 'required|string|max:100',
                'postal_code' => 'required|string|max:10',
                'pinned' => 'nullable|integer|in:0,1',
            ]);

            if ($validator->fails()) {
                return ResponseHelper::fieldError($validator->errors()->toArray());
            }

            // Check if user already has 5 addresses (maximum limit)
            $existingAddressCount = Address::where('user_id', $authenticatedUser->id)->count();
            if ($existingAddressCount >= 5) {
                return ResponseHelper::error('Maximum 5 addresses allowed per user', 400);
            }

            // Check if user has any addresses, if not, auto-pin this address
            $userHasAddresses = Address::where('user_id', $authenticatedUser->id)->exists();
            $shouldPin = !$userHasAddresses || $request->pinned == 1;

            // If this is pinned, unpin other addresses
            if ($shouldPin) {
                Address::where('user_id', $authenticatedUser->id)->update(['pinned' => 0]);
            }

            // Create address
            $address = Address::create([
                'user_id' => $authenticatedUser->id,
                'fullname' => $request->fullname,
                'phone' => $request->phone,
                'address' => $request->address,
                'detail' => $request->detail,
                'province' => $request->province,
                'district' => $request->district,
                'sub_district' => $request->sub_district,
                'village' => $request->village,
                'postal_code' => $request->postal_code,
                'pinned' => $shouldPin ? 1 : 0,
            ]);

            return ResponseHelper::success('Address added successfully', 201);
        } catch (JWTException $e) {
            return ResponseHelper::error('Token is invalid', 401);
        } catch (Exception $e) {
            return ResponseHelper::error($e->getMessage() ?: 'Internal server error', 500);
        }
    }

    /**
     * Update an address
     */
    public function update(Request $request, $id): JsonResponse
    {
        try {
            // Get token from cookie
            $token = $request->cookie('tokenjwt');

            if (!$token) {
                return ResponseHelper::error('No token provided', 401);
            }

            // Set the token for JWTAuth
            JWTAuth::setToken($token);
            $authenticatedUser = JWTAuth::authenticate();

            if (!$authenticatedUser) {
                return ResponseHelper::error('Unauthorized', 401);
            }

            // Find address
            $address = Address::find($id);
            if (!$address) {
                return ResponseHelper::error('Address not found', 404);
            }

            // Check if user trying to update their own address
            if ($authenticatedUser->id != $address->user_id) {
                return ResponseHelper::error('Unauthorized to update this address', 403);
            }

            // Validate input sesuai API docs
            $validator = Validator::make($request->all(), [
                'fullname' => 'required|string|max:255',
                'phone' => 'required|string|max:20',
                'address' => 'required|string|max:500',
                'detail' => 'nullable|string|max:500',
                'province' => 'required|string|max:100',
                'district' => 'required|string|max:100',
                'sub_district' => 'required|string|max:100',
                'village' => 'required|string|max:100',
                'postal_code' => 'required|string|max:10',
                'pinned' => 'nullable|integer|in:0,1',
            ]);

            if ($validator->fails()) {
                return ResponseHelper::fieldError($validator->errors()->toArray());
            }

            // If this is pinned, unpin other addresses
            if ($request->pinned == 1) {
                Address::where('user_id', $address->user_id)->where('id', '!=', $id)->update(['pinned' => 0]);
            }

            // Update address
            $address->update([
                'fullname' => $request->fullname,
                'phone' => $request->phone,
                'address' => $request->address,
                'detail' => $request->detail,
                'province' => $request->province,
                'district' => $request->district,
                'sub_district' => $request->sub_district,
                'village' => $request->village,
                'postal_code' => $request->postal_code,
                'pinned' => $request->pinned ?? 0,
            ]);

            return ResponseHelper::success('Address updated successfully');
        } catch (JWTException $e) {
            return ResponseHelper::error('Token is invalid', 401);
        } catch (Exception $e) {
            return ResponseHelper::error($e->getMessage() ?: 'Internal server error', 500);
        }
    }

    /**
     * Delete an address
     */
    public function destroy(Request $request, $id): JsonResponse
    {
        try {
            // Get token from cookie
            $token = $request->cookie('tokenjwt');

            if (!$token) {
                return ResponseHelper::error('No token provided', 401);
            }

            // Set the token for JWTAuth
            JWTAuth::setToken($token);
            $authenticatedUser = JWTAuth::authenticate();

            if (!$authenticatedUser) {
                return ResponseHelper::error('Unauthorized', 401);
            }

            // Find address
            $address = Address::find($id);
            if (!$address) {
                return ResponseHelper::error('Address not found', 404);
            }

            // Check if user trying to delete their own address
            if ($authenticatedUser->id != $address->user_id) {
                return ResponseHelper::error('Unauthorized to delete this address', 403);
            }

            $address->delete();

            return ResponseHelper::success('Address removed successfully');
        } catch (JWTException $e) {
            return ResponseHelper::error('Token is invalid', 401);
        } catch (Exception $e) {
            return ResponseHelper::error($e->getMessage() ?: 'Internal server error', 500);
        }
    }

    /**
     * Get pinned address of a user
     */
    public function getPinnedAddress(Request $request): JsonResponse
    {
        try {
            // Get token from cookie
            $token = $request->cookie('tokenjwt');

            if (!$token) {
                return ResponseHelper::error('No token provided', 401);
            }

            // Set the token for JWTAuth
            JWTAuth::setToken($token);
            $authenticatedUser = JWTAuth::authenticate();

            if (!$authenticatedUser) {
                return ResponseHelper::error('Unauthorized', 401);
            }

            $address = Address::where('user_id', $authenticatedUser->id)->where('pinned', 1)->first();

            if (!$address) {
                return ResponseHelper::error('Pinned address not found', 404);
            }

            return ResponseHelper::successWithData('Pinned address fetched successfully', $address);
        } catch (JWTException $e) {
            return ResponseHelper::error('Token is invalid', 401);
        } catch (Exception $e) {
            return ResponseHelper::error($e->getMessage() ?: 'Internal server error', 500);
        }
    }

    /**
     * Get specific address by ID
     */
    public function show(Request $request, $id): JsonResponse
    {
        try {
            // Get token from cookie
            $token = $request->cookie('tokenjwt');

            if (!$token) {
                return ResponseHelper::error('No token provided', 401);
            }

            // Set the token for JWTAuth
            JWTAuth::setToken($token);
            $authenticatedUser = JWTAuth::authenticate();

            if (!$authenticatedUser) {
                return ResponseHelper::error('Unauthorized', 401);
            }

            // Find address
            $address = Address::find($id);
            if (!$address) {
                return ResponseHelper::error('Address not found', 404);
            }

            // Check if user trying to access their own address
            if ($authenticatedUser->id != $address->user_id) {
                return ResponseHelper::error('Unauthorized to access this address', 403);
            }

            return ResponseHelper::successWithData('Address fetched successfully', $address);
        } catch (JWTException $e) {
            return ResponseHelper::error('Token is invalid', 401);
        } catch (Exception $e) {
            return ResponseHelper::error($e->getMessage() ?: 'Internal server error', 500);
        }
    }
}
