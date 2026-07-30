<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Coefficients officiels de l'examen du Baccalauréat béninois par
     * matière et par série (épreuves du premier groupe uniquement).
     * Source : arrêté interministériel N°016-2003/MESRS/MEPS/METFP,
     * publié par l'Office du Baccalauréat du Bénin.
     */
    public function up(): void
    {
        Schema::create('serie_matiere_coefficients', function (Blueprint $table) {
            $table->id();
            $table->foreignId('serie_id')->constrained()->cascadeOnDelete();
            $table->foreignId('matiere_id')->constrained()->cascadeOnDelete();
            $table->unsignedTinyInteger('coefficient');
            $table->unique(['serie_id', 'matiere_id'], 'smc_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('serie_matiere_coefficients');
    }
};
