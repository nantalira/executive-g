<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CouponSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $coupons = [
            [
                'code' => 'DISCOUNT10',
                'name' => '10% Discount',
                'description' => 'Get 10% off on your purchase with minimum spend of Rp100,000',
                'type' => 'percentage',
                'value' => 10.00,
                'minimum_purchase' => 100000.00,
                'maximum_discount' => 50000.00,
                'usage_limit' => 100,
                'usage_limit_per_user' => 1,
                'start_date' => now(),
                'end_date' => now()->addMonths(3),
                'is_active' => true,
            ],
            [
                'code' => 'SAVE20K',
                'name' => 'Save Rp20,000',
                'description' => 'Fixed discount of Rp20,000 with minimum purchase of Rp150,000',
                'type' => 'fixed',
                'value' => 20000.00,
                'minimum_purchase' => 150000.00,
                'maximum_discount' => null,
                'usage_limit' => 50,
                'usage_limit_per_user' => 1,
                'start_date' => now(),
                'end_date' => now()->addMonths(2),
                'is_active' => true,
            ],
            [
                'code' => 'WELCOME15',
                'name' => 'Welcome 15% Off',
                'description' => 'Welcome discount 15% for new customers with minimum purchase of Rp200,000',
                'type' => 'percentage',
                'value' => 15.00,
                'minimum_purchase' => 200000.00,
                'maximum_discount' => 75000.00,
                'usage_limit' => null, // Unlimited
                'usage_limit_per_user' => 1,
                'start_date' => now(),
                'end_date' => now()->addYear(),
                'is_active' => true,
            ],
            [
                'code' => 'EXPIRED',
                'name' => 'Expired Coupon',
                'description' => 'This coupon has expired for testing purposes',
                'type' => 'percentage',
                'value' => 25.00,
                'minimum_purchase' => 50000.00,
                'maximum_discount' => null,
                'usage_limit' => 10,
                'usage_limit_per_user' => 1,
                'start_date' => now()->subMonths(2),
                'end_date' => now()->subDays(1), // Expired yesterday
                'is_active' => true,
            ],
            [
                'code' => 'INACTIVE',
                'name' => 'Inactive Coupon',
                'description' => 'This coupon is inactive for testing purposes',
                'type' => 'fixed',
                'value' => 30000.00,
                'minimum_purchase' => 100000.00,
                'maximum_discount' => null,
                'usage_limit' => 20,
                'usage_limit_per_user' => 2,
                'start_date' => now(),
                'end_date' => now()->addMonths(6),
                'is_active' => false, // Inactive
            ]
        ];

        foreach ($coupons as $coupon) {
            \App\Models\Coupon::create($coupon);
        }
    }
}
