<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Serie extends Model
{
    use HasFactory;

    protected $fillable = ['code', 'libelle'];

    public function filieres(): BelongsToMany
    {
        return $this->belongsToMany(Filiere::class, 'filiere_serie');
    }

    public function simulations(): HasMany
    {
        return $this->hasMany(Simulation::class);
    }

    /**
     * Coefficients officiels du bac pour cette série (épreuves du 1er groupe).
     * Voir CoefficientsBacSeeder pour la source.
     */
    public function coefficientsBac(): HasMany
    {
        return $this->hasMany(SerieMatiereCoefficient::class);
    }
}
