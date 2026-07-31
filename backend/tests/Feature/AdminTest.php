<?php

namespace Tests\Feature;

use App\Models\Universite;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminTest extends TestCase
{
    use RefreshDatabase;

    public function test_un_visiteur_non_authentifie_ne_peut_pas_acceder_a_l_admin(): void
    {
        $response = $this->getJson('/api/admin/dashboard');

        $response->assertUnauthorized();
    }

    public function test_un_utilisateur_non_admin_ne_peut_pas_acceder_a_l_admin(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/admin/dashboard');

        $response->assertForbidden();
    }

    public function test_un_admin_peut_consulter_le_tableau_de_bord(): void
    {
        $admin = User::factory()->admin()->create();

        $response = $this->actingAs($admin, 'sanctum')->getJson('/api/admin/dashboard');

        $response->assertOk()->assertJsonStructure(['totaux', 'derniers_utilisateurs']);
    }

    public function test_un_admin_peut_creer_lire_modifier_et_supprimer_une_universite(): void
    {
        $admin = User::factory()->admin()->create();

        $creation = $this->actingAs($admin, 'sanctum')->postJson('/api/admin/universites', [
            'nom' => 'Université de Test',
            'sigle' => 'UT',
        ]);
        $creation->assertCreated();
        $id = $creation->json('id');

        $this->assertDatabaseHas('universites', ['id' => $id, 'nom' => 'Université de Test']);

        $modification = $this->actingAs($admin, 'sanctum')->putJson("/api/admin/universites/{$id}", [
            'nom' => 'Université Modifiée',
            'sigle' => 'UM',
        ]);
        $modification->assertOk()->assertJsonPath('nom', 'Université Modifiée');

        $suppression = $this->actingAs($admin, 'sanctum')->deleteJson("/api/admin/universites/{$id}");
        $suppression->assertNoContent();

        $this->assertDatabaseMissing('universites', ['id' => $id]);
    }

    public function test_un_admin_ne_peut_pas_supprimer_son_propre_compte(): void
    {
        $admin = User::factory()->admin()->create();

        $response = $this->actingAs($admin, 'sanctum')->deleteJson("/api/admin/utilisateurs/{$admin->id}");

        $response->assertUnprocessable();
        $this->assertDatabaseHas('users', ['id' => $admin->id]);
    }

    public function test_un_admin_peut_lister_les_universites_avec_pagination(): void
    {
        $admin = User::factory()->admin()->create();
        Universite::factory()->count(3)->create();

        $response = $this->actingAs($admin, 'sanctum')->getJson('/api/admin/universites');

        $response->assertOk()->assertJsonCount(3, 'data');
    }
}
