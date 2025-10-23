<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Carbon\Carbon;

class Coupon extends Model
{
    protected $fillable = [
        'code',
        'name',
        'description',
        'type',
        'value',
        'minimum_purchase',
        'maximum_discount',
        'usage_limit',
        'usage_limit_per_user',
        'start_date',
        'end_date',
        'is_active'
    ];

    protected $casts = [
        'value' => 'decimal:2',
        'minimum_purchase' => 'decimal:2',
        'maximum_discount' => 'decimal:2',
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'is_active' => 'boolean'
    ];

    /**
     * Relationship with coupon usages
     */
    public function couponUsages(): HasMany
    {
        return $this->hasMany(CouponUsage::class);
    }

    /**
     * Scope for active coupons
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope for valid coupons (within date range)
     */
    public function scopeValid($query)
    {
        $now = now();
        return $query->where('start_date', '<=', $now)
            ->where('end_date', '>=', $now);
    }

    /**
     * Check if coupon is valid for given amount
     */
    public function isValidForAmount($amount): bool
    {
        return $amount >= $this->minimum_purchase;
    }

    /**
     * Calculate discount amount based on coupon type and value
     */
    public function calculateDiscount($orderTotal): float
    {
        if ($this->type === 'percentage') {
            $discount = ($orderTotal * $this->value) / 100;

            // Apply maximum discount limit if set
            if ($this->maximum_discount && $discount > $this->maximum_discount) {
                return (float) $this->maximum_discount;
            }

            return (float) $discount;
        }

        // Fixed discount type
        return (float) min($this->value, $orderTotal);
    }

    /**
     * Get remaining usage count for this coupon
     */
    public function getRemainingUsage(): ?int
    {
        if (!$this->usage_limit) {
            return null; // Unlimited usage
        }

        $used = $this->couponUsages()->count();
        return max(0, $this->usage_limit - $used);
    }

    /**
     * Get usage count for specific user
     */
    public function getUserUsageCount($userId): int
    {
        return $this->couponUsages()
            ->where('user_id', $userId)
            ->count();
    }

    /**
     * Check if coupon can be used by user
     */
    public function canBeUsedByUser($userId): bool
    {
        // Check if coupon is active and valid
        if (
            !$this->is_active ||
            $this->start_date > now() ||
            $this->end_date < now()
        ) {
            return false;
        }

        // Check global usage limit
        if ($this->usage_limit && $this->getRemainingUsage() <= 0) {
            return false;
        }

        // Check per-user usage limit
        if (
            $this->usage_limit_per_user &&
            $this->getUserUsageCount($userId) >= $this->usage_limit_per_user
        ) {
            return false;
        }

        return true;
    }

    /**
     * Get human readable discount display
     */
    public function getDiscountDisplayAttribute(): string
    {
        if ($this->type === 'percentage') {
            return $this->value . '%';
        }

        return 'Rp' . number_format($this->value, 0, ',', '.');
    }

    /**
     * Get human readable minimum purchase display
     */
    public function getMinimumPurchaseDisplayAttribute(): string
    {
        return 'Rp' . number_format($this->minimum_purchase, 0, ',', '.');
    }
}
