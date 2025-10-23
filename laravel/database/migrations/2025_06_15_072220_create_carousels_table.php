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
        Schema::create('carousels', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')
                ->constrained('products')
                ->onUpdate('cascade') // FK → products.id
                ->onDelete('cascade'); // FK → products.id
            $table->string('title', 100); // name VARCHAR(100) NOT NULL
            $table->string('description', 255)->nullable(); // description VARCHAR(255) NULL
            $table->string('image', 255)->nullable(); // image VARCHAR(255) NULL
            $table->tinyInteger('is_new')->default(0)->comment('0: Not New, 1: New'); // is_new TINYINT(1) NOT NULL DEFAULT 0
            $table->timestamp('created_at')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->timestamp('updated_at')->default(DB::raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('carousels');
    }
};
