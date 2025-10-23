<?php

namespace App\Filament\Resources\CouponResource\Widgets;

use App\Models\Coupon;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class CouponOverview extends BaseWidget
{
    protected function getStats(): array
    {
        $totalCoupons = Coupon::count();
        $activeCoupons = Coupon::where('is_active', true)
            ->where('start_date', '<=', now())
            ->where('end_date', '>=', now())
            ->count();
        $expiredCoupons = Coupon::where('end_date', '<', now())->count();
        $totalUsages = \App\Models\CouponUsage::count();

        return [
            Stat::make('Total Coupons', $totalCoupons)
                ->description('All coupons in system')
                ->descriptionIcon('heroicon-m-ticket')
                ->color('primary'),

            Stat::make('Active Coupons', $activeCoupons)
                ->description('Currently available')
                ->descriptionIcon('heroicon-m-check-circle')
                ->color('success'),

            Stat::make('Expired Coupons', $expiredCoupons)
                ->description('No longer valid')
                ->descriptionIcon('heroicon-m-x-circle')
                ->color('danger'),

            Stat::make('Total Usage', $totalUsages)
                ->description('Times coupons used')
                ->descriptionIcon('heroicon-m-shopping-cart')
                ->color('info'),
        ];
    }
}
