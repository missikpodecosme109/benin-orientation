<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Filiere extends Model
{
    use HasFactory;

    protected $fillable = [
        'etablissement_id',
        'nom',
        'quota_bourse',
        'quota_aide_fpp',
        'mode_entree',
    ];

    public function etablissement(): BelongsTo
    {
        return $this->belongsTo(Etablissement::class);
    }

    public function series(): BelongsToMany
    {
        return $this->belongsToMany(Serie::class, 'filiere_serie');
    }

    public function debouches(): HasMany
    {
        return $this->hasMany(FiliereDebouche::class);
    }

    public function favoris(): HasMany
    {
        return $this->hasMany(Favori::class);
    }

    /**
     * Matières prises en compte pour cette filière, pour une série de bac donnée.
     * On passe par la table pivot filiere_serie_matiere car chaque filière
     * peut demander des matières différentes selon la série du candidat
     * (ex: "C, D : Anglais, Maths, PCT" vs "E, F2 : Français, Maths, PCT").
     */
    public function matieresPourSerie(int $serieId): Collection
    {
        return Matiere::query()
            ->join('filiere_serie_matiere', 'matieres.id', '=', 'filiere_serie_matiere.matiere_id')
            ->where('filiere_serie_matiere.filiere_id', $this->id)
            ->where('filiere_serie_matiere.serie_id', $serieId)
            ->select('matieres.*')
            ->get();
    }
}
