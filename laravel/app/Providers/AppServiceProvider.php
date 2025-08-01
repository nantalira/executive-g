<?php

namespace App\Providers;

use App\Models\ProductImage;
use App\Observers\ProductImageObserver;
use Illuminate\Support\ServiceProvider;

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
    }
}
