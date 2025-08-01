<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\UserDetail;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::create([
            'name' => 'Admin',
            'email' => 'admin@gmail.com',
            'role' => 0, // 0 for seller
            'password' => bcrypt('Admin#123'),
            'phone' => '08123456789'
        ]);
        UserDetail::create([
            'user_id' => $user->id,
        ]);
    }
}
