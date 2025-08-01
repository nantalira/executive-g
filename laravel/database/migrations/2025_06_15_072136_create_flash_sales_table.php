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
        Schema::create('flash_sales', function (Blueprint $table) {
            $table->id();
            $table->dateTime('start_date')->default(now()); // start_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
            $table->decimal('discount', 8, 2)->default(0.00);
            $table->dateTime('end_date')->default(now()->addHour(12)); // end_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP + INTERVAL 12 HOUR
            $table->timestamp('created_at')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->timestamp('updated_at')->default(DB::raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('flash_sales');
    }
};
