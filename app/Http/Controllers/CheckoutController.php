<?php

namespace App\Http\Controllers;

use App\Services\OrderValidationService;
use App\Services\OrderService;
use App\Models\PaymentMethod;
use App\Models\UserAddress;
use Illuminate\Container\Attributes\Log;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CheckoutController extends Controller
{
  protected OrderValidationService $validationService;
  protected OrderService $orderService;

  public function __construct(
    OrderValidationService $validationService,
    OrderService $orderService
  ) {
    $this->validationService = $validationService;
    $this->orderService = $orderService;
  }

  /**
   * Step 1: Review cart items
   */
  public function index()
  {
    /** @var \App\Models\User $user */
    $user = Auth::user();

    // Validate cart and get any issues
    $issues = $this->validationService->validateCart($user);

    // Get fresh cart items after validation
    $cartItems = $this->validationService->getValidatedCartItems($user);

    // If cart is empty after validation, show empty state
    if ($cartItems->isEmpty()) {
      return Inertia::render('checkout/index', [
        'cartItems' => [],
        'totals' => null,
        'issues' => $issues,
      ]);
    }

    // Calculate totals
    $totals = $this->validationService->calculateTotals($cartItems);

    // Transform cart items for frontend
    $cartItems = $cartItems->map(function ($item) {
      return [
        'id' => $item->id,
        'product_id' => $item->product_id,
        'product_name' => $item->product->name,
        'product_code' => $item->product->product_code,
        'product_thumbnail' => $item->product->thumbnail_url,
        'price' => $item->price,
        'quantity' => $item->quantity,
        'subtotal' => $item->price * $item->quantity,
      ];
    });

    return Inertia::render('checkout/index', [
      'cartItems' => $cartItems,
      'totals' => $totals,
      'issues' => $issues,
    ]);
  }

  /**
   * Step 2: Select payment method and shipping address
   */
  public function payment(Request $request)
  {
    /** @var \App\Models\User $user */
    $user = Auth::user();

    $issues = $this->validationService->validateCart($user);
    $cartItems = $this->validationService->getValidatedCartItems($user);

    if ($cartItems->isEmpty()) {
      return redirect()->route('checkout.index')->with([
        'type' => 'error',
        'message' => 'Your cart is empty. Please add items before checkout.'
      ]);
    }

    $paymentMethods = PaymentMethod::where('is_active', true)->get();

    // Get all user addresses
    $allAddresses = $user->addresses()
      ->orderBy('is_default', 'desc')
      ->orderBy('created_at', 'desc')
      ->get();

    if ($allAddresses->isEmpty()) {
      return redirect()->route('settings.addresses.index')->with([
        'type' => 'error',
        'message' => 'Please add a shipping address before checkout.'
      ]);
    }

    // Determine selected address
    $addressId = $request->query('address_id');
    $selectedAddress = null;

    if ($addressId) {
      // Validate UUID format and that address belongs to user
      if (preg_match('/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i', $addressId)) {
        $selectedAddress = $allAddresses->firstWhere('id', $addressId);
      }

      // If invalid UUID or not found, fall back to default
      if (!$selectedAddress) {
        \Log::warning('Invalid address_id provided in checkout', [
          'user_id' => $user->id,
          'address_id' => $addressId,
        ]);
        $selectedAddress = $allAddresses->firstWhere('is_default', true);
      }
    } else {
      // No address_id provided, use default
      $selectedAddress = $allAddresses->firstWhere('is_default', true);
    }

    // Ensure we have a selected address
    if (!$selectedAddress) {
      return redirect()->route('settings.addresses.index')->with([
        'type' => 'error',
        'message' => 'Please set a default shipping address before checkout.'
      ]);
    }

    $totals = $this->validationService->calculateTotals($cartItems);
    $totalWeight = $cartItems->sum(function ($item) {
      return ($item->product->weight ?? 100) * $item->quantity;
    });

    $shippingOptions = [];
    if ($selectedAddress->postal_code) {
      try {
        $items = $cartItems->map(function ($item) {
          return [
            'name' => $item->product->name,
            'description' => $item->product->description ?? 'Product',
            'weight' => (int) ($item->product->weight ?? 100),
            'quantity' => (int) $item->quantity,
            'value' => (int) $item->price,
          ];
        })->toArray();

        \Log::info('About to calculate shipping with Biteship', [
          'postal_code' => $selectedAddress->postal_code,
          'items_count' => count($items),
          'total_weight' => $totalWeight,
          'address_id' => $selectedAddress->id,
        ]);

        $shippingService = app(\App\Services\ShippingCostService::class);
        $shippingOptions = $shippingService->calculate(
          (string) $selectedAddress->postal_code,
          $items,
          'jne,jnt'
        );
      } catch (\Exception $e) {
        \Log::error('Failed to fetch shipping costs', [
          'error' => $e->getMessage(),
          'trace' => $e->getTraceAsString(),
          'user_id' => $user->id,
          'postal_code' => $selectedAddress->postal_code,
        ]);
      }
    } else {
      \Log::warning('Address missing postal_code', [
        'user_id' => $user->id,
        'address_id' => $selectedAddress->id,
      ]);
    }

    return Inertia::render('checkout/payment', [
      'paymentMethods' => $paymentMethods,
      'selectedAddress' => $selectedAddress,
      'allAddresses' => $allAddresses,
      'courierGroups' => $shippingOptions,
      'totals' => $totals,
      'totalWeight' => $totalWeight,
      'issues' => $issues,
    ]);
  }

  /**
   * Process checkout and create order
   */
  public function store(Request $request)
  {
    /** @var \App\Models\User $user */
    $user = Auth::user();

    $validated = $request->validate([
      'payment_method_id' => 'required|exists:payment_methods,id',
      'user_address_id' => 'required|exists:user_addresses,id',
      'shipping_service' => 'required|string|max:50',
      'shipping_cost' => 'required|numeric|min:0',
      'customer_notes' => 'nullable|string|max:1000',
    ]);

    try {
      // Validate cart one more time
      $issues = $this->validationService->validateCart($user);
      $cartItems = $this->validationService->getValidatedCartItems($user);

      if ($cartItems->isEmpty()) {
        return back()->with([
          'type' => 'error',
          'message' => 'Your cart is empty.'
        ]);
      }

      // Create order
      $order = $this->orderService->createOrderFromCart(
        $user,
        $validated['payment_method_id'],
        $validated['user_address_id'],
        $validated['shipping_service'],
        $validated['shipping_cost'],
        $validated['customer_notes'] ?? null
      );

      // Redirect to payment upload page
      return redirect()->route('transactions.show', $order->order_number)->with([
        'type' => 'success',
        'message' => 'Order created successfully! Please upload your payment proof.'
      ]);
    } catch (\Exception $e) {
      \Log::error('Checkout failed', [
        'error' => $e->getMessage(),
        'user_id' => $user->id,
      ]);

      return back()->with([
        'type' => 'error',
        'message' => 'Failed to create order. Please try again.'
      ]);
    }
  }
}
