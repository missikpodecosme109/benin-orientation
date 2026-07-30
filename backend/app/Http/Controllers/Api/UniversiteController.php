<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Universite;

class UniversiteController extends Controller
{
    public function index()
    {
        return Universite::withCount('etablissements')->orderBy('nom')->get();
    }

    public function show(Universite $universite)
    {
        return $universite->load('etablissements.filieres');
    }
}
