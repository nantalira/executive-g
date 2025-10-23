<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $table = 'products';
    protected $primaryKey = 'id';
    protected $keyType = 'int';
    public $timestamps = true;
    public $incrementing = true;

    protected $fillable = [
        'category_id',
        'variant_id',
        'sale_id',
        'name',
        'description',
        'price',
        'discount',
        'stock',
        'avg_rating',
        'total_rating',
        'total_variant',
        'total_sold'
    ];

    protected $appends = ['discounted_price'];

    /**
     * Get the discounted price
     *
     * @return int
     */
    public function getDiscountedPriceAttribute()
    {
        if ($this->discount <= 0) {
            return $this->price;
        }

        $discountAmount = ($this->price * $this->discount) / 100;
        return (int)($this->price - $discountAmount);
    }

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    public function sale()
    {
        return $this->belongsTo(FlashSale::class, 'sale_id');
    }

    public function ratings()
    {
        return $this->hasMany(Rating::class, 'product_id');
    }

    public function carts()
    {
        return $this->hasMany(Cart::class, 'product_id');
    }

    public function productImages()
    {
        return $this->hasMany(ProductImage::class, 'product_id');
    }

    public function variants()
    {
        return $this->belongsTo(Variant::class, 'variant_id');
    }

    public function carousels()
    {
        return $this->hasMany(Carousel::class, 'product_id');
    }

    public function orderDetails()
    {
        return $this->hasMany(OrderDetail::class, 'product_id');
    }
}
