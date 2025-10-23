<?php

namespace App\Filament\Resources\CouponResource\RelationManagers;

use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class CouponUsagesRelationManager extends RelationManager
{
    protected static string $relationship = 'couponUsages';

    protected static ?string $title = 'Usage History';

    protected static ?string $modelLabel = 'Usage';

    protected static ?string $pluralModelLabel = 'Usages';

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('user_id')
                    ->required()
                    ->maxLength(255),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('user_id')
            ->columns([
                Tables\Columns\TextColumn::make('user.name')
                    ->label('User')
                    ->searchable()
                    ->sortable()
                    ->default('Guest User'),

                Tables\Columns\TextColumn::make('user.email')
                    ->label('Email')
                    ->searchable()
                    ->sortable()
                    ->toggleable(),

                Tables\Columns\TextColumn::make('order.order_number')
                    ->label('Order Number')
                    ->searchable()
                    ->sortable()
                    ->url(fn($record) => $record->order_id ? route('filament.admin.resources.orders.view', $record->order_id) : null)
                    ->color('primary')
                    ->default('N/A'),

                Tables\Columns\TextColumn::make('discount_amount')
                    ->label('Discount Applied')
                    ->money('IDR')
                    ->sortable(),

                Tables\Columns\TextColumn::make('order_total')
                    ->label('Order Total')
                    ->money('IDR')
                    ->sortable()
                    ->toggleable(),

                Tables\Columns\TextColumn::make('used_at')
                    ->label('Used At')
                    ->dateTime('d M Y, H:i')
                    ->sortable()
                    ->default(fn($record) => $record->created_at->format('d M Y, H:i')),
            ])
            ->filters([
                Tables\Filters\Filter::make('recent')
                    ->label('Last 30 days')
                    ->query(fn(Builder $query): Builder => $query->where('created_at', '>=', now()->subDays(30))),

                Tables\Filters\Filter::make('high_discount')
                    ->label('High Discount (>100k)')
                    ->query(fn(Builder $query): Builder => $query->where('discount_amount', '>', 100000)),
            ])
            ->headerActions([
                // Remove create action as usage should only be created through the system
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
            ])
            ->bulkActions([
                // Remove bulk actions for usage records
            ])
            ->defaultSort('created_at', 'desc')
            ->emptyStateHeading('No Usage History')
            ->emptyStateDescription('This coupon hasn\'t been used yet.')
            ->emptyStateIcon('heroicon-o-ticket');
    }
}
