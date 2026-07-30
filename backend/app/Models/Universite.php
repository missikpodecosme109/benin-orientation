<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Universite extends Model
{
    use HasFactory;

    protected $fillable = ['nom', 'sigle'];

    public function etablissements(): HasMany
    {
        return $this->hasMany(Etablissement::class);
    }
}
