<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Etablissement extends Model
{
    use HasFactory;

    protected $fillable = ['universite_id', 'nom', 'sigle'];

    public function universite(): BelongsTo
    {
        return $this->belongsTo(Universite::class);
    }

    public function filieres(): HasMany
    {
        return $this->hasMany(Filiere::class);
    }
}
