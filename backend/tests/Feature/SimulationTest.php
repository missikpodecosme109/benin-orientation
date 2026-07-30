<?php

namespace Tests\Feature;

use App\Models\Etablissement;
use App\Models\Filiere;
use App\Models\Matiere;
use App\Models\Serie;
use App\Models\Simulation;
use App\Models\Universite;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class SimulationTest extends TestCase
{
    use RefreshDatabase;

    private function creerFiliereAvecMatiere(Serie $serie, Matiere $matiere): Filiere
    {
        $universite = Universite::factory()->create();
        $etablissement = Etablissement::factory()->create(['universite_id' => $universite->id]);
        $filiere = Filiere::factory()->create(['etablissement_id' => $etablissement->id]);

        $filiere->series()->attach($serie->id);
        DB::table('filiere_serie_matiere')->insert([
            'filiere_id' => $filiere->id,
            'serie_id' => $serie->id,
            'matiere_id' => $matiere->id,
        ]);

        return $filiere;
    }

    public function test_un_invite_peut_lancer_une_simulation(): void
    {
        $serie = Serie::factory()->create();
        $matiere = Matiere::factory()->create();
        $filiere = $this->creerFiliereAvecMatiere($serie, $matiere);

        $response = $this->postJson('/api/simulations', [
            'serie_id' => $serie->id,
            'notes' => [$matiere->id => 15],
        ]);

        $response->assertCreated()
            ->assertJsonPath('resultats.0.filiere_id', $filiere->id)
            ->assertJsonPath('resultats.0.compatibilite', 75);

        $this->assertDatabaseHas('simulations', [
            'serie_id' => $serie->id,
            'user_id' => null,
        ]);
    }

    public function test_une_simulation_lancee_connecte_est_rattachee_a_l_utilisateur(): void
    {
        $user = User::factory()->create();
        $serie = Serie::factory()->create();
        $matiere = Matiere::factory()->create();
        $this->creerFiliereAvecMatiere($serie, $matiere);

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/simulations', [
            'serie_id' => $serie->id,
            'notes' => [$matiere->id => 12],
        ]);

        $response->assertCreated();
        $this->assertDatabaseHas('simulations', [
            'serie_id' => $serie->id,
            'user_id' => $user->id,
        ]);
    }

    public function test_un_utilisateur_ne_peut_pas_consulter_la_simulation_d_un_autre(): void
    {
        $proprietaire = User::factory()->create();
        $intrus = User::factory()->create();
        $serie = Serie::factory()->create();

        $simulation = Simulation::factory()->create([
            'user_id' => $proprietaire->id,
            'serie_id' => $serie->id,
            'notes' => [],
            'resultats' => [],
        ]);

        $response = $this->actingAs($intrus, 'sanctum')
            ->getJson("/api/simulations/{$simulation->id}");

        $response->assertForbidden();
    }

    public function test_un_utilisateur_ne_peut_pas_consulter_une_simulation_invite(): void
    {
        $intrus = User::factory()->create();
        $serie = Serie::factory()->create();

        $simulationInvite = Simulation::factory()->create([
            'user_id' => null,
            'serie_id' => $serie->id,
            'notes' => [],
            'resultats' => [],
        ]);

        $response = $this->actingAs($intrus, 'sanctum')
            ->getJson("/api/simulations/{$simulationInvite->id}");

        $response->assertForbidden();
    }

    public function test_le_proprietaire_peut_consulter_sa_propre_simulation(): void
    {
        $user = User::factory()->create();
        $serie = Serie::factory()->create();

        $simulation = Simulation::factory()->create([
            'user_id' => $user->id,
            'serie_id' => $serie->id,
            'notes' => [],
            'resultats' => [],
        ]);

        $response = $this->actingAs($user, 'sanctum')
            ->getJson("/api/simulations/{$simulation->id}");

        $response->assertOk()->assertJsonPath('id', $simulation->id);
    }
}
