<?php

namespace Database\Factories;

use App\Models\Etablissement;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Filiere>
 */
class FiliereFactory extends Factory
{
    public function definition(): array
    {
        return [
            'etablissement_id' => Etablissement::factory(),
            'nom' => fake()->unique()->jobTitle(),
            'quota_bourse' => fake()->numberBetween(0, 50),
            'quota_aide_fpp' => fake()->numberBetween(0, 50),
            'mode_entree' => fake()->randomElement(['classement', 'concours', 'dossier']),
        ];
    }
}
