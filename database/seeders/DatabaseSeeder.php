<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@toys141.ps'],
            ['name' => 'TOYS 141 Admin', 'password' => Hash::make('admin123'), 'role' => 'admin']
        );

        $this->call(ProductionDataSeeder::class);
    }
}
