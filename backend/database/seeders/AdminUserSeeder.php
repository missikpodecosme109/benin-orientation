<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $email = env('ADMIN_EMAIL', 'admin@beninorientation.com');
        $password = env('ADMIN_PASSWORD', 'BeninOrientation2026!');

        // firstOrCreate: ne touche pas au mot de passe si le compte existe déjà,
        // pour ne pas écraser un mot de passe changé depuis le panneau admin.
        User::firstOrCreate(
            ['email' => $email],
            [
                'name' => 'Administrateur',
                'password' => Hash::make($password),
                'role' => 'admin',
            ]
        );
    }
}
