<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Variant;

class VariantSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $variants = [
            ['name' => 'Color'],
            ['name' => 'Size'],
            ['name' => 'Storage'],
            ['name' => 'Memory'],
            ['name' => 'None'], // For products without variants
        ];

        foreach ($variants as $variant) {
            Variant::updateOrCreate(
                ['name' => $variant['name']],
                $variant
            );
        }
    }
}
