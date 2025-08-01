<?php

namespace App\Filament\Resources;

use App\Filament\Resources\FlashSaleResource\Pages;
use App\Filament\Resources\FlashSaleResource\RelationManagers;
use App\Models\FlashSale;
use App\Models\Product;
use DateTime;
use Filament\Forms;
use Filament\Forms\Components\Checkbox;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class FlashSaleResource extends Resource
{
    protected static ?string $model = FlashSale::class;

    protected static ?string $navigationIcon = 'heroicon-o-fire';

    protected static ?string $navigationGroup = 'Marketing';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                DateTimePicker::make('start_date')
                    ->label('Start Date')
                    ->required()
                    ->default(fn() => now()),

                DateTimePicker::make('end_date')
                    ->label('End Date')
                    ->required()
                    ->default(fn() => now()->addHour(12))
                    ->afterOrEqual('start_date'),

                Forms\Components\TextInput::make('discount')
                    ->label('Discount (%)')
                    ->numeric()
                    ->required()
                    ->minValue(1)
                    ->maxValue(100)
                    ->suffix('%'),
                Checkbox::make('disable_products')
                    ->label('Empty Products')
                    ->reactive(),
                Select::make('products')
                    ->label('Products')
                    ->multiple()
                    ->relationship(name: 'products', titleAttribute: 'name')
                    ->preload()
                    ->required(false)
                    ->hidden(fn(callable $get) => $get('disable_products'))
                    ->searchable()
                    ->getOptionLabelFromRecordUsing(fn($record) => "{$record->name} - Rp " . number_format($record->price, 0, ',', '.'))
                    ->helperText('Only products not already in another flash sale will be shown')
                    ->options(function () {
                        return Product::whereNull('sale_id')
                            ->orWhere('sale_id', request()->route('record')?->id ?? 0)
                            ->pluck('name', 'id');
                    })
                    ->saveRelationshipsUsing(function ($component, $state) {
                        $record = $component->getRecord();

                        // Reset all products that were previously assigned to this flash sale
                        Product::where('sale_id', $record->id)->update(['sale_id' => null]);

                        // Assign selected products to this flash sale
                        if (!empty($state)) {
                            Product::whereIn('id', $state)->update(['sale_id' => $record->id]);
                        }
                    }),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('start_date')
                    ->label('Start Date')
                    ->dateTime()
                    ->sortable(),

                TextColumn::make('end_date')
                    ->label('End Date')
                    ->dateTime()
                    ->sortable(),

                TextColumn::make('discount')
                    ->label('Discount')
                    ->suffix('%')
                    ->sortable(),

                TextColumn::make('products_count')
                    ->label('Products Count')
                    ->counts('products'),

                TextColumn::make('status')
                    ->label('Status')
                    ->getStateUsing(function ($record) {
                        $now = now();
                        if ($now->lt($record->start_date)) {
                            return 'Upcoming';
                        } elseif ($now->gt($record->end_date)) {
                            return 'Expired';
                        } else {
                            return 'Active';
                        }
                    })
                    ->colors([
                        'success' => 'Active',
                        'warning' => 'Upcoming',
                        'danger' => 'Expired',
                    ]),
            ])
            ->filters([])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListFlashSales::route('/'),
            'create' => Pages\CreateFlashSale::route('/create'),
            'edit' => Pages\EditFlashSale::route('/{record}/edit'),
        ];
    }
}
