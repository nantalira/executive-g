<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Address extends Model
{
    protected $table = 'addresses';
    protected $primaryKey = 'id';
    protected $keyType = 'int';
    public $timestamps = true;
    public $incrementing = true;

    protected $fillable = [
        'user_id',
        'fullname',
        'phone',
        'address',
        'detail',
        'province',
        'district',
        'sub_district',
        'village',
        'postal_code',
        'pinned'
    ];

    protected $casts = [
        'pinned' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
