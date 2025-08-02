<?php

namespace App\Http\Middleware;

use App\Helpers\ResponseHelper;
use Closure;
use Exception;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;
use Tymon\JWTAuth\Facades\JWTAuth;

class JWTMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        try {
            // Get token from cookie
            $token = $request->cookie('tokenjwt');

            if (!$token) {
                return ResponseHelper::error('Token not provided', 401);
            }

            // Set token and authenticate user
            JWTAuth::setToken($token);
            $user = JWTAuth::authenticate();

            if (!$user) {
                return ResponseHelper::error('User not found', 401);
            }
        } catch (TokenExpiredException $e) {
            return ResponseHelper::error('Token has expired', 401);
        } catch (TokenInvalidException $e) {
            return ResponseHelper::error('Token is invalid', 401);
        } catch (JWTException $e) {
            return ResponseHelper::error('Token absent or invalid', 401);
        } catch (Exception $e) {
            return ResponseHelper::error('Authorization error', 401);
        }

        return $next($request);
    }
}
