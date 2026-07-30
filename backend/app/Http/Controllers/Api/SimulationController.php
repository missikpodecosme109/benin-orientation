<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Serie;
use App\Models\Simulation;
use App\Services\OrientationService;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class SimulationController extends Controller
{
    public function __construct(private OrientationService $orientationService)
    {
    }

    /**
     * Lance une simulation d'orientation à partir d'une série et de notes.
     * Accessible sans compte (invité) ; si l'utilisateur est connecté,
     * la simulation est rattachée à son historique.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'serie_id' => ['required', 'integer', Rule::exists('series', 'id')],
            'notes' => ['required', 'array', 'min:1'],
            'notes.*' => ['numeric', 'min:0', 'max:20'],
        ]);

        $serie = Serie::findOrFail($data['serie_id']);

        // Les clés du tableau 'notes' sont les matiere_id envoyés en string par le JSON,
        // on les remet en entier pour matcher les identifiants en base.
        $notes = collect($data['notes'])
            ->mapWithKeys(fn ($note, $matiereId) => [(int) $matiereId => (float) $note])
            ->all();

        $classement = $this->orientationService->classerFilieres($serie, $notes);

        $resultats = $classement->map(fn (array $r) => [
            'filiere_id' => $r['filiere']->id,
            'filiere_nom' => $r['filiere']->nom,
            'etablissement' => $r['filiere']->etablissement->nom,
            'universite' => $r['filiere']->etablissement->universite->nom,
            'compatibilite' => $r['compatibilite'],
            'score' => $r['score'],
            'matieres_fortes' => $r['matieres_fortes'],
            'matieres_faibles' => $r['matieres_faibles'],
            'debouches' => $r['filiere']->debouches->pluck('libelle'),
        ])->values();

        $simulation = Simulation::create([
            'user_id' => $request->user('sanctum')?->id,
            'serie_id' => $serie->id,
            'notes' => $notes,
            'resultats' => $resultats,
        ]);

        return response()->json([
            'simulation_id' => $simulation->id,
            'serie' => $serie->code,
            'resultats' => $resultats,
        ], 201);
    }

    public function index(Request $request)
    {
        return $request->user()
            ->simulations()
            ->with('serie')
            ->latest()
            ->paginate(10);
    }

    public function show(Request $request, Simulation $simulation)
    {
        abort_if($simulation->user_id !== $request->user()->id, 403);

        return $simulation->load('serie');
    }
}
