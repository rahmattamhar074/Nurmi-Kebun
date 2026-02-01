<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use App\Models\Product;
use App\Models\PaymentMethod;
use App\Models\UserAddress;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class OrderSeeder extends Seeder
{
  /**
   * Run the database seeder.
   */
  public function run(): void
  {
    // Get necessary data
    $users = User::role('customer')->get();
    $products = Product::where('stock', '>', 0)->get();
    $paymentMethods = PaymentMethod::all();

    if ($users->isEmpty() || $products->isEmpty() || $paymentMethods->isEmpty()) {
      $this->command->warn('Skipping OrderSeeder: Missing required data (users, products, or payment methods)');
      return;
    }

    $this->command->info('Seeding orders...');

    // Create orders in different statuses
    $this->createPendingPaymentOrders($users, $products, $paymentMethods);
    $this->createPaymentVerificationOrders($users, $products, $paymentMethods);
    $this->createProcessingOrders($users, $products, $paymentMethods);
    $this->createShippedOrders($users, $products, $paymentMethods);
    $this->createCompletedOrders($users, $products, $paymentMethods);

    $this->command->info('Orders seeded successfully!');
  }

  private function createPendingPaymentOrders($users, $products, $paymentMethods)
  {
    for ($i = 0; $i < 5; $i++) {
      $user = $users->random();
      $address = $this->getOrCreateAddress($user);
      $paymentMethod = $paymentMethods->random();

      $order = $this->createOrder($user, $address, $paymentMethod, 'pending_payment');
      $this->addOrderItems($order, $products);
    }
  }

  private function createPaymentVerificationOrders($users, $products, $paymentMethods)
  {
    for ($i = 0; $i < 5; $i++) {
      $user = $users->random();
      $address = $this->getOrCreateAddress($user);
      $paymentMethod = $paymentMethods->random();

      $order = $this->createOrder($user, $address, $paymentMethod, 'payment_verification');
      $this->addOrderItems($order, $products);

      // Add payment proof
      $order->update([
        'payment_receipt' => 'payment-receipts/sample-receipt-' . $order->id . '.jpg',
        'sender_account_name' => $user->name,
        'sender_account_number' => '1234567890',
        'payment_amount' => $order->total,
        'payment_date' => now()->subDays(rand(1, 3)),
        'contact_phone' => '08123456789',
        'payment_uploaded_at' => now()->subDays(rand(1, 3)),
      ]);
    }
  }

  private function createProcessingOrders($users, $products, $paymentMethods)
  {
    $admin = User::role('administrator')->first();

    for ($i = 0; $i < 5; $i++) {
      $user = $users->random();
      $address = $this->getOrCreateAddress($user);
      $paymentMethod = $paymentMethods->random();

      $order = $this->createOrder($user, $address, $paymentMethod, 'processing');
      $this->addOrderItems($order, $products);

      // Add payment proof and verification
      $order->update([
        'payment_receipt' => 'payment-receipts/sample-receipt-' . $order->id . '.jpg',
        'sender_account_name' => $user->name,
        'sender_account_number' => '1234567890',
        'payment_amount' => $order->total,
        'payment_date' => now()->subDays(rand(3, 7)),
        'contact_phone' => '08123456789',
        'payment_uploaded_at' => now()->subDays(rand(3, 7)),
        'payment_verified_at' => now()->subDays(rand(1, 3)),
        'verified_by' => $admin?->id,
      ]);
    }
  }

  private function createShippedOrders($users, $products, $paymentMethods)
  {
    $admin = User::role('administrator')->first();

    for ($i = 0; $i < 5; $i++) {
      $user = $users->random();
      $address = $this->getOrCreateAddress($user);
      $paymentMethod = $paymentMethods->random();

      $order = $this->createOrder($user, $address, $paymentMethod, 'shipped');
      $this->addOrderItems($order, $products);

      // Add payment proof, verification, and shipping
      $order->update([
        'payment_receipt' => 'payment-receipts/sample-receipt-' . $order->id . '.jpg',
        'sender_account_name' => $user->name,
        'sender_account_number' => '1234567890',
        'payment_amount' => $order->total,
        'payment_date' => now()->subDays(rand(7, 14)),
        'contact_phone' => '08123456789',
        'payment_uploaded_at' => now()->subDays(rand(7, 14)),
        'payment_verified_at' => now()->subDays(rand(3, 7)),
        'verified_by' => $admin?->id,
        'tracking_number' => 'JNE' . rand(100000000000, 999999999999),
        'shipped_at' => now()->subDays(rand(1, 3)),
      ]);
    }
  }

  private function createCompletedOrders($users, $products, $paymentMethods)
  {
    $admin = User::role('administrator')->first();

    for ($i = 0; $i < 15; $i++) {
      $user = $users->random();
      $address = $this->getOrCreateAddress($user);
      $paymentMethod = $paymentMethods->random();

      $order = $this->createOrder($user, $address, $paymentMethod, 'completed');
      $this->addOrderItems($order, $products);

      // Vary completion dates across last 3 months for better report testing
      $daysAgo = rand(1, 90);
      $completedAt = now()->subDays($daysAgo);
      $shippedAt = $completedAt->copy()->subDays(rand(3, 7));
      $verifiedAt = $shippedAt->copy()->subDays(rand(3, 7));
      $uploadedAt = $verifiedAt->copy()->subDays(rand(1, 3));

      // Add full order history
      $order->update([
        'payment_receipt' => 'payment-receipts/sample-receipt-' . $order->id . '.jpg',
        'sender_account_name' => $user->name,
        'sender_account_number' => '1234567890',
        'payment_amount' => $order->total,
        'payment_date' => $uploadedAt,
        'contact_phone' => '08123456789',
        'payment_uploaded_at' => $uploadedAt,
        'payment_verified_at' => $verifiedAt,
        'verified_by' => $admin?->id,
        'tracking_number' => 'JNE' . rand(100000000000, 999999999999),
        'shipped_at' => $shippedAt,
        'completed_at' => $completedAt,
        'completion_method' => rand(0, 1) ? 'auto' : 'manual',
        'completed_by' => rand(0, 1) ? $admin?->id : null,
      ]);
    }
  }

  private function createOrder($user, $address, $paymentMethod, $status)
  {
    return Order::create([
      'order_number' => $this->generateOrderNumber(),
      'user_id' => $user->id,
      'status' => $status,
      'subtotal' => 0, // Will be calculated after adding items
      'shipping_cost' => 10000,
      'total' => 0, // Will be calculated after adding items
      'payment_method_id' => $paymentMethod->id,
      'payment_method_name' => $paymentMethod->name,
      'payment_method_type' => $paymentMethod->type,
      'payment_account_number' => $paymentMethod->account_number,
      'payment_account_holder' => $paymentMethod->account_holder,
      'shipping_name' => ['JNE', 'JNT', 'SiCepat', 'J&T Express'][rand(0, 3)],
      'recipient_name' => $address->recipient_name,
      'recipient_phone' => $address->recipient_phone,
      'province_name' => $address->province->name ?? 'Unknown Province',
      'city_name' => $address->city->name ?? 'Unknown City',
      'subdistrict_name' => $address->subdistrict->name ?? null,
      'postal_code' => $address->postal_code,
      'full_address' => $address->full_address,
      'customer_notes' => rand(0, 1) ? 'Please pack carefully' : null,
    ]);
  }

  private function addOrderItems($order, $products)
  {
    $itemCount = rand(1, 4);
    $selectedProducts = $products->random(min($itemCount, $products->count()));
    $subtotal = 0;

    foreach ($selectedProducts as $product) {
      $quantity = rand(1, 3);
      $price = $product->price;
      $itemSubtotal = $price * $quantity;
      $subtotal += $itemSubtotal;

      OrderItem::create([
        'order_id' => $order->id,
        'product_id' => $product->id,
        'product_code' => $product->code ?? 'PROD-' . str_pad($product->id, 5, '0', STR_PAD_LEFT),
        'product_name' => $product->name,
        'product_thumbnail' => $product->thumbnail,
        'price' => $price,
        'quantity' => $quantity,
        'subtotal' => $itemSubtotal,
      ]);
    }

    // Update order totals
    $order->update([
      'subtotal' => $subtotal,
      'total' => $subtotal + $order->shipping_cost,
    ]);
  }

  private function getOrCreateAddress($user)
  {
    // Always create a simple address to avoid null issues
    return (object)[
      'id' => null,
      'label' => 'Home',
      'recipient_name' => $user->name,
      'recipient_phone' => '08123456789',
      'province' => (object)['name' => 'DKI Jakarta'],
      'city' => (object)['name' => 'Jakarta Selatan'],
      'subdistrict' => (object)['name' => 'Kebayoran Baru'],
      'postal_code' => '12180',
      'full_address' => 'Jl. Sample Address No. 123',
    ];
  }

  private function generateOrderNumber()
  {
    $date = now()->format('Ymd');
    $lastOrder = Order::whereDate('created_at', today())
      ->orderBy('id', 'desc')
      ->first();

    $sequence = $lastOrder ? (int)substr($lastOrder->order_number, -4) + 1 : 1;

    return 'ORD-' . $date . '-' . str_pad($sequence, 4, '0', STR_PAD_LEFT);
  }
}
