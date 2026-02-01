<?php

namespace Database\Seeders;

use App\Models\ProductCategory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Indoor Plants',
                'description' => 'Beautiful plants perfect for indoor decoration and air purification',
            ],
            [
                'name' => 'Outdoor Plants',
                'description' => 'Hardy plants suitable for gardens and outdoor spaces',
            ],
            [
                'name' => 'Flowering Plants',
                'description' => 'Colorful blooming plants to brighten up any space',
            ],
            [
                'name' => 'Succulents & Cacti',
                'description' => 'Low-maintenance desert plants perfect for beginners',
            ],
            [
                'name' => 'Fresh Flowers',
                'description' => 'Fresh cut flowers for bouquets and arrangements',
            ],
            [
                'name' => 'Plant Care',
                'description' => 'Essential tools and supplies for plant maintenance',
            ],
        ];

        foreach ($categories as $category) {
            ProductCategory::create($category);
        }
    }
}
