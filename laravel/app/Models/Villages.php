<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Villages extends Model
{
    protected $table = 'villages';
    protected $primaryKey = 'id';
    public $timestamps = false;
    public $incrementing = true;

    protected $fillable = [
        'sub_district_id',
        'name',
    ];

    public function subDistrict()
    {
        return $this->belongsTo(SubDistrict::class, 'sub_district_id');
    }
}
