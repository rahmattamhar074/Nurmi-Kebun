<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Collection;

class OrderValidationService
{
  /**
   * Validate user's cart and return any issues found.
   * Updates cart items if necessary (price changes, stock adjustments).
   *
   * @param User $user
   * @return array Array of issue messages
   */
  public function validateCart(User $user): array
  {
    $cartItems = $user->cartItems()->with('product')->get();
    $issues = [];

    if ($cartItems->isEmpty()) {
      return ['Your cart is empty. Please add items before checkout.'];
    }

    foreach ($cartItems as $item) {
      // Check if product still exists
      if (!$item->product) {
        $issues[] = "A product in your cart is no longer available and has been removed.";
        $item->delete();
        continue;
      }

      // Check stock availability
      if ($item->product->stock < $item->quantity) {
        if ($item->product->stock === 0) {
          $issues[] = "{$item->product->name} is out of stock and has been removed from your cart.";
          $item->delete();
        } else {
          $issues[] = "{$item->product->name}: Only {$item->product->stock} left in stock. Quantity adjusted.";
          $item->quantity = $item->product->stock;
          $item->save();
        }
        continue;
      }

      // Check for price changes (compare as floats to avoid decimal string issues)
      $currentPrice = floatval($item->price);
      $productPrice = floatval($item->product->price);

      // Use epsilon for float comparison to avoid precision issues
      // If difference is less than 1 (Rupiah), just update silently without warning
      if (abs($currentPrice - $productPrice) > 1.0) {
        $oldPrice = number_format($currentPrice, 0, ',', '.');
        $newPrice = number_format($productPrice, 0, ',', '.');
        $issues[] = "{$item->product->name}: Price updated from Rp {$oldPrice} to Rp {$newPrice}.";
        $item->price = $item->product->price;
        $item->save();
      } elseif (abs($currentPrice - $productPrice) > 0) {
        // Silent update for negligible differences
        $item->price = $item->product->price;
        $item->save();
      }
    }

    return $issues;
  }

  /**
   * Get validated cart items with fresh data.
   *
   * @param User $user
   * @return Collection
   */
  public function getValidatedCartItems(User $user): Collection
  {
    return $user->cartItems()->with('product')->get();
  }

  /**
   * Calculate cart totals.
   *
   * @param Collection $cartItems
   * @return array
   */
  public function calculateTotals(Collection $cartItems): array
  {
    $subtotal = $cartItems->sum(function ($item) {
      return $item->price * $item->quantity;
    });

    $shippingCost = 10000; // Hardcoded for now
    $total = $subtotal + $shippingCost;

    return [
      'subtotal' => $subtotal,
      'shipping_cost' => $shippingCost,
      'total' => $total,
    ];
  }
}
