<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CouponUsage extends Model
{
    protected $fillable = [
        'coupon_id',
        'user_id',
        'order_id',
        'discount_amount',
        'order_total',
        'used_at'
    ];

    protected $casts = [
        'discount_amount' => 'decimal:2',
        'order_total' => 'decimal:2',
        'used_at' => 'datetime'
    ];

    /**
     * Relationship with coupon
     */
    public function coupon(): BelongsTo
    {
        return $this->belongsTo(Coupon::class);
    }

    /**
     * Relationship with user
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relationship with order (optional)
     */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * Get discount percentage from order total
     */
    public function getDiscountPercentageAttribute(): float
    {
        if ($this->order_total <= 0) {
            return 0;
        }

        return ($this->discount_amount / $this->order_total) * 100;
    }

    /**
     * Get savings amount display
     */
    public function getSavingsDisplayAttribute(): string
    {
        return 'Rp' . number_format($this->discount_amount, 0, ',', '.');
    }

    /**
     * Scope for specific user
     */
    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Scope for specific coupon
     */
    public function scopeForCoupon($query, $couponId)
    {
        return $query->where('coupon_id', $couponId);
    }

    /**
     * Scope for date range
     */
    public function scopeInDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('used_at', [$startDate, $endDate]);
    }
}
