<?php

namespace App\Filament\Resources\CouponResource\Pages;

use App\Filament\Resources\CouponResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;
use Filament\Resources\Components\Tab;
use Illuminate\Database\Eloquent\Builder;

class ListCoupons extends ListRecords
{
    protected static string $resource = CouponResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make()
                ->label('Create New Coupon')
                ->icon('heroicon-o-plus'),
        ];
    }

    public function getTabs(): array
    {
        return [
            'all' => Tab::make('All Coupons')
                ->badge(fn() => \App\Models\Coupon::count()),

            'active' => Tab::make('Active')
                ->modifyQueryUsing(
                    fn(Builder $query) => $query
                        ->where('is_active', true)
                        ->where('start_date', '<=', now())
                        ->where('end_date', '>=', now())
                )
                ->badge(
                    fn() => \App\Models\Coupon::where('is_active', true)
                        ->where('start_date', '<=', now())
                        ->where('end_date', '>=', now())
                        ->count()
                )
                ->badgeColor('success'),

            'inactive' => Tab::make('Inactive')
                ->modifyQueryUsing(fn(Builder $query) => $query->where('is_active', false))
                ->badge(fn() => \App\Models\Coupon::where('is_active', false)->count())
                ->badgeColor('gray'),

            'expired' => Tab::make('Expired')
                ->modifyQueryUsing(fn(Builder $query) => $query->where('end_date', '<', now()))
                ->badge(fn() => \App\Models\Coupon::where('end_date', '<', now())->count())
                ->badgeColor('danger'),

            'upcoming' => Tab::make('Upcoming')
                ->modifyQueryUsing(fn(Builder $query) => $query->where('start_date', '>', now()))
                ->badge(fn() => \App\Models\Coupon::where('start_date', '>', now())->count())
                ->badgeColor('info'),
        ];
    }

    protected function getHeaderWidgets(): array
    {
        return [
            CouponResource\Widgets\CouponOverview::class,
        ];
    }
}
