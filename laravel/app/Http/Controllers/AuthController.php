<?php

namespace App\Http\Controllers;

use App\Helpers\ResponseHelper;
use App\Models\User;
use App\Models\UserDetail;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class AuthController extends Controller
{
    /**
     * Register a new user
     */
    public function register(Request $request): JsonResponse
    {
        try {
            // Validate input
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email',
                'phone_number' => 'required|string|unique:users,phone',
                'password' => 'required|string|min:6',
                'confirm_password' => 'required|string|same:password',
            ]);

            if ($validator->fails()) {
                return ResponseHelper::fieldError($validator->errors()->toArray());
            }

            // Create user
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone_number,
                'password' => Hash::make($request->password),
                'role' => 1, // Default role for regular user
            ]);
            UserDetail::create([
                'user_id' => $user->id,
            ]);
            return ResponseHelper::success('User registered successfully');
        } catch (Exception $e) {
            return ResponseHelper::error($e->getMessage() ?: 'Internal server error');
        }
    }

    /**
     * Login user
     */
    public function login(Request $request): JsonResponse
    {
        try {
            // Validate input
            $validator = Validator::make($request->all(), [
                'email' => 'required|email',
                'password' => 'required|string',
            ]);

            if ($validator->fails()) {
                return ResponseHelper::fieldError($validator->errors()->toArray());
            }

            // Attempt authentication
            $credentials = $request->only(['email', 'password']);

            if (!$token = JWTAuth::attempt($credentials)) {
                return ResponseHelper::error('Invalid credentials', 400);
            }

            // Set JWT token in httpOnly cookie
            $cookie = cookie(
                'tokenjwt',
                $token,
                config('jwt.ttl'), // TTL from config
                '/',
                null,
                false, // secure (set to true in production with HTTPS)
                true   // httpOnly
            );

            $response = ResponseHelper::successWithData('Login successful', [
                'token' => $token
            ]);

            return $response->withCookie($cookie);
        } catch (Exception $e) {
            return ResponseHelper::error($e->getMessage() ?: 'Internal server error');
        }
    }

    /**
     * Logout user
     */
    public function logout(Request $request)
    {
        try {
            // Try to get token from Authorization header first
            $token = $request->cookie('tokenjwt');

            if (!$token) {
                return ResponseHelper::error('No token provided', 401);
            }

            // Set the token for JWTAuth
            JWTAuth::setToken($token);

            // Validate and invalidate the token
            if (JWTAuth::check()) {
                JWTAuth::invalidate();

                // Clear the cookie by setting it to expire
                $cookie = cookie('tokenjwt', '', -1, '/', null, false, true);

                return ResponseHelper::success('Logout successful')->withCookie($cookie);
            } else {
                return ResponseHelper::error('Invalid token', 401);
            }
        } catch (JWTException $e) {
            return ResponseHelper::error('Could not logout user', 500);
        }
    }

    /**
     * Send OTP to phone number
     */
    public function sendOtp($phone_number): JsonResponse
    {
        try {
            // Validate phone number
            $validator = Validator::make(['phone_number' => $phone_number], [
                'phone_number' => 'required|string',
            ]);

            if ($validator->fails()) {
                return ResponseHelper::fieldError($validator->errors()->toArray());
            }

            // Check if user exists
            $user = User::where('phone', $phone_number)->first();
            if (!$user) {
                return ResponseHelper::error('User not found with this phone number', 404);
            }

            // Generate OTP (6 digits)
            $otp = rand(100000, 999999);

            // Store OTP in cache/session for verification (expires in 5 minutes)
            cache()->put("otp_{$user->id}", $otp, now()->addMinutes(5));

            // TODO: Implement actual SMS sending service here
            // For now, we'll just return success (in production, integrate with SMS service)

            return ResponseHelper::success('OTP sent successfully to ' . $phone_number);
        } catch (Exception $e) {
            return ResponseHelper::error($e->getMessage() ?: 'Internal server error');
        }
    }

    /**
     * Verify OTP
     */
    public function verifyOtp(Request $request, $user_id): JsonResponse
    {
        try {
            // Validate input
            $validator = Validator::make($request->all(), [
                'otp' => 'required|string|size:6',
            ]);

            if ($validator->fails()) {
                return ResponseHelper::fieldError($validator->errors()->toArray());
            }

            // Get stored OTP
            $storedOtp = cache()->get("otp_{$user_id}");

            if (!$storedOtp) {
                return ResponseHelper::error('OTP expired or not found', 400);
            }

            if ($storedOtp != $request->otp) {
                return ResponseHelper::error('Invalid OTP', 400);
            }

            // Clear OTP from cache
            cache()->forget("otp_{$user_id}");

            // Get user
            $user = User::find($user_id);
            if (!$user) {
                return ResponseHelper::error('User not found', 404);
            }

            return ResponseHelper::success('OTP verified successfully');
        } catch (Exception $e) {
            return ResponseHelper::error($e->getMessage() ?: 'Internal server error');
        }
    }

    /**
     * Forgot password - send OTP for password reset
     */
    public function forgotPassword(Request $request, $phone_number): JsonResponse
    {
        try {
            // Validate input
            $validator = Validator::make($request->all(), [
                'new_password' => 'required|string|min:6',
                'otp' => 'required|string|size:6',
            ]);

            if ($validator->fails()) {
                return ResponseHelper::fieldError($validator->errors()->toArray());
            }

            // Find user by phone
            $user = User::where('phone', $phone_number)->first();
            if (!$user) {
                return ResponseHelper::error('User not found with this phone number', 404);
            }

            // Verify OTP
            $storedOtp = cache()->get("otp_{$user->id}");

            if (!$storedOtp) {
                return ResponseHelper::error('OTP expired or not found', 400);
            }

            if ($storedOtp != $request->otp) {
                return ResponseHelper::error('Invalid OTP', 400);
            }

            // Update password
            $user->password = Hash::make($request->new_password);
            $user->save();

            // Clear OTP from cache
            cache()->forget("otp_{$user->id}");

            return ResponseHelper::success('Password reset successfully');
        } catch (Exception $e) {
            return ResponseHelper::error($e->getMessage() ?: 'Internal server error');
        }
    }

    /**
     * Change password for authenticated user
     */
    public function changePassword(Request $request, $user_id): JsonResponse
    {
        try {
            // Validate input
            $validator = Validator::make($request->all(), [
                'current_password' => 'required|string',
                'new_password' => 'required|string|min:6',
            ]);

            if ($validator->fails()) {
                return ResponseHelper::fieldError($validator->errors()->toArray());
            }

            // Get user
            $user = User::find($user_id);
            if (!$user) {
                return ResponseHelper::error('User not found', 404);
            }

            // Verify current password
            if (!Hash::check($request->current_password, $user->password)) {
                return ResponseHelper::error('Current password is incorrect', 400);
            }

            // Update password
            $user->password = Hash::make($request->new_password);
            $user->save();

            return ResponseHelper::success('Password changed successfully');
        } catch (Exception $e) {
            return ResponseHelper::error($e->getMessage() ?: 'Internal server error');
        }
    }
}
