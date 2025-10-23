<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        $this->call([Province::class]);
        $this->call([UserSeeder::class]);
        $this->call([CategorySeeder::class]);
        $this->call([VariantSeeder::class]);
        $this->call([FlashSaleSeeder::class]);
        $this->call([ProductSeeder::class]);
        $this->call([RatingSeeder::class]);
        $this->call([CarouselSeeder::class]);
        $this->call([CouponSeeder::class]);

        $sqlFiles = [
            database_path('seeders/districts.sql'),
            database_path('seeders/sub_districts.sql'),
            database_path('seeders/villages.sql')
        ];

        foreach ($sqlFiles as $file) {
            // Load and execute each SQL file
            DB::unprepared(file_get_contents($file));
            $this->command->info("Seeded: " . basename($file));
        }
    }
}
