<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // Add TrustProxies middleware globally
        $middleware->prepend(\App\Http\Middleware\TrustProxies::class);
        
        // Add SecureHeaders middleware for web routes
        $middleware->web(\App\Http\Middleware\SecureHeaders::class);
        
        $middleware->alias([
            'custom.jwt' => \App\Http\Middleware\JWTMiddleware::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
