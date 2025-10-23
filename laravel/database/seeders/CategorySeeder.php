<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            ['name' => 'Phones', 'icon' => 'Phone'],
            ['name' => 'Computers', 'icon' => 'Laptop'],
            ['name' => 'SmartWatch', 'icon' => 'Watch'],
            ['name' => 'Camera', 'icon' => 'Camera'],
            ['name' => 'HeadPhones', 'icon' => 'Headset'],
            ['name' => 'Gaming', 'icon' => 'Joystick'],
        ];

        foreach ($categories as $category) {
            Category::updateOrCreate(
                ['name' => $category['name']],
                $category
            );
        }
    }
}
