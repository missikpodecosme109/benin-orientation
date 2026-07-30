<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SerieMatiereCoefficient extends Model
{
    public $timestamps = false;

    protected $fillable = ['serie_id', 'matiere_id', 'coefficient'];

    public function serie(): BelongsTo
    {
        return $this->belongsTo(Serie::class);
    }

    public function matiere(): BelongsTo
    {
        return $this->belongsTo(Matiere::class);
    }
}
