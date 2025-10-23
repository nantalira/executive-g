<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Carousel;
use App\Models\Product;

class CarouselSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = Product::limit(5)->get(); // Get first 5 products for carousel

        $carouselData = [
            [
                'title' => 'New Flagship Smartphone',
                'description' => 'Experience the latest technology with premium features',
                'is_new' => 1
            ],
            [
                'title' => 'Professional Computing',
                'description' => 'Power your creativity with cutting-edge performance',
                'is_new' => 1
            ],
            [
                'title' => 'Fashion Forward',
                'description' => 'Step up your style with premium footwear',
                'is_new' => 0
            ],
            [
                'title' => 'Active Lifestyle',
                'description' => 'Gear up for your fitness journey with premium athletic wear',
                'is_new' => 0
            ],
            [
                'title' => 'Knowledge & Growth',
                'description' => 'Expand your mind with our curated book collection',
                'is_new' => 0
            ]
        ];

        foreach ($carouselData as $index => $data) {
            if (isset($products[$index])) {
                Carousel::updateOrCreate(
                    [
                        'product_id' => $products[$index]->id,
                        'title' => $data['title']
                    ],
                    [
                        'product_id' => $products[$index]->id,
                        'title' => $data['title'],
                        'description' => $data['description'],
                        'is_new' => $data['is_new'],
                    ]
                );
            }
        }
    }
}
