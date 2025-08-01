<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $table = 'orders';
    protected $primaryKey = 'id';
    protected $keyType = 'int';
    public $timestamps = true;
    public $incrementing = true;

    protected $fillable = [
        'user_id',
        'full_name',
        'phone',
        'address',
        'detail',
        'province',
        'district',
        'sub_district',
        'village',
        'postal_code',
        'cupon_discount',
        'total_price',
        'status', // 0: pending, 1: processing, 2: shipped, 3: completed, 4: cancelled
        'tracking_message',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function orderDetails()
    {
        return $this->hasMany(OrderDetail::class, 'order_id');
    }
}
