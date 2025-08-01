<?php

namespace App\Filament\Resources\FlashSaleResource\Pages;

use App\Filament\Resources\FlashSaleResource;
use App\Models\Product;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditFlashSale extends EditRecord
{
    protected static string $resource = FlashSaleResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make()
                ->before(function () {
                    // Reset products sale_id to null before deleting flash sale
                    Product::where('sale_id', $this->record->id)->update(['sale_id' => null]);
                }),
        ];
    }

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }
}
