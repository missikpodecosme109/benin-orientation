<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Simulation;
use Illuminate\Http\Request;

class SimulationController extends Controller
{
    public function index(Request $request)
    {
        $query = Simulation::with('user:id,name,email', 'serie');

        if ($request->filled('serie_id')) {
            $query->where('serie_id', $request->integer('serie_id'));
        }

        if ($request->filled('user_id')) {
            $query->where('user_id', $request->integer('user_id'));
        }

        return $query->latest()->paginate(20);
    }

    public function show(Simulation $simulation)
    {
        return $simulation->load('user:id,name,email', 'serie');
    }

    public function destroy(Simulation $simulation)
    {
        $simulation->delete();

        return response()->json(null, 204);
    }
}
