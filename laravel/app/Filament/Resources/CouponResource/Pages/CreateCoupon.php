<?php

namespace App\Filament\Resources\CouponResource\Pages;

use App\Filament\Resources\CouponResource;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;
use Filament\Notifications\Notification;

class CreateCoupon extends CreateRecord
{
    protected static string $resource = CouponResource::class;

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }

    protected function getCreatedNotification(): ?Notification
    {
        return Notification::make()
            ->success()
            ->title('Coupon created successfully')
            ->body('The coupon has been created and is ready to use.');
    }

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        // Ensure end_date is after start_date
        if (isset($data['start_date']) && isset($data['end_date'])) {
            if (strtotime($data['end_date']) <= strtotime($data['start_date'])) {
                $data['end_date'] = date('Y-m-d H:i:s', strtotime($data['start_date'] . ' +1 day'));
            }
        }

        // Set default values if not provided
        $data['minimum_purchase'] = $data['minimum_purchase'] ?? 0;
        $data['usage_limit_per_user'] = $data['usage_limit_per_user'] ?? 1;
        $data['is_active'] = $data['is_active'] ?? true;

        return $data;
    }
}
