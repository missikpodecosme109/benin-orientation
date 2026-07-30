<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Simulation extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'serie_id', 'notes', 'resultats'];

    protected $casts = [
        'notes' => 'array',
        'resultats' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function serie(): BelongsTo
    {
        return $this->belongsTo(Serie::class);
    }
}
