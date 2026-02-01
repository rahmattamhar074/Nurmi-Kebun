<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number')->unique(); // ORD-20251126-0001
            $table->foreignUuid('user_id')->constrained()->onDelete('cascade');

            // Order Status
            $table->enum('status', [
                'pending_payment',      // Waiting for payment upload
                'payment_verification', // Payment uploaded, pending admin verification
                'processing',           // Payment verified, order being prepared
                'shipped',              // Order shipped
                'completed',            // Transaction complete
                'cancelled',            // Order cancelled
            ])->default('pending_payment');

            // Pricing (simplified - no tax)
            $table->decimal('subtotal', 15, 0); // Sum of all items
            $table->decimal('shipping_cost', 15, 0)->default(10000);
            $table->decimal('total', 15, 0); // subtotal + shipping_cost

            // Payment Method Snapshot
            $table->foreignId('payment_method_id')->nullable()->constrained('payment_methods')->onDelete('set null');
            $table->string('payment_method_name'); // e.g., "BCA - John Doe"
            $table->string('payment_method_type'); // bank, e_wallet
            $table->string('payment_account_number')->nullable(); // Merchant's account
            $table->string('payment_account_holder')->nullable(); // Merchant's name

            // Payment Proof Information (from customer)
            $table->string('payment_receipt')->nullable(); // Uploaded file path
            $table->string('sender_account_name')->nullable(); // Customer's account name
            $table->string('sender_account_number')->nullable(); // Customer's account number
            $table->decimal('payment_amount', 15, 0)->nullable(); // Amount customer claims
            $table->timestamp('payment_date')->nullable(); // When customer paid
            $table->string('contact_phone')->nullable(); // Contact for payment issues
            $table->timestamp('payment_uploaded_at')->nullable();
            $table->timestamp('payment_verified_at')->nullable();
            $table->uuid('verified_by')->nullable(); // Admin user UUID

            // Shipping Address Snapshot
            $table->foreignUuid('user_address_id')->nullable()->constrained('user_addresses')->onDelete('set null'); // Reference
            $table->string('shipping_name'); // Address label (e.g., "Home")
            $table->string('recipient_name');
            $table->string('recipient_phone');
            $table->string('province_name');
            $table->string('city_name');
            $table->string('subdistrict_name')->nullable();
            $table->string('postal_code');
            $table->text('full_address');

            // Shipping Information
            $table->string('tracking_number')->nullable();
            $table->timestamp('shipped_at')->nullable();

            // Notes
            $table->text('customer_notes')->nullable();
            $table->text('admin_notes')->nullable();
            $table->text('cancellation_reason')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->enum('cancelled_by', ['customer', 'admin', 'system'])->nullable();

            $table->timestamps();
            $table->softDeletes();

            // Indexes
            $table->index('user_id');
            $table->index('status');
            $table->index('order_number');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
