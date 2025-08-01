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
        Schema::create('addresses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                ->constrained('users')
                ->onDelete('cascade')
                ->onUpdate('cascade'); // FK → users.id
            $table->string('fullname', 100); // name VARCHAR(100) NOT NULL
            $table->string('phone', 20); // phone VARCHAR(20) NOT NULL
            $table->string('address', 255); // address VARCHAR(255) NOT NULL
            $table->string('province', 100); // province VARCHAR(100) NOT NULL
            $table->string('district', 100); // district VARCHAR(100) NOT NULL
            $table->string('sub_district', 100); // sub_district VARCHAR(100) NOT NULL
            $table->string('village', 100); // village VARCHAR(100) NULL
            $table->string('postal_code', 20); // postal_code VARCHAR(20) NOT NULL
            $table->tinyInteger('pinned')->default(0)->comment('0: Not Pinned, 1: Pinned'); // pinned TINYINT(1) NOT NULL DEFAULT 0
            $table->timestamp('created_at')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->timestamp('updated_at')->default(DB::raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('addresses');
    }
};
