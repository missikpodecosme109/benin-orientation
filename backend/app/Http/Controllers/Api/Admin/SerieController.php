<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Serie;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class SerieController extends Controller
{
    public function index(Request $request)
    {
        $query = Serie::withCount('filieres');

        if ($request->filled('q')) {
            $terme = $request->string('q');
            $query->where(function ($q) use ($terme) {
                $q->where('code', 'like', "%{$terme}%")->orWhere('libelle', 'like', "%{$terme}%");
            });
        }

        return $query->orderBy('code')->paginate(20);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'code' => ['required', 'string', 'max:10', Rule::unique('series', 'code')],
            'libelle' => ['nullable', 'string', 'max:255'],
        ]);

        return response()->json(Serie::create($data), 201);
    }

    public function show(Serie $serie)
    {
        return $serie->load('filieres');
    }

    public function update(Request $request, Serie $serie)
    {
        $data = $request->validate([
            'code' => ['required', 'string', 'max:10', Rule::unique('series', 'code')->ignore($serie->id)],
            'libelle' => ['nullable', 'string', 'max:255'],
        ]);

        $serie->update($data);

        return $serie;
    }

    public function destroy(Serie $serie)
    {
        $serie->delete();

        return response()->json(null, 204);
    }
}
