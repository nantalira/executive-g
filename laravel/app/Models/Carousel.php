<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Carousel extends Model
{
    protected $table = 'carousels';
    protected $primaryKey = 'id';
    protected $keyType = 'int';
    public $timestamps = true;
    public $incrementing = true;

    protected $fillable = [
        'product_id',
        'title',
        'description',
        'image',
        'is_new'
    ];

    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }
}
