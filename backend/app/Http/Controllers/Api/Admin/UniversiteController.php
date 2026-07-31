<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Universite;
use Illuminate\Http\Request;

class UniversiteController extends Controller
{
    public function index(Request $request)
    {
        $query = Universite::withCount('etablissements');

        if ($request->filled('q')) {
            $query->where('nom', 'like', '%'.$request->string('q').'%');
        }

        return $query->orderBy('nom')->paginate(20);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nom' => ['required', 'string', 'max:255'],
            'sigle' => ['nullable', 'string', 'max:50'],
        ]);

        return response()->json(Universite::create($data), 201);
    }

    public function show(Universite $universite)
    {
        return $universite->load('etablissements');
    }

    public function update(Request $request, Universite $universite)
    {
        $data = $request->validate([
            'nom' => ['required', 'string', 'max:255'],
            'sigle' => ['nullable', 'string', 'max:50'],
        ]);

        $universite->update($data);

        return $universite;
    }

    public function destroy(Universite $universite)
    {
        $universite->delete();

        return response()->json(null, 204);
    }
}
