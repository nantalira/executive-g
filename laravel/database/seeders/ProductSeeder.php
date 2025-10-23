<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\Category;
use App\Models\Variant;
use App\Models\FlashSale;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get existing categories, variants, and flash sales
        $categories = Category::all();
        $variants = Variant::all();
        $flashSales = FlashSale::all();

        // Sample products
        $products = [
            [
                'name' => 'Samsung Galaxy S24 Ultra',
                'description' => 'Flagship smartphone with advanced camera system and S Pen functionality',
                'price' => 12999000,
                'discount' => 10.00, // 10% discount
                'stock' => 25,
                'avg_rating' => 4.8,
                'total_rating' => 120,
                'total_variant' => 3,
                'total_sold' => 45,
                'category' => 'Phones',
                'variant' => 'Storage',
                'sale_index' => 1 // Flash sale with 20% discount
            ],
            [
                'name' => 'MacBook Pro M3',
                'description' => 'Professional laptop with Apple M3 chip for creative professionals',
                'price' => 28999000,
                'discount' => 15.00, // 15% discount
                'stock' => 15,
                'avg_rating' => 4.9,
                'total_rating' => 85,
                'total_variant' => 2,
                'total_sold' => 28,
                'category' => 'Computers',
                'variant' => 'Memory',
                'sale_index' => 2 // Weekend sale with 15% discount
            ],
            [
                'name' => 'Apple Watch Series 9',
                'description' => 'Advanced smartwatch with health monitoring and fitness tracking',
                'price' => 1599000,
                'discount' => 0.00, // No discount
                'stock' => 50,
                'avg_rating' => 4.6,
                'total_rating' => 200,
                'total_variant' => 5,
                'total_sold' => 120,
                'category' => 'SmartWatch',
                'variant' => 'Size',
                'sale_index' => 0 // No sale
            ],
            [
                'name' => 'Samsung Galaxy Watch Ultra',
                'description' => 'Premium smartwatch with advanced sports tracking and rugged design',
                'price' => 2299000,
                'discount' => 5.00, // 5% discount
                'stock' => 35,
                'avg_rating' => 4.7,
                'total_rating' => 150,
                'total_variant' => 4,
                'total_sold' => 75,
                'category' => 'SmartWatch',
                'variant' => 'Size',
                'sale_index' => 3 // Member sale with 10% discount
            ],
            [
                'name' => 'Canon EOS R6 Mark II',
                'description' => 'Professional mirrorless camera with exceptional image quality',
                'price' => 89000000,
                'discount' => 0.00, // No discount
                'stock' => 100,
                'avg_rating' => 4.5,
                'total_rating' => 300,
                'total_variant' => 1,
                'total_sold' => 250,
                'category' => 'Camera',
                'variant' => 'None',
                'sale_index' => 0 // No sale
            ],
            [
                'name' => 'Sony Alpha A7R V',
                'description' => 'High-resolution full-frame mirrorless camera for professionals',
                'price' => 129000000,
                'discount' => 8.00, // 8% discount
                'stock' => 80,
                'avg_rating' => 4.8,
                'total_rating' => 400,
                'total_variant' => 1,
                'total_sold' => 320,
                'category' => 'Camera',
                'variant' => 'None',
                'sale_index' => 2 // Weekend sale with 15% discount
            ],
            [
                'name' => 'Sony WH-1000XM5',
                'description' => 'Premium wireless noise-canceling headphones with superior sound quality',
                'price' => 2799000,
                'discount' => 12.00, // 12% discount
                'stock' => 20,
                'avg_rating' => 4.4,
                'total_rating' => 80,
                'total_variant' => 3,
                'total_sold' => 35,
                'category' => 'HeadPhones',
                'variant' => 'Color',
                'sale_index' => 4 // Clearance sale with 50% discount
            ],
            [
                'name' => 'Bose QuietComfort Ultra',
                'description' => 'Advanced wireless headphones with world-class noise cancellation',
                'price' => 3499000,
                'discount' => 0.00, // No discount
                'stock' => 12,
                'avg_rating' => 4.6,
                'total_rating' => 60,
                'total_variant' => 2,
                'total_sold' => 18,
                'category' => 'HeadPhones',
                'variant' => 'Size',
                'sale_index' => 0 // No sale
            ],
            [
                'name' => 'PlayStation 5 Pro',
                'description' => 'Next-generation gaming console with enhanced 4K performance',
                'price' => 15900000,
                'discount' => 0.00, // No discount
                'stock' => 200,
                'avg_rating' => 4.3,
                'total_rating' => 180,
                'total_variant' => 1,
                'total_sold' => 150,
                'category' => 'Gaming',
                'variant' => 'None',
                'sale_index' => 0 // No sale
            ],
            [
                'name' => 'Xbox Series X',
                'description' => 'Powerful gaming console with fast loading and stunning visuals',
                'price' => 12490000,
                'discount' => 20.00, // 20% discount
                'stock' => 75,
                'avg_rating' => 4.7,
                'total_rating' => 120,
                'total_variant' => 2,
                'total_sold' => 90,
                'category' => 'Gaming',
                'variant' => 'None',
                'sale_index' => 3 // Member sale with 10% discount
            ]
        ];

        foreach ($products as $productData) {
            // Find related models
            $category = $categories->where('name', $productData['category'])->first();
            $variant = $variants->where('name', $productData['variant'])->first();
            $flashSale = $flashSales->skip($productData['sale_index'])->first();

            if ($category && $variant && $flashSale) {
                Product::updateOrCreate(
                    ['name' => $productData['name']],
                    [
                        'category_id' => $category->id,
                        'variant_id' => $variant->id,
                        'sale_id' => $flashSale->id,
                        'name' => $productData['name'],
                        'description' => $productData['description'],
                        'price' => $productData['price'],
                        'discount' => $productData['discount'],
                        'stock' => $productData['stock'],
                        'avg_rating' => $productData['avg_rating'],
                        'total_rating' => $productData['total_rating'],
                        'total_variant' => $productData['total_variant'],
                        'total_sold' => $productData['total_sold'],
                    ]
                );
            }
        }
    }
}
