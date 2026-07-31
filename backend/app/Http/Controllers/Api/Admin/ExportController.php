<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Etablissement;
use App\Models\Filiere;
use App\Models\Matiere;
use App\Models\Serie;
use App\Models\Universite;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ExportController extends Controller
{
    private const RESSOURCES = ['universites', 'etablissements', 'filieres', 'series', 'matieres'];

    public function export(string $type): StreamedResponse
    {
        abort_unless(in_array($type, self::RESSOURCES, true), 404);

        [$colonnes, $lignes] = match ($type) {
            'universites' => [
                ['id', 'nom', 'sigle'],
                Universite::orderBy('nom')->get()->map(fn ($u) => [$u->id, $u->nom, $u->sigle]),
            ],
            'etablissements' => [
                ['id', 'nom', 'sigle', 'universite_id', 'universite_nom'],
                Etablissement::with('universite')->orderBy('nom')->get()
                    ->map(fn ($e) => [$e->id, $e->nom, $e->sigle, $e->universite_id, $e->universite->nom]),
            ],
            'filieres' => [
                ['id', 'nom', 'etablissement_id', 'etablissement_nom', 'quota_bourse', 'quota_aide_fpp', 'mode_entree'],
                Filiere::with('etablissement')->orderBy('nom')->get()
                    ->map(fn ($f) => [$f->id, $f->nom, $f->etablissement_id, $f->etablissement->nom, $f->quota_bourse, $f->quota_aide_fpp, $f->mode_entree]),
            ],
            'series' => [
                ['id', 'code', 'libelle'],
                Serie::orderBy('code')->get()->map(fn ($s) => [$s->id, $s->code, $s->libelle]),
            ],
            'matieres' => [
                ['id', 'nom'],
                Matiere::orderBy('nom')->get()->map(fn ($m) => [$m->id, $m->nom]),
            ],
        };

        $nomFichier = "{$type}-".now()->format('Y-m-d').'.csv';

        return response()->streamDownload(function () use ($colonnes, $lignes) {
            $flux = fopen('php://output', 'w');
            fputcsv($flux, $colonnes);
            foreach ($lignes as $ligne) {
                fputcsv($flux, $ligne);
            }
            fclose($flux);
        }, $nomFichier, ['Content-Type' => 'text/csv']);
    }
}
