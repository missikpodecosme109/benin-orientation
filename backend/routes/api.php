<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\EtablissementController;
use App\Http\Controllers\Api\FavoriController;
use App\Http\Controllers\Api\FiliereController;
use App\Http\Controllers\Api\SerieController;
use App\Http\Controllers\Api\SimulationController;
use App\Http\Controllers\Api\UniversiteController;
use Illuminate\Support\Facades\Route;

Route::middleware('throttle:auth')->group(function () {
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login', [AuthController::class, 'login']);
});

Route::get('/series', [SerieController::class, 'index']);
Route::get('/series/{serie}', [SerieController::class, 'show']);
Route::get('/series/{serie}/matieres', [SerieController::class, 'matieres']);

Route::get('/universites', [UniversiteController::class, 'index']);
Route::get('/universites/{universite}', [UniversiteController::class, 'show']);

Route::get('/etablissements', [EtablissementController::class, 'index']);
Route::get('/etablissements/{etablissement}', [EtablissementController::class, 'show']);

Route::get('/filieres', [FiliereController::class, 'index']);
Route::get('/filieres/{filiere}', [FiliereController::class, 'show']);

// Accessible aux invités : une simulation ne nécessite pas de compte.
// Si l'utilisateur est connecté (token Sanctum fourni), elle est rattachée à son historique.
Route::post('/simulations', [SimulationController::class, 'store']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);

    Route::get('/simulations', [SimulationController::class, 'index']);
    Route::get('/simulations/{simulation}', [SimulationController::class, 'show']);

    Route::get('/favoris', [FavoriController::class, 'index']);
    Route::post('/favoris', [FavoriController::class, 'store']);
    Route::delete('/favoris/{favori}', [FavoriController::class, 'destroy']);
});
