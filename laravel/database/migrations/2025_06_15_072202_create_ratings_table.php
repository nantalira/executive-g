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
        Schema::create('ratings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                ->constrained('users')
                ->onUpdate('cascade') // FK → users.id
                ->onDelete('cascade'); // FK → users.id
            $table->foreignId('product_id')
                ->constrained('products')
                ->onUpdate('cascade') // FK → products.id
                ->onDelete('cascade'); // FK → products.id
            $table->tinyInteger('rating')->unsigned(); // rating TINYINT UNSIGNED NOT NULL
            $table->text('comment')->nullable(); // comment TEXT NULL
            $table->string('image', 100)->nullable(); // image VARCHAR(100) NULL
            $table->timestamp('created_at')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->timestamp('updated_at')->default(DB::raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ratings');
    }
};
