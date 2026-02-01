<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PaymentMethod;

class PaymentMethodSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $paymentMethods = [
            // Banks
            [
                'name' => 'BRI',
                'type' => 'bank',
                'account_number' => '0000000000000000',
                'account_holder_name' => 'Store Owner',
                'icon' => '/assets/logo/brand-bri.png',
                'is_active' => true,
            ],
            [
                'name' => 'BNI',
                'type' => 'bank',
                'account_number' => '0000000000000000',
                'account_holder_name' => 'Store Owner',
                'icon' => '/assets/logo/brand-bni.png',
                'is_active' => true,
            ],
            [
                'name' => 'Mandiri',
                'type' => 'bank',
                'account_number' => '0000000000000000',
                'account_holder_name' => 'Store Owner',
                'icon' => '/assets/logo/brand-mandiri.png',
                'is_active' => true,
            ],
            [
                'name' => 'BCA',
                'type' => 'bank',
                'account_number' => '0000000000000000',
                'account_holder_name' => 'Store Owner',
                'icon' => '/assets/logo/brand-bca.png',
                'is_active' => true,
            ],
            [
                'name' => 'Seabank',
                'type' => 'bank',
                'account_number' => '0000000000000000',
                'account_holder_name' => 'Store Owner',
                'icon' => '/assets/logo/brand-seabank.png',
                'is_active' => true,
            ],
            [
                'name' => 'BSI',
                'type' => 'bank',
                'account_number' => '0000000000000000',
                'account_holder_name' => 'Store Owner',
                'icon' => '/assets/logo/brand-bsi.png',
                'is_active' => true,
            ],
            // E-Wallets
            [
                'name' => 'Dana',
                'type' => 'e_wallet',
                'account_number' => '08000000000',
                'account_holder_name' => 'Store Owner',
                'icon' => '/assets/logo/brand-dana.png',
                'is_active' => true,
            ],
            [
                'name' => 'OVO',
                'type' => 'e_wallet',
                'account_number' => '08000000000',
                'account_holder_name' => 'Store Owner',
                'icon' => '/assets/logo/brand-ovo.png',
                'is_active' => true,
            ],
            [
                'name' => 'Gopay',
                'type' => 'e_wallet',
                'account_number' => '08000000000',
                'account_holder_name' => 'Store Owner',
                'icon' => '/assets/logo/brand-gopay.png',
                'is_active' => true,
            ],
            [
                'name' => 'ShopeePay',
                'type' => 'e_wallet',
                'account_number' => '08000000000',
                'account_holder_name' => 'Store Owner',
                'icon' => '/assets/logo/brand-shopeepay.png',
                'is_active' => true,
            ],
        ];

        foreach ($paymentMethods as $paymentMethod) {
            PaymentMethod::create($paymentMethod);
        }
    }
}
