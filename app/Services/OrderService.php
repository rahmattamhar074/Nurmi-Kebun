<?php

namespace App\Services;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\PaymentMethod;
use App\Models\User;
use App\Models\UserAddress;
use Illuminate\Support\Facades\DB;

class OrderService
{
  /**
   * Create an order from user's cart.
   *
   * @param User $user
   * @param int $paymentMethodId
   * @param string $userAddressId
   * @param string $shippingService
   * @param float $shippingCost
   * @param string|null $customerNotes
   * @return Order
   * @throws \Exception
   */
  public function createOrderFromCart(
    User $user,
    int $paymentMethodId,
    string $userAddressId,
    string $shippingService,
    float $shippingCost,
    ?string $customerNotes = null
  ): Order {
    return DB::transaction(function () use ($user, $paymentMethodId, $userAddressId, $shippingService, $shippingCost, $customerNotes) {
      // Get cart items
      $cartItems = $user->cartItems()->with('product')->get();

      if ($cartItems->isEmpty()) {
        throw new \Exception('Cart is empty');
      }

      // Get payment method and address
      $paymentMethod = PaymentMethod::findOrFail($paymentMethodId);
      $userAddress = UserAddress::where('user_id', $user->id)
        ->findOrFail($userAddressId);

      // Calculate totals
      $subtotal = $cartItems->sum(function ($item) {
        return $item->price * $item->quantity;
      });
      $total = $subtotal + $shippingCost;

      // Create order
      $order = Order::create([
        'user_id' => $user->id,
        'status' => 'pending_payment',
        'subtotal' => $subtotal,
        'shipping_cost' => $shippingCost,
        'shipping_name' => $shippingService,
        'total' => $total,

        // Payment method snapshot
        'payment_method_id' => $paymentMethod->id,
        'payment_method_name' => $paymentMethod->name,
        'payment_method_type' => $paymentMethod->type,
        'payment_account_number' => $paymentMethod->account_number,
        'payment_account_holder' => $paymentMethod->account_holder_name,

        // Shipping address snapshot
        'user_address_id' => $userAddress->id,
        'recipient_name' => $userAddress->recipient_name,
        'recipient_phone' => $userAddress->phone,
        'province_name' => $userAddress->province_name,
        'city_name' => $userAddress->city_name,
        'subdistrict_name' => $userAddress->subdistrict_name,
        'postal_code' => $userAddress->postal_code,
        'full_address' => $userAddress->full_address,

        // Contact info (from user profile)
        'contact_phone' => $user->phone ?? $userAddress->phone,

        // Notes
        'customer_notes' => $customerNotes,
      ]);

      // Create order items (snapshot)
      foreach ($cartItems as $cartItem) {
        OrderItem::create([
          'order_id' => $order->id,
          'product_id' => $cartItem->product_id,
          'product_code' => $cartItem->product->product_code,
          'product_name' => $cartItem->product->name,
          'product_description' => $cartItem->product->description,
          'product_thumbnail' => $cartItem->product->thumbnail,
          'price' => $cartItem->price,
          'quantity' => $cartItem->quantity,
          'subtotal' => $cartItem->price * $cartItem->quantity,
        ]);
      }

      // Clear cart
      $user->cartItems()->delete();

      return $order->load('items');
    });
  }

  /**
   * Upload payment proof for an order.
   *
   * @param Order $order
   * @param array $paymentData
   * @return Order
   */
  public function uploadPaymentProof(Order $order, array $paymentData): Order
  {
    $order->update([
      'payment_receipt' => $paymentData['payment_receipt'],
      'sender_account_name' => $paymentData['sender_account_name'],
      'sender_account_number' => $paymentData['sender_account_number'],
      'payment_amount' => $paymentData['payment_amount'],
      'payment_date' => $paymentData['payment_date'],
      'contact_phone' => $paymentData['contact_phone'] ?? $order->contact_phone,
      'payment_uploaded_at' => now(),
      'status' => 'payment_verification',
    ]);

    // Broadcast event to notify admins
    \Log::info('Dispatching OrderPaid event', [
      'order_id' => $order->id,
      'order_number' => $order->order_number,
    ]);
    event(new \App\Events\OrderPaid($order->load('user')));

    return $order;
  }
}
