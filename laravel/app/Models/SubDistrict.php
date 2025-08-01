<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SubDistrict extends Model
{
    protected $table = 'sub_districts';
    protected $primaryKey = 'id';
    public $timestamps = false;
    public $incrementing = true;

    protected $fillable = [
        'name',
        'district_id',
    ];

    public function district()
    {
        return $this->belongsTo(District::class, 'district_id');
    }

    public function postalCode()
    {
        return $this->hasMany(Villages::class, 'sub_district_id');
    }
}
