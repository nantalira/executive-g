<?php

namespace App\Traits;

use Illuminate\Support\Facades\Storage;

trait HasFileUpload
{
    /**
     * Delete file from storage
     *
     * @param string $filePath
     * @param string $disk
     * @return bool
     */
    protected function deleteFileFromStorage(string $filePath, string $disk = 'public'): bool
    {
        if (Storage::disk($disk)->exists($filePath)) {
            return Storage::disk($disk)->delete($filePath);
        }

        return false;
    }

    /**
     * Check if file exists in storage
     *
     * @param string $filePath
     * @param string $disk
     * @return bool
     */
    protected function fileExists(string $filePath, string $disk = 'public'): bool
    {
        return Storage::disk($disk)->exists($filePath);
    }

    /**
     * Get full file path with directory
     *
     * @param string $fileName
     * @param string $directory
     * @return string
     */
    protected function getFullFilePath(string $fileName, string $directory): string
    {
        return $directory . '/' . $fileName;
    }
}
