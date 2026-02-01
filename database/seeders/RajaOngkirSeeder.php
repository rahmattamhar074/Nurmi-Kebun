<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Schema;

class RajaOngkirSeeder extends Seeder
{
    public function run(): void
    {
        $this->command->info('Importing RajaOngkir SQL files...');
        
        // Disable foreign key checks
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        $files = [
            'tb_ro_provinces.sql',
            'tb_ro_cities.sql',
            'tb_ro_subdistricts.sql'
        ];

        foreach ($files as $file) {
            $path = database_path('data/' . $file);
            if (!file_exists($path)) {
                $this->command->error("File not found: $path");
                continue;
            }
            
            $this->command->info("Executing $file...");
            DB::unprepared(file_get_contents($path));
        }

        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $this->migrateProvinces();
        $this->migrateCities();
        $this->migrateSubdistricts();

        $this->command->info('Cleaning up temporary tables...');
        Schema::dropIfExists('tb_ro_provinces');
        Schema::dropIfExists('tb_ro_cities');
        Schema::dropIfExists('tb_ro_subdistricts');
    }

    private function migrateProvinces()
    {
        $this->command->info('Migrating Provinces...');
        // Ensure table exists before querying
        if (!Schema::hasTable('tb_ro_provinces')) {
            $this->command->error('Table tb_ro_provinces not found.');
            return;
        }

        $provinces = DB::table('tb_ro_provinces')->get();
        foreach ($provinces as $row) {
            DB::table('provinces')->insertOrIgnore([
                'id' => $row->province_id,
                'name' => $row->province_name,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    private function migrateCities()
    {
        $this->command->info('Migrating Cities...');
        if (!Schema::hasTable('tb_ro_cities')) {
            $this->command->error('Table tb_ro_cities not found.');
            return;
        }

        $cities = DB::table('tb_ro_cities')->get();
        foreach ($cities as $row) {
            // Split "Kabupaten/Kota Name"
            $type = 'Kabupaten';
            $name = $row->city_name;

            if (str_starts_with($row->city_name, 'Kota ')) {
                $type = 'Kota';
                $name = substr($row->city_name, 5);
            } elseif (str_starts_with($row->city_name, 'Kabupaten ')) {
                $type = 'Kabupaten';
                $name = substr($row->city_name, 10);
            }

            DB::table('cities')->insertOrIgnore([
                'id' => $row->city_id,
                'province_id' => $row->province_id,
                'type' => $type,
                'name' => $name,
                'postal_code' => $row->postal_code,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    private function migrateSubdistricts()
    {
        $this->command->info('Migrating Subdistricts...');
        if (!Schema::hasTable('tb_ro_subdistricts')) {
            $this->command->error('Table tb_ro_subdistricts not found.');
            return;
        }

        // Chunking to avoid memory issues if there are many
        DB::table('tb_ro_subdistricts')->orderBy('subdistrict_id')->chunk(1000, function ($rows) {
            $data = [];
            foreach ($rows as $row) {
                $data[] = [
                    'id' => $row->subdistrict_id,
                    'city_id' => $row->city_id,
                    'name' => $row->subdistrict_name,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
            DB::table('subdistricts')->insertOrIgnore($data);
        });
    }
}
