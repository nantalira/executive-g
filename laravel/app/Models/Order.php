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
        'phone_number',
        'address',
        'detail_address',
        'province',
        'district',
        'sub_district',
        'village',
        'postal_code',
        'coupon_discount',
        'payment_method',
        'total_price',
        'status', // 0: pending, 1: shipped, 2: delivered
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
