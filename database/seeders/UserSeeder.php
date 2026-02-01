<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
  /**
   * Run the database seeds.
   */
  public function run(): void
  {
    // Create administrator
    $admin = User::create([
      'name' => 'Administrator',
      'email' => 'admin@example.com',
      'phone' => '081234567890',
      'password' => Hash::make('password'),
    ]);
    $admin->assignRole('administrator');

    // Create customer
    $customer = User::create([
      'name' => 'Customer',
      'email' => 'customer@example.com',
      'phone' => '081234567891',
      'password' => Hash::make('password'),
    ]);
    $customer->assignRole('customer');
  }
}
