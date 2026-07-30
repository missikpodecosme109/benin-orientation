<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('filiere_serie_matiere', function (Blueprint $table) {
            $table->id();
            $table->foreignId('filiere_id')->constrained()->cascadeOnDelete();
            $table->foreignId('serie_id')->constrained()->cascadeOnDelete();
            $table->foreignId('matiere_id')->constrained()->cascadeOnDelete();
            $table->unique(['filiere_id', 'serie_id', 'matiere_id'], 'fsm_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('filiere_serie_matiere');
    }
};
