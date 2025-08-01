<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VariantOption extends Model
{
    protected $table = 'variant_options';
    protected $primaryKey = 'id';
    protected $keyType = 'int';
    public $timestamps = true;
    public $incrementing = true;

    protected $fillable = [
        'variant_id',
        'name',
        'value',
    ];

    public function variant()
    {
        return $this->belongsTo(Variant::class, 'variant_id');
    }
}
