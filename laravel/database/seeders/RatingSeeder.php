<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Rating;
use App\Models\Product;
use App\Models\User;
use Faker\Factory as Faker;

class RatingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create();

        // Get all products and users
        $products = Product::all();
        $users = User::all();

        if ($products->isEmpty() || $users->isEmpty()) {
            $this->command->info('No products or users found. Please run ProductSeeder and UserSeeder first.');
            return;
        }

        $comments = [
            'Great product! Highly recommended.',
            'Good quality for the price.',
            'Fast delivery and excellent packaging.',
            'Amazing product, exceeded my expectations!',
            'Value for money, will buy again.',
            'Perfect product, no complaints.',
            'Good build quality and design.',
            'Satisfied with the purchase.',
            'Excellent customer service and product quality.',
            'Would recommend to friends and family.',
            'Product as described, very happy.',
            'Quick delivery and great product.',
            'Outstanding quality and performance.',
            'Very pleased with this purchase.',
            'Exactly what I was looking for.',
            'Top quality product, worth every penny.',
            'Impressive features and quality.',
            'Reliable and durable product.',
            'Exceptional value and quality.',
            'Highly satisfied with the product.',
            'Could be better, but okay for the price.',
            'Average product, nothing special.',
            'Decent quality but delivery was slow.',
            'Product is okay, met basic expectations.',
            'Fair quality, some minor issues.',
        ];

        foreach ($products as $product) {
            // Generate random number of ratings per product (5-25 ratings)
            $ratingsCount = rand(5, 25);
            $totalRating = 0;

            for ($i = 0; $i < $ratingsCount; $i++) {
                $rating = $faker->numberBetween(3, 5); // Most ratings are positive (3-5 stars)

                // Occasionally add lower ratings (10% chance for 1-2 stars)
                if (rand(1, 10) == 1) {
                    $rating = $faker->numberBetween(1, 2);
                }

                $totalRating += $rating;

                Rating::create([
                    'user_id' => $users->random()->id,
                    'product_id' => $product->id,
                    'rating' => $rating,
                    'comment' => $faker->randomElement($comments),
                    'image' => null, // No images for now
                    'created_at' => $faker->dateTimeBetween('-6 months', 'now'),
                    'updated_at' => now(),
                ]);
            }

            // Calculate average rating
            $avgRating = round($totalRating / $ratingsCount, 1);

            // Update product with calculated ratings
            $product->update([
                'avg_rating' => $avgRating,
                'total_rating' => $ratingsCount,
            ]);

            $this->command->info("Product '{$product->name}' updated with {$ratingsCount} ratings, avg: {$avgRating}");
        }

        $this->command->info('Rating seeder completed successfully!');
    }
}
