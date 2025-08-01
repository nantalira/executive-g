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
            $table->string('fullname', 100); // fullname VARCHAR(100) NOT NULL
            $table->string('phone', 20); // phone VARCHAR(20) NOT NULL
            $table->string('address', 255); // address VARCHAR(255) NOT NULL
            $table->text('detail')->nullable(); // details TEXT NULL
            $table->string('province', 100); // province VARCHAR(100) NOT NULL
            $table->string('district', 100); // district VARCHAR(100) NOT NULL
            $table->string('sub_district', 100); // sub_district VARCHAR(100) NOT NULL
            $table->string('village', 100); // village VARCHAR(100) NULL
            $table->string('postal_code', 20); // postal_code VARCHAR(20) NOT NULL
            $table->decimal('cupon_discount', 3, 1)->default(0.00); // cupon_discount DECIMAL(1,3) NOT NULL DEFAULT 0.00
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
