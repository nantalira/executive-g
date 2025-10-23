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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('variant_id')
                ->constrained('variants') // Assuming variants table exists
                ->onUpdate('cascade') // FK → variants.id
                ->onDelete('restrict'); // FK → variants.id
            $table->foreignId('category_id')
                ->constrained('categories')
                ->onUpdate('cascade') // FK → categories.id
                ->onDelete('restrict'); // FK → categories.id
            $table->unsignedBigInteger('sale_id')->nullable(); // sale_id INT NULL
            $table->foreign('sale_id')
                ->references('id')
                ->on('flash_sales') // Assuming flash_sales table exists
                ->onUpdate('cascade') // FK → sales.id
                ->onDelete('set null'); // FK → sales.id
            $table->string('name', 255); // name VARCHAR(255) NOT NULL
            $table->text('description')->nullable(); // description TEXT NULL
            $table->integer('price'); // price INT NOT NULL
            $table->decimal('discount', 4, 2)->default(0.00); // discount DECIMAL(4,2) NOT NULL DEFAULT 0.00
            $table->integer('stock')->default(0); // stock INT NOT NULL DEFAULT 0
            $table->decimal('avg_rating', 3, 1)->default(0.00); // avg_rating DECIMAL(3,1) NOT NULL DEFAULT 0.00
            $table->integer('total_rating')->default(0); // total_ratings INT NOT NULL DEFAULT 0
            $table->integer('total_variant')->default(0); // total_ratings INT NOT NULL DEFAULT 0
            $table->integer('total_image')->default(0); // total_ratings INT NOT NULL DEFAULT 0
            $table->integer('total_sold')->default(0); // total_ratings INT NOT NULL DEFAULT 0
            $table->timestamp('created_at')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->timestamp('updated_at')->default(DB::raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
