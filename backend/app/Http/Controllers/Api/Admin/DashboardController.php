<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Etablissement;
use App\Models\Filiere;
use App\Models\Matiere;
use App\Models\Serie;
use App\Models\Simulation;
use App\Models\Universite;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function stats()
    {
        return response()->json([
            'totaux' => [
                'universites' => Universite::count(),
                'etablissements' => Etablissement::count(),
                'filieres' => Filiere::count(),
                'series' => Serie::count(),
                'matieres' => Matiere::count(),
                'utilisateurs' => User::count(),
                'simulations' => Simulation::count(),
            ],
            'simulations_par_jour' => Simulation::query()
                ->selectRaw('DATE(created_at) as jour, COUNT(*) as total')
                ->where('created_at', '>=', now()->subDays(14))
                ->groupBy('jour')
                ->orderBy('jour')
                ->get(),
            'filieres_les_plus_demandees' => DB::table('favoris')
                ->join('filieres', 'filieres.id', '=', 'favoris.filiere_id')
                ->select('filieres.id', 'filieres.nom', DB::raw('COUNT(*) as nb_favoris'))
                ->groupBy('filieres.id', 'filieres.nom')
                ->orderByDesc('nb_favoris')
                ->limit(5)
                ->get(),
            'series_les_plus_utilisees' => Simulation::query()
                ->join('series', 'series.id', '=', 'simulations.serie_id')
                ->select('series.id', 'series.code', DB::raw('COUNT(*) as nb_simulations'))
                ->groupBy('series.id', 'series.code')
                ->orderByDesc('nb_simulations')
                ->limit(5)
                ->get(),
            'derniers_utilisateurs' => User::latest()->limit(5)->get(['id', 'name', 'email', 'role', 'created_at']),
        ]);
    }
}
