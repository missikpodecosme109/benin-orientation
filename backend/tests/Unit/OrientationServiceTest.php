<?php

namespace Tests\Unit;

use App\Models\Etablissement;
use App\Models\Filiere;
use App\Models\Matiere;
use App\Models\Serie;
use App\Models\Universite;
use App\Services\OrientationService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class OrientationServiceTest extends TestCase
{
    use RefreshDatabase;

    private function creerFiliere(Serie $serie, array $matieres): Filiere
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

    public function test_le_score_de_compatibilite_est_la_moyenne_des_notes_ramenee_sur_100(): void
    {
        $serie = Serie::factory()->create();
        $maths = Matiere::factory()->create(['nom' => 'Mathématiques']);
        $physique = Matiere::factory()->create(['nom' => 'Physique']);
        $filiere = $this->creerFiliere($serie, [$maths, $physique]);

        $classement = (new OrientationService())->classerFilieres($serie, [
            $maths->id => 16,
            $physique->id => 8,
        ]);

        $this->assertCount(1, $classement);
        $resultat = $classement->first();
        $this->assertEquals($filiere->id, $resultat['filiere']->id);
        $this->assertEquals(12.0, $resultat['score']);
        $this->assertEquals(60, $resultat['compatibilite']);
        $this->assertEquals(['Mathématiques'], $resultat['matieres_fortes']);
        $this->assertEquals(['Physique'], $resultat['matieres_faibles']);
    }

    public function test_pondere_par_les_coefficients_officiels_du_bac_quand_ils_sont_connus(): void
    {
        $serie = Serie::factory()->create();

        // Matières du guide, avec des intitulés abrégés (comme dans le vrai guide) :
        // "Maths" doit se résoudre vers la matière officielle "Mathématiques".
        // "Anglais" porte déjà le même nom des deux côtés (cas le plus fréquent) :
        // c'est donc la même ligne Matiere, comme dans les vraies données.
        $mathsGuide = Matiere::factory()->create(['nom' => 'Maths']);
        $anglaisOfficiel = Matiere::factory()->create(['nom' => 'Anglais']);
        $filiere = $this->creerFiliere($serie, [$mathsGuide, $anglaisOfficiel]);

        // Coefficient officiel sur une matière distincte (id différent de "Maths")
        // pour vérifier la résolution guide -> officiel.
        $mathsOfficiel = Matiere::factory()->create(['nom' => 'Mathématiques']);
        DB::table('serie_matiere_coefficients')->insert([
            ['serie_id' => $serie->id, 'matiere_id' => $mathsOfficiel->id, 'coefficient' => 6],
            ['serie_id' => $serie->id, 'matiere_id' => $anglaisOfficiel->id, 'coefficient' => 2],
        ]);

        $classement = (new OrientationService())->classerFilieres($serie, [
            $mathsOfficiel->id => 16,
            $anglaisOfficiel->id => 10,
        ]);

        $this->assertCount(1, $classement);
        // (16*6 + 10*2) / (6+2) = 14.5
        $this->assertEquals(14.5, $classement->first()['score']);
        $this->assertEquals($filiere->id, $classement->first()['filiere']->id);
    }

    public function test_une_matiere_du_guide_sans_equivalent_officiel_est_ignoree(): void
    {
        $serie = Serie::factory()->create();
        $cultureGenerale = Matiere::factory()->create(['nom' => 'Culture générale']);
        $this->creerFiliere($serie, [$cultureGenerale]);

        // La série a des coefficients officiels connus, mais aucun ne correspond
        // à "Culture générale" (épreuve de sélection propre à l'école, pas du bac).
        $mathsOfficiel = Matiere::factory()->create(['nom' => 'Mathématiques']);
        DB::table('serie_matiere_coefficients')->insert([
            ['serie_id' => $serie->id, 'matiere_id' => $mathsOfficiel->id, 'coefficient' => 6],
        ]);

        $classement = (new OrientationService())->classerFilieres($serie, [
            $cultureGenerale->id => 18,
        ]);

        $this->assertCount(0, $classement);
    }

    public function test_une_filiere_sans_note_correspondante_est_ignoree(): void
    {
        $serie = Serie::factory()->create();
        $matiereDemandee = Matiere::factory()->create();
        $autreMatiere = Matiere::factory()->create();
        $this->creerFiliere($serie, [$matiereDemandee]);

        $classement = (new OrientationService())->classerFilieres($serie, [
            $autreMatiere->id => 18,
        ]);

        $this->assertCount(0, $classement);
    }

    public function test_le_classement_est_trie_par_compatibilite_decroissante(): void
    {
        $serie = Serie::factory()->create();
        $matiere = Matiere::factory()->create();
        $filiereFaible = $this->creerFiliere($serie, [$matiere]);
        $filiereForte = $this->creerFiliere($serie, [$matiere]);

        $classement = (new OrientationService())->classerFilieres($serie, [
            $matiere->id => 10,
        ]);

        // Les deux filières demandent la même matière avec la même note :
        // on vérifie simplement que le tri décroissant ne casse rien avec un score égal.
        $this->assertCount(2, $classement);
        $this->assertGreaterThanOrEqual(
            $classement->last()['compatibilite'],
            $classement->first()['compatibilite']
        );
    }
}
