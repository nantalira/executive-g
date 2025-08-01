<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('carts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                ->constrained('users')
                ->onUpdate('cascade') // FK → users.id
                ->onDelete('cascade'); // FK → users.id
            $table->foreignId('product_id')
                ->constrained('products')
                ->onUpdate('cascade') // FK → products.id
                ->onDelete('cascade'); // FK → products.id
            $table->integer('quantity')->unsigned(); // quantity INT UNSIGNED NOT NULL
            $table->integer('price')->unsigned(); // price INT UNSIGNED NOT NULL
            $table->tinyInteger('is_purchased')->default(0)->comment('0: Not Purchased, 1: Purchased'); // is_purchased TINYINT(1) NOT NULL DEFAULT 0
            $table->timestamp('created_at')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->timestamp('updated_at')->default(DB::raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('carts');
    }
};
