<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up()
    {
        Schema::create('user_details', function (Blueprint $table) {
            $table->id();                                           // id INT PRIMARY KEY
            $table->foreignId('user_id')
                ->constrained('users')
                ->onDelete('cascade')
                ->onUpdate('cascade');                            // FK → users.id
            $table->string('provider_id')->nullable();              // provider_id VARCHAR, nullable
            $table->string('provider_name')->nullable();            // provider_name VARCHAR, nullable
            $table->string('provider_token')->nullable();           // provider_token VARCHAR, nullable
            $table->string('provider_refresh_token')->nullable();   // provider_refresh_token VARCHAR, nullable
            $table->timestamp('created_at')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->timestamp('updated_at')->default(DB::raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
        });
    }

    public function down()
    {
        Schema::dropIfExists('user_details');
    }
};
