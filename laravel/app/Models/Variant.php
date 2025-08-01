<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Variant extends Model
{
    protected $table = 'variants';
    protected $primaryKey = 'id';
    protected $keyType = 'int';
    public $timestamps = true;
    public $incrementing = true;

    protected $fillable = [
        'name',
    ];

    public function product()
    {
        return $this->hasMany(Product::class, 'variant_id');
    }

    public function variantOptions()
    {
        return $this->hasMany(VariantOption::class, 'variant_id');
    }
}
