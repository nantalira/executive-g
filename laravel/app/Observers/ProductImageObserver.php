<?php

namespace App\Observers;

use App\Models\ProductImage;
use Illuminate\Support\Facades\Storage;

class ProductImageObserver
{
    /**
     * Directory where product images are stored
     */
    private const IMAGE_DIRECTORY = 'products/images';

    /**
     * Handle the ProductImage "updating" event.
     */
    public function updating(ProductImage $productImage): void
    {
        // Jika field 'name' berubah, hapus file lama
        if ($productImage->isDirty('name')) {
            $oldFileName = $productImage->getOriginal('name');

            if ($oldFileName) {
                // Check if filename already contains directory path
                if (str_starts_with($oldFileName, self::IMAGE_DIRECTORY)) {
                    $oldFilePath = $oldFileName;
                } else {
                    $oldFilePath = self::IMAGE_DIRECTORY . '/' . $oldFileName;
                }

                if (Storage::disk('public')->exists($oldFilePath)) {
                    Storage::disk('public')->delete($oldFilePath);

                    // Log untuk debugging (optional)
                    logger()->info("Deleted old product image: {$oldFilePath}");
                }
            }
        }
    }

    /**
     * Handle the ProductImage "deleting" event.
     */
    public function deleting(ProductImage $productImage): void
    {
        if ($productImage->name) {
            // Check if filename already contains directory path
            if (str_starts_with($productImage->name, self::IMAGE_DIRECTORY)) {
                $filePath = $productImage->name;
            } else {
                $filePath = self::IMAGE_DIRECTORY . '/' . $productImage->name;
            }

            if (Storage::disk('public')->exists($filePath)) {
                Storage::disk('public')->delete($filePath);

                // Log untuk debugging (optional)
                logger()->info("Deleted product image on delete: {$filePath}");
            }
        }
    }

    /**
     * Handle the ProductImage "restored" event.
     */
    public function restored(ProductImage $productImage): void
    {
        // Jika model menggunakan soft delete dan di-restore,
        // kita mungkin perlu melakukan sesuatu di sini
        // Untuk saat ini, kita tidak perlu melakukan apa-apa
    }

    /**
     * Handle the ProductImage "force deleted" event.
     */
    public function forceDeleted(ProductImage $productImage): void
    {
        // Pastikan file benar-benar terhapus pada force delete
        if ($productImage->name) {
            // Check if filename already contains directory path
            if (str_starts_with($productImage->name, self::IMAGE_DIRECTORY)) {
                $filePath = $productImage->name;
            } else {
                $filePath = self::IMAGE_DIRECTORY . '/' . $productImage->name;
            }

            if (Storage::disk('public')->exists($filePath)) {
                Storage::disk('public')->delete($filePath);

                logger()->info("Force deleted product image: {$filePath}");
            }
        }
    }
}
