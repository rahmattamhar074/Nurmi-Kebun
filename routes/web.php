<?php

use App\Http\Controllers;
use Illuminate\Support\Facades\Route;

Route::get('/', Controllers\HomeController::class)->name('home');
Route::get('/store', Controllers\StoreController::class)->name('store');

// Public API route for product reviews (accessible to everyone)
Route::get('/products/{product}/reviews', [Controllers\ProductController::class, 'getReviews'])->name('api.products.reviews');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::middleware(['role:administrator'])->group(function () {
        Route::prefix('dashboard')->group(function () {
            Route::get('/', Controllers\DashboardController::class)->name('dashboard');

            Route::get('products', [Controllers\ProductController::class, 'index'])->name('products.index');
            Route::get('products/create', [Controllers\ProductController::class, 'create'])->name('products.create');
            Route::post('products', [Controllers\ProductController::class, 'store'])->name('products.store');

            // Deleted products management (must be before parameterized routes)
            Route::get('products/deleted', [Controllers\Dashboard\DeletedProductController::class, 'index'])->name('products.deleted');
            Route::post('products/deleted/{id}/restore', [Controllers\Dashboard\DeletedProductController::class, 'restore'])->name('products.deleted.restore');

            Route::get('products/{product}', [Controllers\ProductController::class, 'show'])->name('products.show');
            Route::get('products/{product}/edit', [Controllers\ProductController::class, 'edit'])->name('products.edit');
            Route::match(['put', 'post'], 'products/{product}', [Controllers\ProductController::class, 'update'])->name('products.update');
            Route::delete('products/{product}', [Controllers\ProductController::class, 'destroy'])->name('products.destroy');

            Route::resource('categories', Controllers\ProductCategoryController::class, [
                'parameters' => ['categories' => 'productCategory']
            ]);

            // Customer management
            Route::get('customers', [Controllers\Dashboard\CustomerController::class, 'index'])->name('dashboard.customers.index');

            Route::prefix('settings')->name('dashboard.')->group(function () {
                Route::get('payment-methods', [Controllers\Dashboard\PaymentMethodController::class, 'index'])->name('payment-methods.index');

                Route::match(['put', 'post'], 'payment-methods/{paymentMethod}', [Controllers\Dashboard\PaymentMethodController::class, 'update'])->name('payment-methods.update');

                Route::patch('payment-methods/{paymentMethod}/toggle-status', [Controllers\Dashboard\PaymentMethodController::class, 'toggleStatus'])
                    ->name('payment-methods.toggle-status');

                Route::get('admin-accounts', [Controllers\Dashboard\AdminController::class, 'index'])->name('admin-accounts.index');
                Route::post('admin-accounts', [Controllers\Dashboard\AdminController::class, 'store'])->name('admin-accounts.store');
                Route::patch('admin-settings', [Controllers\Dashboard\AdminController::class, 'updateSettings'])->name('admin-settings.update');
            });

            // Transaction management routes
            Route::prefix('transactions')->name('dashboard.transactions.')->group(function () {
                Route::get('/', [Controllers\Dashboard\TransactionController::class, 'index'])->name('index');
                Route::get('/awaiting-payment', [Controllers\Dashboard\TransactionController::class, 'awaitingPayment'])->name('awaiting-payment');
                Route::get('/awaiting-confirmation', [Controllers\Dashboard\TransactionController::class, 'awaitingConfirmation'])->name('awaiting-confirmation');
                Route::get('/processing', [Controllers\Dashboard\TransactionController::class, 'processing'])->name('processing');
                Route::get('/shipped', [Controllers\Dashboard\TransactionController::class, 'shipped'])->name('shipped');
                Route::get('/completed', [Controllers\Dashboard\TransactionController::class, 'completed'])->name('completed');
                Route::get('/cancelled', [Controllers\Dashboard\TransactionController::class, 'cancelled'])->name('cancelled');

                // Transaction actions
                Route::post('/{order}/approve', [Controllers\Dashboard\TransactionController::class, 'approve'])->name('approve');
                Route::post('/{order}/reject', [Controllers\Dashboard\TransactionController::class, 'reject'])->name('reject');
                Route::post('/{order}/ship', [Controllers\Dashboard\TransactionController::class, 'ship'])->name('ship');
                Route::post('/{order}/complete', [Controllers\Dashboard\TransactionController::class, 'complete'])->name('complete');
                Route::post('/{order}/cancel', [Controllers\Dashboard\TransactionController::class, 'cancel'])->name('cancel');
            });

            // Support ticket management routes
            Route::prefix('support')->name('dashboard.support.')->group(function () {
                Route::get('/', [Controllers\Dashboard\SupportTicketController::class, 'index'])->name('index');
                Route::get('/{ticket:ticket_number}', [Controllers\Dashboard\SupportTicketController::class, 'show'])->name('show');
                Route::post('/{ticket:ticket_number}/reply', [Controllers\Dashboard\SupportTicketController::class, 'reply'])->name('reply');
                Route::post('/{ticket:ticket_number}/resolve', [Controllers\Dashboard\SupportTicketController::class, 'markAsResolved'])->name('resolve');
                Route::post('/{ticket:ticket_number}/priority', [Controllers\Dashboard\SupportTicketController::class, 'updatePriority'])->name('priority');
                Route::post('/{ticket:ticket_number}/close', [Controllers\Dashboard\SupportTicketController::class, 'close'])->name('close');
                Route::get('/attachments/{message}', [Controllers\Dashboard\SupportTicketController::class, 'downloadAttachment'])->name('attachment');
            });

            // Reports management
            Route::prefix('reports')->name('dashboard.reports.')->group(function () {
                Route::get('/', [Controllers\Dashboard\ReportController::class, 'index'])->name('index');
                Route::get('/export/excel', [Controllers\Dashboard\ReportController::class, 'exportExcel'])->name('export.excel');
                Route::get('/export/pdf', [Controllers\Dashboard\ReportController::class, 'exportPdf'])->name('export.pdf');
            });

            // Review management
            Route::get('reviews', [Controllers\Dashboard\ReviewController::class, 'index'])->name('dashboard.reviews.index');
        });
    });

    // Customer routes
    Route::middleware(['role:customer'])->group(function () {
        // Cart API routes (using session auth)
        Route::prefix('api/cart')->group(function () {
            Route::get('/', [Controllers\Api\CartController::class, 'index']);
            Route::post('/sync', [Controllers\Api\CartController::class, 'sync']);
            Route::post('/', [Controllers\Api\CartController::class, 'store']);
            Route::put('/{productId}', [Controllers\Api\CartController::class, 'update']);
            Route::delete('/{productId}', [Controllers\Api\CartController::class, 'destroy']);
            Route::post('/clear', [Controllers\Api\CartController::class, 'clear']);
        });

        // Checkout routes
        Route::prefix('checkout')->name('checkout.')->group(function () {
            Route::get('/', [Controllers\CheckoutController::class, 'index'])->name('index');
            Route::get('/payment', [Controllers\CheckoutController::class, 'payment'])->name('payment');
            Route::post('/process', [Controllers\CheckoutController::class, 'store'])->name('store');
        });

        // Transaction routes
        Route::prefix('transactions')->name('transactions.')->group(function () {
            Route::get('/{order:order_number}', [Controllers\TransactionController::class, 'show'])->name('show');
            Route::post('/{order:order_number}/upload-payment', [Controllers\TransactionController::class, 'uploadPayment'])->name('upload-payment');
        });

        // My Orders routes
        Route::prefix('my-orders')->name('my-orders.')->group(function () {
            Route::get('/', [Controllers\CustomerOrderController::class, 'index'])->name('index');
            Route::get('/pending-payment', [Controllers\CustomerOrderController::class, 'pendingPayment'])->name('pending-payment');
            Route::get('/awaiting-confirmation', [Controllers\CustomerOrderController::class, 'awaitingConfirmation'])->name('awaiting-confirmation');
            Route::get('/processing', [Controllers\CustomerOrderController::class, 'processing'])->name('processing');
            Route::get('/shipped', [Controllers\CustomerOrderController::class, 'shipped'])->name('shipped');
            Route::get('/completed', [Controllers\CustomerOrderController::class, 'completed'])->name('completed');
            Route::get('/cancelled', [Controllers\CustomerOrderController::class, 'cancelled'])->name('cancelled');
            Route::get('/{order:order_number}', [Controllers\CustomerOrderController::class, 'show'])->name('show');
            Route::post('/{order:order_number}/complete', [Controllers\CustomerOrderController::class, 'complete'])->name('complete');
            Route::post('/{order:order_number}/review', [Controllers\CustomerOrderController::class, 'review'])->name('review');
            Route::post('/{order:order_number}/cancel', [Controllers\CustomerOrderController::class, 'cancel'])->name('cancel');
            Route::get('/{order:order_number}/invoice', [Controllers\CustomerOrderController::class, 'downloadInvoice'])->name('invoice');
        });

        // Support ticket routes
        Route::prefix('support')->name('support.')->group(function () {
            Route::get('/', [Controllers\CustomerSupportController::class, 'index'])->name('index');
            Route::get('/active', [Controllers\CustomerSupportController::class, 'active'])->name('active');
            Route::get('/resolved', [Controllers\CustomerSupportController::class, 'resolved'])->name('resolved');
            Route::get('/closed', [Controllers\CustomerSupportController::class, 'closed'])->name('closed');
            Route::post('/create', [Controllers\CustomerSupportController::class, 'store'])->name('create');
            Route::get('/{ticket:ticket_number}', [Controllers\CustomerSupportController::class, 'show'])->name('show');
            Route::post('/{ticket:ticket_number}/reply', [Controllers\CustomerSupportController::class, 'reply'])->name('reply');
            Route::post('/{ticket:ticket_number}/close', [Controllers\CustomerSupportController::class, 'close'])->name('close');
            Route::post('/{ticket:ticket_number}/reopen', [Controllers\CustomerSupportController::class, 'reopen'])->name('reopen');
            Route::get('/attachments/{message}', [Controllers\CustomerSupportController::class, 'downloadAttachment'])->name('attachment');
        });

        // Settings routes are handled in routes/settings.php
    });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
require __DIR__ . '/dev.php';
