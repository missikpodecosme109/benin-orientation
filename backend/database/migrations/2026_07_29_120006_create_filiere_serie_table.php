<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('filiere_serie', function (Blueprint $table) {
            $table->id();
            $table->foreignId('filiere_id')->constrained()->cascadeOnDelete();
            $table->foreignId('serie_id')->constrained()->cascadeOnDelete();
            $table->unique(['filiere_id', 'serie_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('filiere_serie');
    }
};
