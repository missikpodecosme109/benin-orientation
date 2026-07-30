<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Filiere;
use Illuminate\Http\Request;

class FiliereController extends Controller
{
    public function index(Request $request)
    {
        $query = Filiere::with('etablissement.universite', 'series')->withCount('debouches');

        if ($request->filled('q')) {
            $query->where('nom', 'like', '%'.$request->string('q').'%');
        }

        if ($request->filled('serie_id')) {
            $serieId = $request->integer('serie_id');
            $query->whereHas('series', fn ($q) => $q->where('series.id', $serieId));
        }

        if ($request->filled('etablissement_id')) {
            $query->where('etablissement_id', $request->integer('etablissement_id'));
        }

        if ($request->filled('mode_entree')) {
            $query->where('mode_entree', $request->string('mode_entree'));
        }

        return $query->orderBy('nom')->paginate(20);
    }

    public function show(Filiere $filiere)
    {
        return $filiere->load('etablissement.universite', 'series', 'debouches');
    }
}
