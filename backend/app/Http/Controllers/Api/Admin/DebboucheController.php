<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\FiliereDebouche;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class DebboucheController extends Controller
{
    public function index(Request $request)
    {
        $query = FiliereDebouche::with('filiere');

        if ($request->filled('filiere_id')) {
            $query->where('filiere_id', $request->integer('filiere_id'));
        }

        if ($request->filled('q')) {
            $query->where('libelle', 'like', '%'.$request->string('q').'%');
        }

        return $query->orderBy('libelle')->paginate(20);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'filiere_id' => ['required', 'integer', Rule::exists('filieres', 'id')],
            'libelle' => ['required', 'string', 'max:255'],
        ]);

        return response()->json(FiliereDebouche::create($data)->load('filiere'), 201);
    }

    public function update(Request $request, FiliereDebouche $debouche)
    {
        $data = $request->validate([
            'filiere_id' => ['required', 'integer', Rule::exists('filieres', 'id')],
            'libelle' => ['required', 'string', 'max:255'],
        ]);

        $debouche->update($data);

        return $debouche->load('filiere');
    }

    public function destroy(FiliereDebouche $debouche)
    {
        $debouche->delete();

        return response()->json(null, 204);
    }
}
