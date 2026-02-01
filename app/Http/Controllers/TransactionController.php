<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Services\OrderService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class TransactionController extends Controller
{
  protected OrderService $orderService;

  public function __construct(OrderService $orderService)
  {
    $this->orderService = $orderService;
  }

  /**
   * Show transaction detail page
   */
  public function show(Order $order)
  {
    if ($order->user_id !== Auth::id()) {
      abort(403);
    }

    $order->load(['items', 'paymentMethod', 'userAddress']);

    return Inertia::render('transactions/detail', [
      'order' => [
        'id' => $order->id,
        'order_number' => $order->order_number,
        'status' => $order->status,
        'created_at' => $order->created_at->toISOString(),

        'subtotal' => $order->subtotal,
        'shipping_cost' => $order->shipping_cost,
        'total' => $order->total,

        'items' => $order->items->map(function ($item) {
          return [
            'id' => $item->id,
            'product_code' => $item->product_code,
            'product_name' => $item->product_name,
            'product_thumbnail' => $item->product_thumbnail,
            'price' => $item->price,
            'quantity' => $item->quantity,
            'subtotal' => $item->subtotal,
          ];
        }),

        'payment_method' => [
          'name' => $order->payment_method_name,
          'type' => $order->payment_method_type,
          'account_number' => $order->payment_account_number,
          'account_holder' => $order->payment_account_holder,
        ],

        'shipping_address' => [
          'name' => $order->shipping_name,
          'recipient_name' => $order->recipient_name,
          'recipient_phone' => $order->recipient_phone,
          'province_name' => $order->province_name,
          'city_name' => $order->city_name,
          'subdistrict_name' => $order->subdistrict_name,
          'postal_code' => $order->postal_code,
          'full_address' => $order->full_address,
        ],

        'payment_receipt' => $order->payment_receipt,
        'sender_account_name' => $order->sender_account_name,
        'sender_account_number' => $order->sender_account_number,
        'payment_amount' => $order->payment_amount,
        'payment_date' => $order->payment_date?->toISOString(),
        'contact_phone' => $order->contact_phone,
        'payment_uploaded_at' => $order->payment_uploaded_at?->toISOString(),
        'payment_verified_at' => $order->payment_verified_at?->toISOString(),

        'can_upload_payment' => $order->canUploadPayment(),
        'can_be_cancelled' => $order->canBeCancelled(),
        'is_awaiting_verification' => $order->isAwaitingVerification(),

        'customer_notes' => $order->customer_notes,
        'admin_notes' => $order->admin_notes,
        'cancellation_reason' => $order->cancellation_reason,
      ],
    ]);
  }

  /**
   * Upload payment proof
   */
  public function uploadPayment(Request $request, Order $order)
  {
    if ($order->user_id !== Auth::id()) {
      abort(403);
    }

    if (!$order->canUploadPayment()) {
      return back()->with([
        'type' => 'error',
        'message' => 'Payment proof has already been uploaded for this order.'
      ]);
    }

    $validated = $request->validate([
      'sender_account_name' => 'required|string|max:255',
      'sender_account_number' => 'required|string|max:50',
      'payment_amount' => 'required|numeric|min:0',
      'payment_date' => 'required|date|before_or_equal:today',
      'contact_phone' => 'nullable|string|max:20',
    ]);

    try {
      $receiptPath = $request->file('payment_receipt')->store('payment-receipts', 'public');

      $this->orderService->uploadPaymentProof($order, [
        'payment_receipt' => $receiptPath,
        'sender_account_name' => $validated['sender_account_name'],
        'sender_account_number' => $validated['sender_account_number'],
        'payment_amount' => $validated['payment_amount'],
        'payment_date' => $validated['payment_date'],
        'contact_phone' => $validated['contact_phone'] ?? $order->contact_phone,
      ]);

      return back()->with([
        'type' => 'success',
        'message' => 'Payment proof uploaded successfully! We will verify your payment soon.'
      ]);
    } catch (\Exception $e) {
      \Log::error('Payment upload failed', [
        'error' => $e->getMessage(),
        'order_id' => $order->id,
      ]);

      return back()->with([
        'type' => 'error',
        'message' => 'Failed to upload payment proof. Please try again.'
      ]);
    }
  }
}
