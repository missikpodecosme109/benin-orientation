<?php

namespace Database\Factories;

use App\Models\Universite;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Etablissement>
 */
class EtablissementFactory extends Factory
{
    public function definition(): array
    {
        return [
            'universite_id' => Universite::factory(),
            'nom' => fake()->unique()->company(),
            'sigle' => strtoupper(fake()->lexify('????')),
        ];
    }
}
