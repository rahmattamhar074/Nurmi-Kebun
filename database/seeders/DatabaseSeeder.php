<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(RoleSeeder::class);

        $this->call(ProductCategorySeeder::class);

        $this->call(PaymentMethodSeeder::class);

        $this->call(RajaOngkirSeeder::class);

        if (!app()->environment('production')) {
            $this->call(UserSeeder::class);

            $this->call(ProductSeeder::class);

            $this->call(OrderSeeder::class);
        }
    }
}
