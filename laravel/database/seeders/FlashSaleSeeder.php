<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\FlashSale;
use Carbon\Carbon;

class FlashSaleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $flashSales = [
            [
                'discount' => 20,
                'start_date' => Carbon::now()->utc(),
                'end_date' => Carbon::now()->utc()->addDays(1),
            ],
            [
                'discount' => 15,
                'start_date' => Carbon::now()->utc()->addDays(1),
                'end_date' => Carbon::now()->utc()->addDays(2),
            ],
            [
                'discount' => 10,
                'start_date' => Carbon::now()->utc()->addDays(2),
                'end_date' => Carbon::now()->utc()->addDays(3),
            ],
            [
                'discount' => 50,
                'start_date' => Carbon::now()->utc()->addDays(3),
                'end_date' => Carbon::now()->utc()->addDays(4),
            ],
        ];

        foreach ($flashSales as $flashSale) {
            FlashSale::create($flashSale);
        }
    }
}
