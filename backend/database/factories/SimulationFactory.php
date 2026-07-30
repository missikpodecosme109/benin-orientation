<?php

namespace Database\Factories;

use App\Models\Serie;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Simulation>
 */
class SimulationFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => null,
            'serie_id' => Serie::factory(),
            'notes' => [],
            'resultats' => [],
        ];
    }
}
