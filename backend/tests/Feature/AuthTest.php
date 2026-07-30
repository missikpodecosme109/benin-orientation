<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_un_utilisateur_peut_s_inscrire(): void
    {
        $response = $this->postJson('/api/auth/register', [
            'name' => 'Cosme Test',
            'email' => 'cosme@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertCreated()
            ->assertJsonStructure(['user', 'token']);

        $this->assertDatabaseHas('users', [
            'email' => 'cosme@example.com',
            'role' => 'candidat',
        ]);
    }

    public function test_l_inscription_echoue_si_l_email_est_deja_pris(): void
    {
        User::factory()->create(['email' => 'cosme@example.com']);

        $response = $this->postJson('/api/auth/register', [
            'name' => 'Cosme Test',
            'email' => 'cosme@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors('email');
    }

    public function test_un_utilisateur_peut_se_connecter_avec_les_bons_identifiants(): void
    {
        User::factory()->create([
            'email' => 'cosme@example.com',
            'password' => bcrypt('password123'),
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'cosme@example.com',
            'password' => 'password123',
        ]);

        $response->assertOk()->assertJsonStructure(['user', 'token']);
    }

    public function test_la_connexion_echoue_avec_un_mauvais_mot_de_passe(): void
    {
        User::factory()->create([
            'email' => 'cosme@example.com',
            'password' => bcrypt('password123'),
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'cosme@example.com',
            'password' => 'mauvais-mot-de-passe',
        ]);

        $response->assertUnprocessable()->assertJsonValidationErrors('email');
    }

    public function test_un_utilisateur_authentifie_peut_consulter_son_profil(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/auth/me');

        $response->assertOk()->assertJsonPath('email', $user->email);
    }

    public function test_un_utilisateur_authentifie_peut_se_deconnecter(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/auth/logout');

        $response->assertOk();
        $this->assertDatabaseCount('personal_access_tokens', 0);
    }

    public function test_un_visiteur_non_authentifie_ne_peut_pas_consulter_le_profil(): void
    {
        $response = $this->getJson('/api/auth/me');

        $response->assertUnauthorized();
    }
}
