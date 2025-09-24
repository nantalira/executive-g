<?php

namespace App\Providers;

use App\Models\ProductImage;
use App\Observers\ProductImageObserver;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\URL;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Daftarkan observer untuk ProductImage
        ProductImage::observe(ProductImageObserver::class);

        // Force HTTPS in production or when FORCE_HTTPS is enabled
        if (config('app.env') === 'production' || config('app.force_https')) {
            URL::forceScheme('https');
        }

        // Fix mixed content issues by forcing HTTPS for asset URLs
        if (request()->isSecure() || config('app.force_https')) {
            $this->app['request']->server->set('HTTPS', 'on');
            URL::forceScheme('https');
        }
    }
}
