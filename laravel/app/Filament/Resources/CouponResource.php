<?php

namespace App\Filament\Resources;

use App\Filament\Resources\CouponResource\Pages;
use App\Filament\Resources\CouponResource\RelationManagers;
use App\Models\Coupon;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Tables\Filters\Filter;
use Filament\Tables\Filters\SelectFilter;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Filament\Support\Enums\FontWeight;
use Filament\Tables\Columns\TextColumn\TextColumnSize;

class CouponResource extends Resource
{
    protected static ?string $model = Coupon::class;

    protected static ?string $navigationIcon = 'heroicon-o-ticket';

    protected static ?string $navigationLabel = 'Coupons';

    protected static ?string $modelLabel = 'Coupon';

    protected static ?string $pluralModelLabel = 'Coupons';

    protected static ?int $navigationSort = 4;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Basic Information')
                    ->schema([
                        Forms\Components\Grid::make(2)
                            ->schema([
                                Forms\Components\TextInput::make('code')
                                    ->label('Coupon Code')
                                    ->required()
                                    ->maxLength(50)
                                    ->unique(ignoreRecord: true)
                                    ->placeholder('e.g., DISCOUNT10, SAVE20K')
                                    ->helperText('Unique coupon code that customers will use'),

                                Forms\Components\TextInput::make('name')
                                    ->label('Display Name')
                                    ->required()
                                    ->maxLength(255)
                                    ->placeholder('e.g., 10% Discount, Save Rp20,000')
                                    ->helperText('Friendly name for the coupon'),
                            ]),

                        Forms\Components\Textarea::make('description')
                            ->label('Description')
                            ->maxLength(500)
                            ->rows(3)
                            ->placeholder('Brief description of the coupon offer')
                            ->columnSpanFull(),
                    ]),

                Forms\Components\Section::make('Discount Configuration')
                    ->schema([
                        Forms\Components\Grid::make(3)
                            ->schema([
                                Forms\Components\Select::make('type')
                                    ->label('Discount Type')
                                    ->required()
                                    ->options([
                                        'percentage' => 'Percentage (%)',
                                        'fixed' => 'Fixed Amount (Rp)',
                                    ])
                                    ->default('percentage')
                                    ->live()
                                    ->helperText('Choose between percentage or fixed amount discount'),

                                Forms\Components\TextInput::make('value')
                                    ->label('Discount Value')
                                    ->required()
                                    ->numeric()
                                    ->minValue(0)
                                    ->suffix(fn(Forms\Get $get): string => $get('type') === 'percentage' ? '%' : 'Rp')
                                    ->helperText(
                                        fn(Forms\Get $get): string =>
                                        $get('type') === 'percentage'
                                            ? 'Enter percentage (e.g., 10 for 10%)'
                                            : 'Enter amount in Rupiah'
                                    ),

                                Forms\Components\TextInput::make('maximum_discount')
                                    ->label('Maximum Discount')
                                    ->numeric()
                                    ->minValue(0)
                                    ->prefix('Rp')
                                    ->visible(fn(Forms\Get $get): bool => $get('type') === 'percentage')
                                    ->helperText('Maximum discount amount for percentage coupons (optional)'),
                            ]),
                    ]),

                Forms\Components\Section::make('Purchase Requirements')
                    ->schema([
                        Forms\Components\TextInput::make('minimum_purchase')
                            ->label('Minimum Purchase')
                            ->required()
                            ->numeric()
                            ->default(0)
                            ->minValue(0)
                            ->prefix('Rp')
                            ->helperText('Minimum order amount required to use this coupon'),
                    ]),

                Forms\Components\Section::make('Usage Limits')
                    ->schema([
                        Forms\Components\Grid::make(2)
                            ->schema([
                                Forms\Components\TextInput::make('usage_limit')
                                    ->label('Total Usage Limit')
                                    ->numeric()
                                    ->minValue(1)
                                    ->placeholder('Leave empty for unlimited')
                                    ->helperText('Maximum number of times this coupon can be used in total'),

                                Forms\Components\TextInput::make('usage_limit_per_user')
                                    ->label('Usage Limit Per User')
                                    ->required()
                                    ->numeric()
                                    ->default(1)
                                    ->minValue(1)
                                    ->helperText('Maximum number of times each user can use this coupon'),
                            ]),
                    ]),

                Forms\Components\Section::make('Validity Period')
                    ->schema([
                        Forms\Components\Grid::make(2)
                            ->schema([
                                Forms\Components\DateTimePicker::make('start_date')
                                    ->label('Start Date & Time')
                                    ->required()
                                    ->default(now())
                                    ->helperText('When the coupon becomes active'),

                                Forms\Components\DateTimePicker::make('end_date')
                                    ->label('End Date & Time')
                                    ->required()
                                    ->after('start_date')
                                    ->helperText('When the coupon expires'),
                            ]),
                    ]),

