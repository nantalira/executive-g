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
        Schema::create('orders', function (Blueprint $table) {
            $table->id(); // id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY
            $table->foreignId('user_id')
                ->constrained('users')
                ->onUpdate('cascade') // FK → users.id
                ->onDelete('cascade'); // FK → users.id
            $table->string('full_name', 100); // full_name VARCHAR(100) NOT NULL
            $table->string('phone_number', 20); // phone_number VARCHAR(20) NOT NULL
            $table->string('address', 255); // address VARCHAR(255) NOT NULL
            $table->text('detail_address')->nullable(); // detail_address TEXT NULL
            $table->string('province', 100); // province VARCHAR(100) NOT NULL
            $table->string('district', 100); // district VARCHAR(100) NOT NULL
            $table->string('sub_district', 100); // sub_district VARCHAR(100) NOT NULL
            $table->string('village', 100); // village VARCHAR(100) NOT NULL
            $table->string('postal_code', 20); // postal_code VARCHAR(20) NOT NULL
            $table->decimal('coupon_discount', 5, 2)->default(0.00); // coupon_discount DECIMAL(5,2) NOT NULL DEFAULT 0.00
            $table->string('payment_method', 50)->default('cash'); // payment_method VARCHAR(50) NOT NULL DEFAULT 'cash'
            $table->integer('total_price')->unsigned(); // total_price INT UNSIGNED NOT NULL
            $table->tinyInteger('status')->default(0)->comment('0: Pending, 1: Shipped, 2: Delivered'); // status TINYINT(1) NOT NULL DEFAULT 0
            $table->string('tracking_message', 255)->nullable(); // tracking_message VARCHAR(255) NULL
            $table->timestamp('created_at')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->timestamp('updated_at')->default(DB::raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
