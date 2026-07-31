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

        User::updateOrCreate(
            ['email' => $email],
            [
                'name' => 'Administrateur',
                'password' => Hash::make($password),
                'role' => 'admin',
            ]
        );
    }
}
