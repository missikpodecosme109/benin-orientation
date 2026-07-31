<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Filiere;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class FiliereController extends Controller
{
    public function index(Request $request)
    {
        $query = Filiere::with('etablissement.universite')->withCount('debouches');

        if ($request->filled('q')) {
            $query->where('nom', 'like', '%'.$request->string('q').'%');
        }

        if ($request->filled('etablissement_id')) {
            $query->where('etablissement_id', $request->integer('etablissement_id'));
        }

        return $query->orderBy('nom')->paginate($this->perPage($request));
    }

    public function store(Request $request)
    {
        $data = $this->validated($request);

        $filiere = Filiere::create($data);
        $this->syncRelations($filiere, $request);

        return response()->json($filiere->load('etablissement.universite', 'series', 'debouches'), 201);
    }

    public function show(Filiere $filiere)
    {
        return $filiere->load('etablissement.universite', 'series', 'debouches');
    }

    public function update(Request $request, Filiere $filiere)
    {
        $data = $this->validated($request);

        $filiere->update($data);
        $this->syncRelations($filiere, $request);

        return $filiere->load('etablissement.universite', 'series', 'debouches');
    }

    public function destroy(Filiere $filiere)
    {
        $filiere->delete();

        return response()->json(null, 204);
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'etablissement_id' => ['required', 'integer', Rule::exists('etablissements', 'id')],
            'nom' => ['required', 'string', 'max:255'],
            'quota_bourse' => ['nullable', 'integer', 'min:0'],
            'quota_aide_fpp' => ['nullable', 'integer', 'min:0'],
            'mode_entree' => ['required', Rule::in(['classement', 'concours', 'dossier'])],
            'series' => ['sometimes', 'array'],
            'series.*' => ['integer', Rule::exists('series', 'id')],
            'debouches' => ['sometimes', 'array'],
            'debouches.*' => ['string', 'max:255'],
        ]);
    }

    private function perPage(Request $request): int
    {
        return min((int) $request->integer('per_page', 20) ?: 20, 500);
    }

    private function syncRelations(Filiere $filiere, Request $request): void
    {
        if ($request->has('series')) {
            $filiere->series()->sync($request->input('series', []));
        }

        if ($request->has('debouches')) {
            $filiere->debouches()->delete();
            foreach (array_filter($request->input('debouches', [])) as $libelle) {
                $filiere->debouches()->create(['libelle' => $libelle]);
            }
        }
    }
}
