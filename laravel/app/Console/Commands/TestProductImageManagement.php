<?php

namespace App\Console\Commands;

use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class TestProductImageManagement extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'test:product-image-management';

    /**
     * The console command description.
     */
    protected $description = 'Test automatic file management for product images';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Testing Product Image File Management...');

        // Pastikan direktori ada
        if (!Storage::disk('public')->exists('products/images')) {
            Storage::disk('public')->makeDirectory('products/images');
            $this->info('Created products/images directory');
        }

        // Test 1: List existing files
        $this->info('Current files in products/images:');
        $files = Storage::disk('public')->files('products/images');
        foreach ($files as $file) {
            $this->line("- $file");
        }

        // Test 2: Show current ProductImages in database
        $this->info('Current ProductImages in database:');
        $productImages = ProductImage::all();
        foreach ($productImages as $image) {
            $exists = $image->imageExists() ? 'EXISTS' : 'MISSING';
            $this->line("- ID: {$image->id}, Name: {$image->name}, Status: $exists");
        }

        // Test 3: Cleanup orphaned files
        $this->info('Checking for orphaned files...');
        $dbFiles = ProductImage::pluck('name')->filter()->toArray();
        $storageFiles = collect(Storage::disk('public')->files('products/images'))
            ->map(function ($file) {
                return basename($file);
            })->toArray();

        $orphanedFiles = array_diff($storageFiles, $dbFiles);

        if (count($orphanedFiles) > 0) {
            $this->warn('Found orphaned files:');
            foreach ($orphanedFiles as $file) {
                $this->line("- $file");
            }

            if ($this->confirm('Do you want to delete orphaned files?')) {
                foreach ($orphanedFiles as $file) {
                    Storage::disk('public')->delete('products/images/' . $file);
                    $this->info("Deleted: $file");
                }
            }
        } else {
            $this->info('No orphaned files found.');
        }

        $this->info('Test completed!');
    }
}
