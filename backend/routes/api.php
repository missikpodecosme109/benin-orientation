<?php

use App\Http\Controllers\Api\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Api\Admin\DebboucheController as AdminDebboucheController;
use App\Http\Controllers\Api\Admin\EtablissementController as AdminEtablissementController;
use App\Http\Controllers\Api\Admin\ExportController as AdminExportController;
use App\Http\Controllers\Api\Admin\FiliereController as AdminFiliereController;
use App\Http\Controllers\Api\Admin\ImportController as AdminImportController;
use App\Http\Controllers\Api\Admin\MatiereController as AdminMatiereController;
use App\Http\Controllers\Api\Admin\SerieController as AdminSerieController;
use App\Http\Controllers\Api\Admin\SimulationController as AdminSimulationController;
use App\Http\Controllers\Api\Admin\UniversiteController as AdminUniversiteController;
use App\Http\Controllers\Api\Admin\UserController as AdminUserController;
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

Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    Route::get('/dashboard', [AdminDashboardController::class, 'stats']);

    Route::apiResource('universites', AdminUniversiteController::class)->parameters(['universites' => 'universite']);
    Route::apiResource('etablissements', AdminEtablissementController::class)->parameters(['etablissements' => 'etablissement']);
    Route::apiResource('filieres', AdminFiliereController::class)->parameters(['filieres' => 'filiere']);
    Route::apiResource('series', AdminSerieController::class)->parameters(['series' => 'serie']);
    Route::apiResource('matieres', AdminMatiereController::class)->parameters(['matieres' => 'matiere']);
    Route::apiResource('debouches', AdminDebboucheController::class)->only(['index', 'store', 'update', 'destroy'])->parameters(['debouches' => 'debouche']);

    Route::get('/simulations', [AdminSimulationController::class, 'index']);
    Route::get('/simulations/{simulation}', [AdminSimulationController::class, 'show']);
    Route::delete('/simulations/{simulation}', [AdminSimulationController::class, 'destroy']);

    Route::apiResource('utilisateurs', AdminUserController::class)->parameters(['utilisateurs' => 'user']);

    Route::get('/export/{type}', [AdminExportController::class, 'export']);
    Route::post('/import/filieres', [AdminImportController::class, 'importerFilieres']);
});
