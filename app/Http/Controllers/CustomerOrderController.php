<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Review;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Barryvdh\DomPDF\Facade\Pdf;

class CustomerOrderController extends Controller
{
    /**
     * Redirect to default order page
     */
    public function index()
    {
        return redirect()->route('my-orders.pending-payment');
    }

    /**
     * Display orders with pending_payment status
     */
    public function pendingPayment(Request $request): Response
    {
        $orders = Order::query()
            ->where('user_id', $request->user()->id)
            ->where('status', 'pending_payment')
            ->with(['items.product'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('my-orders/pending-payment/page', [
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
     * Display orders with payment_verification status
     */
    public function awaitingConfirmation(Request $request): Response
    {
        $orders = Order::query()
            ->where('user_id', $request->user()->id)
            ->where('status', 'payment_verification')
            ->with(['items.product'])
            ->orderBy('payment_uploaded_at', 'desc')
            ->paginate(10);

        return Inertia::render('my-orders/awaiting-confirmation/page', [
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
     * Display orders with processing status
     */
    public function processing(Request $request): Response
    {
        $orders = Order::query()
            ->where('user_id', $request->user()->id)
            ->where('status', 'processing')
            ->with(['items.product'])
            ->orderBy('payment_verified_at', 'desc')
            ->paginate(10);

        return Inertia::render('my-orders/processing/page', [
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
     * Display orders with shipped status
     */
    public function shipped(Request $request): Response
    {
        $orders = Order::query()
            ->where('user_id', $request->user()->id)
            ->where('status', 'shipped')
            ->with(['items.product'])
            ->orderBy('shipped_at', 'desc')
            ->paginate(10);

        return Inertia::render('my-orders/shipped/page', [
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
     * Display orders with completed status
     */
    public function completed(Request $request): Response
    {
        $orders = Order::query()
            ->where('user_id', $request->user()->id)
            ->where('status', 'completed')
            ->with(['items.product'])
            ->orderBy('completed_at', 'desc')
            ->paginate(10);

        return Inertia::render('my-orders/completed/page', [
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
     * Display orders with cancelled status
     */
    public function cancelled(Request $request): Response
    {
        $orders = Order::query()
            ->where('user_id', $request->user()->id)
            ->where('status', 'cancelled')
            ->with(['items.product'])
            ->orderBy('updated_at', 'desc')
            ->paginate(10);

        return Inertia::render('my-orders/cancelled/page', [
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
     * Display a single order detail
     */
    public function show(Request $request, Order $order): Response
    {
        if ($order->user_id !== $request->user()->id) {
            abort(403, 'Unauthorized access to this order.');
        }

        $order->load(['items.product', 'user']);

        $hasReviews = Review::where('order_id', $order->id)->exists();

        $reviews = [];
        if ($hasReviews) {
            $reviews = Review::where('order_id', $order->id)
                ->with('product')
                ->get();
        }

        return Inertia::render('my-orders/[order]/page', [
            'order' => array_merge($order->toArray(), [
                'has_reviews' => $hasReviews,
            ]),
            'reviews' => $reviews,
        ]);
    }

    /**
     * Mark order as completed (received by customer)
     */
    public function complete(Request $request, Order $order)
    {
        if ($order->user_id !== $request->user()->id) {
            abort(403, 'Unauthorized access to this order.');
        }

        if ($order->status !== 'shipped') {
            return back()->with('error', 'Only shipped orders can be marked as received.');
        }

        $order->update([
            'status' => 'completed',
            'completed_at' => now(),
        ]);

        return redirect()->route('my-orders.completed')->with('success', 'Order marked as received successfully!');
    }

    /**
     * Submit reviews for order items
     */
    public function review(Request $request, Order $order)
    {
        if ($order->user_id !== $request->user()->id) {
            abort(403, 'Unauthorized access to this order.');
        }

        if ($order->status !== 'completed') {
            return back()->with('error', 'Only completed orders can be reviewed.');
        }

        $validated = $request->validate([
            'reviews' => 'required|array|min:1',
            'reviews.*.order_item_id' => 'required|exists:order_items,id',
            'reviews.*.product_id' => 'required|exists:products,id',
            'reviews.*.score' => 'required|integer|min:1|max:5',
            'reviews.*.review' => 'nullable|string|max:1000',
        ]);

        $order->load('items.product');

        foreach ($validated['reviews'] as $reviewData) {
            $orderItem = $order->items->firstWhere('id', $reviewData['order_item_id']);

            if (!$orderItem) {
                continue;
            }

            $existingReview = \App\Models\Review::where('order_item_id', $reviewData['order_item_id'])->first();

            if ($existingReview) {
            }

            \App\Models\Review::create([
                'order_id' => $order->id,
                'order_item_id' => $reviewData['order_item_id'],
                'user_id' => $request->user()->id,
                'product_id' => $reviewData['product_id'],
                'order_number' => $order->order_number,
                'product_name' => $orderItem->product_name,
                'user_name' => $request->user()->name,
                'score' => $reviewData['score'],
                'review' => $reviewData['review'] ?? null,
            ]);
        }

        return back()->with('success', 'Thank you for your reviews!');
    }

    /**
     * Cancel an order (customer-initiated)
     */
    public function cancel(Request $request, Order $order)
    {
        // Verify user owns the order
        if ($order->user_id !== $request->user()->id) {
            abort(403, 'Unauthorized access to this order.');
        }

        // Validate order can be cancelled
        if (!$order->canBeCancelled()) {
            return back()->with('error', 'This order cannot be cancelled at this stage.');
        }

        // Validate cancellation reason
        $validated = $request->validate([
            'cancellation_reason' => 'required|string|max:1000',
        ]);

        // Cancel the order
        $order->cancelOrder($validated['cancellation_reason'], 'customer');

        return back()->with('success', 'Order cancelled successfully.');
    }

    /**
     * Download invoice PDF for an order
     */
    public function downloadInvoice(Request $request, Order $order)
    {
        // Verify user owns the order
        if ($order->user_id !== $request->user()->id) {
            abort(403, 'Unauthorized access to this order.');
        }

        // Check if order status allows invoice download
        if (!in_array($order->status, ['processing', 'shipped', 'completed'])) {
            return back()->with('error', 'Invoice is only available for paid or completed orders.');
        }

        // Load necessary relationships
        $order->load(['items.product', 'user', 'paymentMethod']);

        // Generate PDF
        $pdf = Pdf::loadView('invoices.invoice', [
            'order' => $order,
        ]);

        // Set paper size and orientation
        $pdf->setPaper('a4', 'portrait');

        // Generate filename
        $filename = 'invoice-' . $order->order_number . '.pdf';

        // Download PDF
        return $pdf->download($filename);
    }
}
