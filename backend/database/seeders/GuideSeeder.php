<?php

namespace Database\Seeders;

use App\Models\Etablissement;
use App\Models\Filiere;
use App\Models\Matiere;
use App\Models\Serie;
use App\Models\Universite;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class GuideSeeder extends Seeder
{
    public function run(): void
    {
        $path = database_path('data/guido_data.json');
        $data = json_decode(file_get_contents($path), true);

        DB::statement('SET FOREIGN_KEY_CHECKS=0');
        DB::table('filiere_serie_matiere')->truncate();
        DB::table('filiere_serie')->truncate();
        DB::table('filiere_debouches')->truncate();
        DB::table('favoris')->truncate();
        Filiere::truncate();
        Etablissement::truncate();
        Universite::truncate();
        Matiere::truncate();
        Serie::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1');

        $seriesCache = [];
        $matieresCache = [];

        $getSerie = function (string $code) use (&$seriesCache) {
            $code = trim(explode('/', $code)[0]);

            return $seriesCache[$code] ??= Serie::firstOrCreate(['code' => $code]);
        };

        $getMatiere = function (string $nom) use (&$matieresCache) {
            $nom = trim($nom);

            return $matieresCache[$nom] ??= Matiere::firstOrCreate(['nom' => $nom]);
        };

        foreach ($data['universites'] as $universiteData) {
            $universite = Universite::create(['nom' => $universiteData['nom']]);

            foreach ($universiteData['etablissements'] as $etablissementData) {
                $etablissement = Etablissement::create([
                    'universite_id' => $universite->id,
                    'nom' => $etablissementData['nom'],
                    'sigle' => $etablissementData['sigle'] ?? null,
                ]);

                foreach ($etablissementData['filieres'] as $filiereData) {
                    $filiere = Filiere::create([
                        'etablissement_id' => $etablissement->id,
                        'nom' => $filiereData['nom'],
                        'quota_bourse' => $filiereData['quota_bourse'] ?? 0,
                        'quota_aide_fpp' => $filiereData['quota_aide_fpp'] ?? 0,
                        'mode_entree' => strtolower($filiereData['mode_entree']),
                    ]);

                    $serieIds = [];
                    foreach ($filiereData['bac_recommande'] ?? [] as $code) {
                        if (str_contains($code, 'Toutes')) {
                            continue;
                        }
                        $serie = $getSerie($code);
                        $serieIds[$serie->id] = true;
                    }
                    if (! empty($serieIds)) {
                        $filiere->series()->attach(array_keys($serieIds));
                    }

                    foreach ($filiereData['matieres_par_serie'] ?? [] as $groupe) {
                        foreach ($groupe['series'] ?? [] as $code) {
                            if (str_contains($code, 'Toutes')) {
                                continue;
                            }
                            $serie = $getSerie($code);

                            foreach ($groupe['matieres'] ?? [] as $nomMatiere) {
                                if (str_starts_with($nomMatiere, 'Les trois')) {
                                    continue;
                                }
                                $matiere = $getMatiere($nomMatiere);

                                DB::table('filiere_serie_matiere')->insertOrIgnore([
                                    'filiere_id' => $filiere->id,
                                    'serie_id' => $serie->id,
                                    'matiere_id' => $matiere->id,
                                ]);
                            }
                        }
                    }

                    foreach ($filiereData['debouches'] ?? [] as $libelle) {
                        $filiere->debouches()->create(['libelle' => $libelle]);
                    }
                }
            }
        }

        $this->command->info('Séries: '.Serie::count());
        $this->command->info('Matières: '.Matiere::count());
        $this->command->info('Universités: '.Universite::count());
        $this->command->info('Établissements: '.Etablissement::count());
        $this->command->info('Filières: '.Filiere::count());
    }
}
