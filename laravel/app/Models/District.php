<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class District extends Model
{
    protected $table = 'districts';
    protected $primaryKey = 'id';
    protected $keyType = 'int';
    public $timestamps = true;
    public $incrementing = true;

    protected $fillable = [
        'province_id',
        'name'
    ];

    public function province()
    {
        return $this->belongsTo(Province::class, 'province_id');
    }

    public function subDistrict()
    {
        return $this->hasMany(SubDistrict::class, 'district_id');
    }
}
