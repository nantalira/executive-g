<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class CreateProvincesTable extends Migration
{
    public function up()
    {
        Schema::create('provinces', function (Blueprint $table) {
            $table->id();                                           // id INT PRIMARY KEY
            $table->string('name', 100);                // name VARCHAR(100) UNIQUE NOT NULL
            $table->timestamp('created_at')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->timestamp('updated_at')->default(DB::raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));                               // created_at, updated_at with CURRENT_TIMESTAMP
        });
    }

    public function down()
    {
        Schema::dropIfExists('provinces');
    }
}
