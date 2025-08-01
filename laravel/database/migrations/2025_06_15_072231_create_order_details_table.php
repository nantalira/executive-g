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
        Schema::create('order_details', function (Blueprint $table) {
            $table->id(); // id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY
            $table->foreignId('order_id')
                ->constrained('orders')
                ->onUpdate('cascade') // FK → orders.id
                ->onDelete('cascade'); // FK → orders.id
            $table->foreignId('product_id')
                ->constrained('products')
                ->onUpdate('cascade') // FK → products.id
                ->onDelete('cascade'); // FK → products.id
            $table->integer('quantity')->unsigned(); // quantity INT UNSIGNED NOT NULL
            $table->integer('total_price')->unsigned(); // price INT UNSIGNED NOT NULL
            $table->timestamp('created_at')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->timestamp('updated_at')->default(DB::raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_details');
    }
};
