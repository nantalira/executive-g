<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();                                           // id INT PRIMARY KEY
            $table->string('name', 100);                            // name VARCHAR(100) NOT NULL
            $table->tinyInteger('role')->default(1)
                ->comment('customer = 1, seller = 0');            // role TINYINT NOT NULL DEFAULT 1
            $table->string('email', 100)->unique();                 // email VARCHAR(100) UNIQUE NOT NULL
            $table->string('phone', 50)->unique();                  // phone VARCHAR(50) UNIQUE NOT NULL
            $table->string('password');                             // password VARCHAR(255) NOT NULL
            $table->timestamp('created_at')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->timestamp('updated_at')->default(DB::raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
        });
    }

    public function down()
    {
        Schema::dropIfExists('users');
    }
};
