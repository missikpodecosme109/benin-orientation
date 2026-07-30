<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FiliereDebouche extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = ['filiere_id', 'libelle'];

    public function filiere(): BelongsTo
    {
        return $this->belongsTo(Filiere::class);
    }
}
