<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SecureHeaders
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Only apply secure headers for HTML responses
        if ($response->headers->get('Content-Type') && 
            str_contains($response->headers->get('Content-Type'), 'text/html')) {
            
            // Prevent mixed content by upgrading insecure requests
            $response->headers->set('Content-Security-Policy', 
                "upgrade-insecure-requests; " .
                "default-src 'self' https:; " .
                "script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; " .
                "style-src 'self' 'unsafe-inline' https:; " .
                "img-src 'self' data: https:; " .
                "font-src 'self' https: data:; " .
                "connect-src 'self' https: wss: ws:; " .
                "media-src 'self' https:; " .
                "object-src 'none'; " .
                "base-uri 'self';"
            );

            // Additional security headers
            $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
            $response->headers->set('X-Content-Type-Options', 'nosniff');
            $response->headers->set('X-Frame-Options', 'SAMEORIGIN');
            $response->headers->set('X-XSS-Protection', '1; mode=block');
        }

        return $response;
    }
}