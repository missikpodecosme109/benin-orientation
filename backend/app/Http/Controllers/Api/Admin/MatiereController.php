<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Matiere;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class MatiereController extends Controller
{
    public function index(Request $request)
    {
        $query = Matiere::query();

        if ($request->filled('q')) {
            $query->where('nom', 'like', '%'.$request->string('q').'%');
        }

        return $query->orderBy('nom')->paginate(20);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nom' => ['required', 'string', 'max:255', Rule::unique('matieres', 'nom')],
        ]);

        return response()->json(Matiere::create($data), 201);
    }

    public function show(Matiere $matiere)
    {
        return $matiere;
    }

    public function update(Request $request, Matiere $matiere)
    {
        $data = $request->validate([
            'nom' => ['required', 'string', 'max:255', Rule::unique('matieres', 'nom')->ignore($matiere->id)],
        ]);

        $matiere->update($data);

        return $matiere;
    }

    public function destroy(Matiere $matiere)
    {
        $matiere->delete();

        return response()->json(null, 204);
    }
}
