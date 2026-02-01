<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\ProductCategory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = ProductCategory::all();

        $products = [
            [
                'product_data' => [
                    'product_code' => 'MON-DEL-001',
                    'name' => 'Monstera Deliciosa',
                    'thumbnail' => 'https://picsum.photos/800/450?random=1',
                    'images' => [
                        'https://picsum.photos/800/450?random=1',
                        'https://picsum.photos/800/450?random=2'
                    ],
                    'description' => 'Popular tropical plant with large, glossy leaves featuring natural splits and holes. Perfect for adding a tropical touch to any room.',
                    'price' => 250000,
                    'stock' => 25,
                    'weight' => 2000,
                    'notes' => 'Handle with care - leaves are delicate',
                ],
                'categories' => ['Indoor Plants']
            ],
            [
                'product_data' => [
                    'product_code' => 'SNK-PLT-002',
                    'name' => 'Snake Plant (Sansevieria)',
                    'thumbnail' => 'https://picsum.photos/800/450?random=3',
                    'images' => [
                        'https://picsum.photos/800/450?random=3',
                        'https://picsum.photos/800/450?random=4'
                    ],
                    'description' => 'Low-maintenance air-purifying plant with striking upright leaves. Excellent for beginners and low-light conditions.',
                    'price' => 150000,
                    'stock' => 40,
                    'weight' => 1500,
                    'notes' => 'Very hardy - minimal watering required',
                ],
                'categories' => ['Indoor Plants']
            ],
            [
                'product_data' => [
                    'product_code' => 'ROS-BQT-003',
                    'name' => 'Premium Rose Bouquet',
                    'thumbnail' => 'https://picsum.photos/800/450?random=5',
                    'images' => [
                        'https://picsum.photos/800/450?random=5',
                        'https://picsum.photos/800/450?random=6'
                    ],
                    'description' => 'Elegant bouquet of 12 fresh red roses, perfect for special occasions and romantic gestures.',
                    'price' => 350000,
                    'stock' => 15,
                    'weight' => 500,
                    'notes' => 'Perishable - ship immediately after order',
                ],
                'categories' => ['Fresh Flowers', 'Flowering Plants']
            ],
            [
                'product_data' => [
                    'product_code' => 'SUC-MIX-004',
                    'name' => 'Succulent Mix Collection',
                    'thumbnail' => 'https://picsum.photos/800/450?random=7',
                    'images' => ['https://picsum.photos/800/450?random=7'],
                    'description' => 'Assorted collection of 5 different succulent varieties in decorative pots. Perfect for desk or windowsill.',
                    'price' => 180000,
                    'stock' => 30,
                    'weight' => 800,
                    'notes' => 'Fragile - pack with extra cushioning',
                ],
                'categories' => ['Succulents & Cacti', 'Indoor Plants']
            ],
            [
                'product_data' => [
                    'product_code' => 'LAV-POT-005',
                    'name' => 'Lavender Plant',
                    'thumbnail' => 'https://picsum.photos/800/450?random=8',
                    'images' => [
                        'https://picsum.photos/800/450?random=8',
                        'https://picsum.photos/800/450?random=9'
                    ],
                    'description' => 'Fragrant lavender plant in ceramic pot. Beautiful purple blooms with calming aroma.',
                    'price' => 200000,
                    'stock' => 20,
                    'weight' => 1200,
                    'notes' => 'Requires good sunlight - include care instructions',
                ],
                'categories' => ['Flowering Plants', 'Outdoor Plants']
            ],
            [
                'product_data' => [
                    'product_code' => 'FID-LYR-006',
                    'name' => 'Fiddle Leaf Fig',
                    'thumbnail' => 'https://picsum.photos/800/450?random=10',
                    'images' => ['https://picsum.photos/800/450?random=10'],
                    'description' => 'Trendy indoor tree with large, violin-shaped leaves. Makes a stunning statement piece.',
                    'price' => 450000,
                    'stock' => 12,
                    'weight' => 3500,
                    'notes' => 'Large plant - requires sturdy packaging',
                ],
                'categories' => ['Indoor Plants']
            ],
            [
                'product_data' => [
                    'product_code' => 'POT-MIX-007',
                    'name' => 'Pothos Golden',
                    'thumbnail' => 'https://picsum.photos/800/450?random=11',
                    'images' => ['https://picsum.photos/800/450?random=11'],
                    'description' => 'Easy-care trailing plant with heart-shaped variegated leaves. Perfect for hanging baskets.',
                    'price' => 120000,
                    'stock' => 35,
                    'weight' => 1000,
                    'notes' => 'Can be shipped in hanging basket or pot',
                ],
                'categories' => ['Indoor Plants']
            ],
            [
                'product_data' => [
                    'product_code' => 'CAC-MIX-008',
                    'name' => 'Cactus Garden Set',
                    'thumbnail' => 'https://picsum.photos/800/450?random=12',
                    'images' => ['https://picsum.photos/800/450?random=12'],
                    'description' => 'Collection of 3 assorted cacti in decorative ceramic pots. Extremely low maintenance.',
                    'price' => 160000,
                    'stock' => 28,
                    'weight' => 900,
                    'notes' => 'Handle with care - spines are sharp',
                ],
                'categories' => ['Succulents & Cacti']
            ],
            [
                'product_data' => [
                    'product_code' => 'ORC-PHE-009',
                    'name' => 'Phalaenopsis Orchid',
                    'thumbnail' => 'https://picsum.photos/800/450?random=13',
                    'images' => ['https://picsum.photos/800/450?random=13'],
                    'description' => 'Elegant white orchid with long-lasting blooms. Perfect gift for plant lovers.',
                    'price' => 320000,
                    'stock' => 18,
                    'weight' => 1100,
                    'notes' => 'Delicate flowers - pack carefully',
                ],
                'categories' => ['Flowering Plants', 'Indoor Plants']
            ],
            [
                'product_data' => [
                    'product_code' => 'FRT-SET-010',
                    'name' => 'Plant Care Starter Kit',
                    'thumbnail' => 'https://picsum.photos/800/450?random=14',
                    'images' => ['https://picsum.photos/800/450?random=14'],
                    'description' => 'Complete set including watering can, pruning shears, spray bottle, and organic fertilizer.',
                    'price' => 280000,
                    'stock' => 22,
                    'weight' => 1800,
                    'notes' => 'Check all items before packaging',
                ],
                'categories' => ['Plant Care']
            ],
        ];

        foreach ($products as $productData) {
            // Create the product
            $product = Product::create($productData['product_data']);

            // Get category IDs and attach them
            $categoryIds = $categories->whereIn('name', $productData['categories'])->pluck('id');
            $product->categories()->attach($categoryIds);
        }
    }
}
