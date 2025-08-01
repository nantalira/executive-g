<?php

namespace App\Filament\Resources\FlashSaleResource\Pages;

use App\Filament\Resources\FlashSaleResource;
use App\Models\Product;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;

class CreateFlashSale extends CreateRecord
{
    protected static string $resource = FlashSaleResource::class;

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }

    protected function afterCreate(): void
    {
        $products = $this->data['products'] ?? [];

        if (!empty($products)) {
            Product::whereIn('id', $products)->update(['sale_id' => $this->record->id]);
        }
    }
}
