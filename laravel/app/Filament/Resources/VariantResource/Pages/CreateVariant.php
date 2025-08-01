<?php

namespace App\Filament\Resources\VariantResource\Pages;

use App\Filament\Resources\VariantResource;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;

class CreateVariant extends CreateRecord
{
    protected static string $resource = VariantResource::class;
    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }
}
