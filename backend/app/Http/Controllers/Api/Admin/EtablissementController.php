<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Etablissement;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class EtablissementController extends Controller
{
    public function index(Request $request)
    {
        $query = Etablissement::with('universite')->withCount('filieres');

        if ($request->filled('q')) {
            $terme = $request->string('q');
            $query->where(function ($q) use ($terme) {
                $q->where('nom', 'like', "%{$terme}%")->orWhere('sigle', 'like', "%{$terme}%");
            });
        }

        if ($request->filled('universite_id')) {
            $query->where('universite_id', $request->integer('universite_id'));
        }

        return $query->orderBy('nom')->paginate($this->perPage($request));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'universite_id' => ['required', 'integer', Rule::exists('universites', 'id')],
            'nom' => ['required', 'string', 'max:255'],
            'sigle' => ['nullable', 'string', 'max:50'],
        ]);

        return response()->json(Etablissement::create($data)->load('universite'), 201);
    }

    public function show(Etablissement $etablissement)
    {
        return $etablissement->load('universite', 'filieres');
    }

    public function update(Request $request, Etablissement $etablissement)
    {
        $data = $request->validate([
            'universite_id' => ['required', 'integer', Rule::exists('universites', 'id')],
            'nom' => ['required', 'string', 'max:255'],
            'sigle' => ['nullable', 'string', 'max:50'],
        ]);

        $etablissement->update($data);

        return $etablissement->load('universite');
    }

    public function destroy(Etablissement $etablissement)
    {
        $etablissement->delete();

        return response()->json(null, 204);
    }

    private function perPage(Request $request): int
    {
        return min((int) $request->integer('per_page', 20) ?: 20, 500);
    }
}
