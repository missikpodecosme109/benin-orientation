<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Filiere;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        if (Filiere::count() === 0) {
            $this->call([
                GuideSeeder::class,
                CoefficientsBacSeeder::class,
            ]);
        }

        $this->call(AdminUserSeeder::class);
    }
}
