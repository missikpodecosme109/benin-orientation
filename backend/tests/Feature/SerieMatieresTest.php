<?php

namespace Tests\Feature;

use App\Models\Etablissement;
use App\Models\Filiere;
use App\Models\Matiere;
use App\Models\Serie;
use App\Models\Universite;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class SerieMatieresTest extends TestCase
{
    use RefreshDatabase;

    private function creerFiliereAvecMatieres(Serie $serie, array $matieres): Filiere
    {
        $universite = Universite::factory()->create();
        $etablissement = Etablissement::factory()->create(['universite_id' => $universite->id]);
        $filiere = Filiere::factory()->create(['etablissement_id' => $etablissement->id]);
        $filiere->series()->attach($serie->id);

        foreach ($matieres as $matiere) {
            DB::table('filiere_serie_matiere')->insert([
                'filiere_id' => $filiere->id,
                'serie_id' => $serie->id,
                'matiere_id' => $matiere->id,
            ]);
        }

        return $filiere;
    }

    public function test_les_matieres_les_plus_frequentes_sont_marquees_principales(): void
    {
        $serie = Serie::factory()->create();
        $matieresFrequentes = Matiere::factory()->count(8)->create();
        $rare = Matiere::factory()->create(['nom' => 'Théorie musicale']);

        // 8 matières demandées par 2 filières chacune (le tronc commun),
        // et une matière rare demandée par une seule filière spécialisée.
        foreach ($matieresFrequentes as $matiere) {
            $this->creerFiliereAvecMatieres($serie, [$matiere]);
            $this->creerFiliereAvecMatieres($serie, [$matiere]);
        }
        $this->creerFiliereAvecMatieres($serie, [$rare]);

        $reponse = $this->getJson("/api/series/{$serie->id}/matieres");

        $reponse->assertOk();
        $matieres = collect($reponse->json());

        $this->assertTrue(
            $matieres->firstWhere('nom', $matieresFrequentes->first()->nom)['principale']
        );
        $this->assertFalse($matieres->firstWhere('nom', 'Théorie musicale')['principale']);
    }

    public function test_toutes_les_matieres_sont_principales_si_moins_de_huit(): void
    {
        $serie = Serie::factory()->create();
        $matieres = Matiere::factory()->count(3)->create();
        $this->creerFiliereAvecMatieres($serie, $matieres->all());

        $reponse = $this->getJson("/api/series/{$serie->id}/matieres");

        $reponse->assertOk();
        $this->assertTrue(collect($reponse->json())->every(fn ($m) => $m['principale']));
    }
}
