<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class TransactionController extends Controller
{
  /**
   * Display transactions with pending_payment status
   */
  public function awaitingPayment(): Response
  {
    $orders = \App\Models\Order::query()
      ->where('status', 'pending_payment')
      ->with(['user', 'items.product'])
      ->orderBy('created_at', 'desc')
      ->paginate(15);

    return Inertia::render('dashboard/transaction/awaiting-payment/page', [
      'orders' => $orders->items(),
      'pagination' => [
        'currentPage' => $orders->currentPage(),
        'totalPages' => $orders->lastPage(),
        'perPage' => $orders->perPage(),
        'total' => $orders->total(),
        'from' => $orders->firstItem() ?? 0,
        'to' => $orders->lastItem() ?? 0,
      ],
    ]);
  }

  /**
   * Display transactions with payment_verification status
   */
  public function awaitingConfirmation(): Response
  {
    $orders = \App\Models\Order::query()
      ->where('status', 'payment_verification')
      ->with(['user', 'items.product'])
      ->orderBy('payment_uploaded_at', 'desc')
      ->paginate(15);

    return Inertia::render('dashboard/transaction/awaiting-confirmation/page', [
      'orders' => $orders->items(),
      'pagination' => [
        'currentPage' => $orders->currentPage(),
        'totalPages' => $orders->lastPage(),
        'perPage' => $orders->perPage(),
        'total' => $orders->total(),
        'from' => $orders->firstItem() ?? 0,
        'to' => $orders->lastItem() ?? 0,
      ],
    ]);
  }

  /**
   * Display transactions with processing status
   */
  public function processing(): Response
  {
    $orders = \App\Models\Order::query()
      ->where('status', 'processing')
      ->with(['user', 'items.product'])
      ->orderBy('payment_verified_at', 'desc')
      ->paginate(15);

    return Inertia::render('dashboard/transaction/processing/page', [
      'orders' => $orders->items(),
      'pagination' => [
        'currentPage' => $orders->currentPage(),
        'totalPages' => $orders->lastPage(),
        'perPage' => $orders->perPage(),
        'total' => $orders->total(),
        'from' => $orders->firstItem() ?? 0,
        'to' => $orders->lastItem() ?? 0,
      ],
    ]);
  }

  /**
   * Display transactions with shipped status
   */
  public function shipped(): Response
  {
    $orders = \App\Models\Order::query()
      ->where('status', 'shipped')
      ->with(['user', 'items.product'])
      ->orderBy('shipped_at', 'desc')
      ->paginate(15);

    return Inertia::render('dashboard/transaction/shipped/page', [
      'orders' => $orders->items(),
      'pagination' => [
        'currentPage' => $orders->currentPage(),
        'totalPages' => $orders->lastPage(),
        'perPage' => $orders->perPage(),
        'total' => $orders->total(),
        'from' => $orders->firstItem() ?? 0,
        'to' => $orders->lastItem() ?? 0,
      ],
    ]);
  }

  /**
   * Display transactions with completed status
   */
  public function completed(): Response
  {
    $orders = \App\Models\Order::query()
      ->where('status', 'completed')
      ->with(['user', 'items.product'])
      ->orderBy('completed_at', 'desc')
      ->paginate(15);

    return Inertia::render('dashboard/transaction/completed/page', [
      'orders' => $orders->items(),
      'pagination' => [
        'currentPage' => $orders->currentPage(),
        'totalPages' => $orders->lastPage(),
        'perPage' => $orders->perPage(),
        'total' => $orders->total(),
        'from' => $orders->firstItem() ?? 0,
        'to' => $orders->lastItem() ?? 0,
      ],
    ]);
  }

  /**
   * Display transactions with cancelled status
   */
  public function cancelled(): Response
  {
    $orders = \App\Models\Order::query()
      ->where('status', 'cancelled')
      ->with(['user', 'items.product'])
      ->orderBy('updated_at', 'desc')
      ->paginate(15);

    return Inertia::render('dashboard/transaction/cancelled/page', [
      'orders' => $orders->items(),
      'pagination' => [
        'currentPage' => $orders->currentPage(),
        'totalPages' => $orders->lastPage(),
        'perPage' => $orders->perPage(),
        'total' => $orders->total(),
        'from' => $orders->firstItem() ?? 0,
        'to' => $orders->lastItem() ?? 0,
      ],
    ]);
  }

  /**
   * Redirect to default transaction page
   */
  public function index()
  {
    return redirect()->route('dashboard.transactions.awaiting-payment');
  }

  /**
   * Approve an order payment
   */
  public function approve(\App\Models\Order $order)
  {
    if (!$order->isAwaitingVerification()) {
      return back()->with('error', 'Order cannot be approved. Invalid status.');
    }

    $order->update([
      'status' => 'processing',
      'payment_verified_at' => now(),
      'verified_by' => auth()->id(),
    ]);

    return back()->with('success', 'Order approved successfully!');
  }

  /**
   * Reject an order payment
   */
  public function reject(\App\Models\Order $order)
  {
    if (!$order->isAwaitingVerification()) {
      return back()->with('error', 'Order cannot be rejected. Invalid status.');
    }

    $order->update([
      'status' => 'pending_payment',
      'payment_receipt' => null,
      'payment_uploaded_at' => null,
      'sender_account_name' => null,
      'sender_account_number' => null,
      'payment_amount' => null,
      'payment_date' => null,
    ]);

    return back()->with('success', 'Order rejected successfully!');
  }

  /**
   * Ship an order
   */
  public function ship(\Illuminate\Http\Request $request, \App\Models\Order $order)
  {
    if ($order->status !== 'processing') {
      return back()->with('error', 'Order cannot be shipped. Invalid status.');
    }

    $validated = $request->validate([
      'tracking_number' => 'required|string|max:100',
    ]);

    $order->update([
      'status' => 'shipped',
      'tracking_number' => $validated['tracking_number'],
      'shipped_at' => now(),
    ]);

    return back()->with('success', 'Order shipped successfully!');
  }

  /**
   * Complete an order
   */
  public function complete(\App\Models\Order $order)
  {
    if (!$order->canBeCompleted()) {
      return back()->with('error', 'Order cannot be completed. Invalid status.');
    }

    $completed = $order->completeOrder('manual', auth()->id());

    if (!$completed) {
      return back()->with('error', 'Failed to complete order.');
    }

    return back()->with('success', 'Order completed successfully!');
  }

  /**
   * Cancel an order (admin-initiated)
   */
  public function cancel(\Illuminate\Http\Request $request, \App\Models\Order $order)
  {
    if ($order->status === 'completed') {
      return back()->with('error', 'Completed orders cannot be cancelled.');
    }

    $validated = $request->validate([
      'admin_notes' => 'required|string|max:1000',
    ]);

    $order->cancelOrder($validated['admin_notes'], 'admin');

    return back()->with('success', 'Order cancelled successfully!');
  }
}
