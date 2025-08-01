<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ProductResource\Pages;
use App\Filament\Resources\ProductResource\RelationManagers;
use App\Models\Product;
use Filament\Forms;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class ProductResource extends Resource
{
    protected static ?string $model = Product::class;

    protected static ?string $navigationIcon = 'heroicon-o-cube';

    protected static ?string $navigationGroup = 'Product Management';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Select::make('category_id')
                    ->label('Category')
                    ->relationship('category', 'name')
                    ->required(),

                Select::make('variant_id')
                    ->label('Variant')
                    ->relationship('variants', 'name')
                    ->searchable()
                    ->preload()
                    ->nullable()
                    ->helperText('Optional: Select a variant for this product'),

                TextInput::make('name')
                    ->required()
                    ->maxLength(255),

                Textarea::make('description')
                    ->maxLength(65535),

                TextInput::make('price')
                    ->numeric()
                    ->required(),

                TextInput::make('discount')
                    ->numeric()
                    ->default(0),

                TextInput::make('stock')
                    ->numeric()
                    ->required(),

                Repeater::make('productImages')
                    ->label('Product Images')
                    ->relationship('productImages')
                    ->schema([
                        FileUpload::make('name')
                            ->label('Image')
                            ->image()
                            ->directory('products/images')
                            ->disk('public')
                            ->acceptedFileTypes(['image/jpeg', 'image/png', 'image/gif', 'image/webp'])
                            ->maxSize(2048) // 2MB
                            ->imageEditor()
                            ->imageEditorAspectRatios([
                                '16:9',
                                '4:3',
                                '1:1',
                            ])
                            ->required()
                            ->helperText('Upload gambar produk (max 2MB). Format yang didukung: JPG, PNG, GIF, WebP'),

                        Toggle::make('pinned')
                            ->reactive()
                            ->afterStateUpdated(function (callable $set, callable $get, $state) {
                                if ($state) {
                                    $images = $get('../../productImages'); // Adjust if nested deeper
                                    foreach ($images as $index => $image) {
                                        if ($get("../../productImages.{$index}.pinned") && $image !== $get()) {
                                            $set("../../productImages.{$index}.pinned", false);
                                        }
                                    }
                                }
                            }),
                    ])
                    ->collapsible()
                    ->columnSpanFull()
                    ->addActionLabel('Add Image')
                    ->deleteAction(
                        function ($action) {
                            return $action
                                ->requiresConfirmation()
                                ->modalHeading('Delete Image')
                                ->modalDescription('Are you sure you want to delete this image? This action cannot be undone and will also delete the file from storage.');
                        }
                    )
                    ->reorderAction(
                        function ($action) {
                            return $action->label('Reorder Images');
                        }
                    ),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->modifyQueryUsing(fn($query) => $query->with(['category', 'variants', 'productImages']))
            ->columns([
                TextColumn::make('name')->searchable(),
                TextColumn::make('category.name')->label('Category'),
                TextColumn::make('variants.name')->label('Variant')->placeholder('No Variant'),
                TextColumn::make('price')->money('IDR'),
                TextColumn::make('stock'),
                TextColumn::make('avg_rating'),
                TextColumn::make('total_sold')->label('Total Sold'),
                ImageColumn::make('Pinned Image')
                    ->getStateUsing(function ($record) {
                        return optional($record->productImages->where('pinned', 1)->first())->name;
                    })
                    ->label('Image')
                    ->disk('public')
                    ->circular()
                    ->height(40)
                    ->width(40),
            ])
            ->filters([
                //
            ])
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
            'index' => Pages\ListProducts::route('/'),
            'create' => Pages\CreateProduct::route('/create'),
            'edit' => Pages\EditProduct::route('/{record}/edit'),
        ];
    }
}