                Forms\Components\Section::make('Status')
                    ->schema([
                        Forms\Components\Toggle::make('is_active')
                            ->label('Active')
                            ->default(true)
                            ->helperText('Enable or disable this coupon'),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('code')
                    ->label('Code')
                    ->searchable()
                    ->sortable()
                    ->copyable()
                    ->badge()
                    ->color('primary'),

                Tables\Columns\TextColumn::make('name')
                    ->label('Name')
                    ->searchable()
                    ->sortable()
                    ->wrap(),

                Tables\Columns\TextColumn::make('type')
                    ->label('Type')
                    ->badge()
                    ->color(fn(string $state): string => match ($state) {
                        'percentage' => 'success',
                        'fixed' => 'info',
                        default => 'gray',
                    })
                    ->formatStateUsing(fn(string $state): string => match ($state) {
                        'percentage' => 'Percentage',
                        'fixed' => 'Fixed Amount',
                        default => $state,
                    }),

                Tables\Columns\TextColumn::make('value')
                    ->label('Discount')
                    ->formatStateUsing(function ($record): string {
                        if ($record->type === 'percentage') {
                            return $record->value . '%';
                        }
                        return 'Rp ' . number_format($record->value, 0, ',', '.');
                    })
                    ->sortable(),

                Tables\Columns\TextColumn::make('minimum_purchase')
                    ->label('Min. Purchase')
                    ->money('IDR')
                    ->sortable()
                    ->toggleable(),

                Tables\Columns\TextColumn::make('maximum_discount')
                    ->label('Max. Discount')
                    ->money('IDR')
                    ->sortable()
                    ->toggleable()
                    ->placeholder('No limit'),

                Tables\Columns\TextColumn::make('usage_stats')
                    ->label('Usage')
                    ->formatStateUsing(function ($record): string {
                        $used = $record->coupon_usages()->count();
                        $limit = $record->usage_limit ?? '∞';
                        return $used . ' / ' . $limit;
                    })
                    ->sortable(query: function ($query, $direction) {
                        return $query->withCount('couponUsages')
                            ->orderBy('coupon_usages_count', $direction);
                    }),

                Tables\Columns\TextColumn::make('start_date')
                    ->label('Start Date')
                    ->dateTime('d M Y, H:i')
                    ->sortable()
                    ->toggleable(),

                Tables\Columns\TextColumn::make('end_date')
                    ->label('End Date')
                    ->dateTime('d M Y, H:i')
                    ->sortable()
                    ->color(
                        fn($record): string =>
                        $record->end_date->isPast() ? 'danger' : 'success'
                    ),

                Tables\Columns\IconColumn::make('is_active')
                    ->label('Status')
                    ->boolean()
                    ->trueIcon('heroicon-o-check-circle')
                    ->falseIcon('heroicon-o-x-circle')
                    ->trueColor('success')
                    ->falseColor('danger'),

                Tables\Columns\TextColumn::make('created_at')
                    ->label('Created')
                    ->dateTime('d M Y, H:i')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('type')
                    ->label('Discount Type')
                    ->options([
                        'percentage' => 'Percentage',
                        'fixed' => 'Fixed Amount',
                    ]),

                Tables\Filters\TernaryFilter::make('is_active')
                    ->label('Status')
                    ->placeholder('All coupons')
                    ->trueLabel('Active only')
                    ->falseLabel('Inactive only'),

                Tables\Filters\Filter::make('active_period')
                    ->label('Currently Active')
                    ->query(
                        fn($query) => $query
                            ->where('is_active', true)
                            ->where('start_date', '<=', now())
                            ->where('end_date', '>=', now())
                    ),

                Tables\Filters\Filter::make('expired')
                    ->label('Expired')
                    ->query(fn($query) => $query->where('end_date', '<', now())),
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                    Tables\Actions\BulkAction::make('activate')
                        ->label('Activate')
                        ->icon('heroicon-o-check-circle')
                        ->color('success')
                        ->action(fn($records) => $records->each->update(['is_active' => true]))
                        ->deselectRecordsAfterCompletion(),
                    Tables\Actions\BulkAction::make('deactivate')
                        ->label('Deactivate')
                        ->icon('heroicon-o-x-circle')
                        ->color('danger')
                        ->action(fn($records) => $records->each->update(['is_active' => false]))
                        ->deselectRecordsAfterCompletion(),
                ]),
            ])
            ->defaultSort('created_at', 'desc');
    }

    public static function getRelations(): array
    {
        return [
            CouponResource\RelationManagers\CouponUsagesRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListCoupons::route('/'),
            'create' => Pages\CreateCoupon::route('/create'),
            'view' => Pages\ViewCoupon::route('/{record}'),
            'edit' => Pages\EditCoupon::route('/{record}/edit'),
        ];
    }
}
