<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Matiere;
use App\Models\Serie;
use Illuminate\Support\Facades\DB;

class SerieController extends Controller
{
    /**
     * Au-delà de ce rang de fréquence, une matière est considérée comme
     * spécifique à quelques filières plutôt que "principale" pour la série.
     * Utilisé uniquement pour le repli des séries sans coefficients officiels
     * connus (voir matieres() ci-dessous).
     */
    private const NB_MATIERES_PRINCIPALES = 8;

    public function index()
    {
        return Serie::orderBy('code')->get();
    }

    public function show(Serie $serie)
    {
        return $serie;
    }

    /**
     * Matières à saisir pour cette série. Quand les coefficients officiels du
     * bac sont connus (voir CoefficientsBacSeeder), on renvoie les vraies
     * matières de l'examen avec leur coefficient réel. Sinon (séries DEAT et
     * DT, absentes de l'arrêté trouvé), on retombe sur l'ancienne estimation
     * par fréquence d'usage dans le guide d'orientation.
     */
    public function matieres(Serie $serie)
    {
        $officielles = $serie->coefficientsBac()->with('matiere')->orderByDesc('coefficient')->get();

        if ($officielles->isNotEmpty()) {
            return response()->json(
                $officielles->map(fn ($c) => [
                    'id' => $c->matiere_id,
                    'nom' => $c->matiere->nom,
                    'coefficient' => $c->coefficient,
                    'principale' => true,
                ])->values()
            );
        }

        return response()->json($this->matieresParFrequence($serie));
    }

    private function matieresParFrequence(Serie $serie)
    {
        $frequences = DB::table('filiere_serie_matiere')
            ->where('serie_id', $serie->id)
            ->select('matiere_id', DB::raw('COUNT(DISTINCT filiere_id) as nb_filieres'))
            ->groupBy('matiere_id')
            ->orderByDesc('nb_filieres')
            ->get();

        $matieres = Matiere::whereIn('id', $frequences->pluck('matiere_id'))
            ->get()
            ->keyBy('id');

        return $frequences->values()->map(function ($f, $rang) use ($matieres) {
            $matiere = $matieres[$f->matiere_id];

            return [
                'id' => $matiere->id,
                'nom' => $matiere->nom,
                'principale' => $rang < self::NB_MATIERES_PRINCIPALES,
            ];
        })->sortBy([
            fn ($a, $b) => $b['principale'] <=> $a['principale'],
            fn ($a, $b) => $a['nom'] <=> $b['nom'],
        ])->values();
    }
}
