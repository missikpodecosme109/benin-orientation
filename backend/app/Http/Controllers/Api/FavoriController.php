<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Favori;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class FavoriController extends Controller
{
    public function index(Request $request)
    {
        return $request->user()
            ->favoris()
            ->with('filiere.etablissement.universite')
            ->latest()
            ->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'filiere_id' => ['required', 'integer', Rule::exists('filieres', 'id')],
        ]);

        $favori = $request->user()->favoris()->firstOrCreate([
            'filiere_id' => $data['filiere_id'],
        ]);

        return response()->json($favori->load('filiere'), 201);
    }

    public function destroy(Request $request, Favori $favori)
    {
        abort_if($favori->user_id !== $request->user()->id, 403);

        $favori->delete();

        return response()->json(null, 204);
    }
}
