<?php

namespace App\Models;

use App\Traits\HasFileUpload;
use Illuminate\Database\Eloquent\Model;

class ProductImage extends Model
{
    use HasFileUpload;

    protected $table = 'product_images';
    protected $primaryKey = 'id';
    protected $keyType = 'int';
    public $timestamps = true;
    public $incrementing = true;

    protected $fillable = [
        'product_id',
        'name',
        'pinned'
    ];

    /**
     * Directory where product images are stored
     */
    private const IMAGE_DIRECTORY = 'products/images';

    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }

    /**
     * Get the full URL of the image
     */
    public function getImageUrlAttribute(): ?string
    {
        if (!$this->name) {
            return null;
        }

        // Check if name already contains the directory path
        if (str_starts_with($this->name, self::IMAGE_DIRECTORY)) {
            return asset('storage/' . $this->name);
        }

        $filePath = $this->getFullFilePath($this->name, self::IMAGE_DIRECTORY);
        return asset('storage/' . $filePath);
    }

    /**
     * Check if this image exists in storage
     */
    public function imageExists(): bool
    {
        if (!$this->name) {
            return false;
        }

        // Check if name already contains the directory path
        if (str_starts_with($this->name, self::IMAGE_DIRECTORY)) {
            return $this->fileExists($this->name);
        }

        return $this->fileExists($this->getFullFilePath($this->name, self::IMAGE_DIRECTORY));
    }
}
