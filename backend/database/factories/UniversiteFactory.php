<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Universite>
 */
class UniversiteFactory extends Factory
{
    public function definition(): array
    {
        return [
            'nom' => fake()->unique()->company(),
            'sigle' => strtoupper(fake()->lexify('???')),
        ];
    }
}
