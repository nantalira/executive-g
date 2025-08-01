<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FlashSale extends Model
{
    protected $table = 'flash_sales';
    protected $primaryKey = 'id';
    protected $keyType = 'int';
    public $timestamps = false;
    public $incrementing = true;

    protected $fillable = [
        'discount',
        'start_date',
        'end_date'
    ];

    protected $casts = [
        'discount' => 'decimal:2',
        'start_date' => 'datetime',
        'end_date' => 'datetime',
    ];

    public function products()
    {
        return $this->hasMany(Product::class, 'sale_id');
    }
}
