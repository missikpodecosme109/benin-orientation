<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Etablissement;
use Illuminate\Http\Request;

class EtablissementController extends Controller
{
    public function index(Request $request)
    {
        $query = Etablissement::with('universite')->withCount('filieres');

        if ($request->filled('q')) {
            $terme = $request->string('q');
            $query->where(function ($q) use ($terme) {
                $q->where('nom', 'like', "%{$terme}%")
                    ->orWhere('sigle', 'like', "%{$terme}%");
            });
        }

        if ($request->filled('universite_id')) {
            $query->where('universite_id', $request->integer('universite_id'));
        }

        return $query->orderBy('nom')->paginate(20);
    }

    public function show(Etablissement $etablissement)
    {
        return $etablissement->load('universite', 'filieres.debouches', 'filieres.series');
    }
}
