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
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->onDelete('cascade');
            $table->foreignId('product_id')->nullable()->constrained()->onDelete('set null'); // Allow deletion, snapshots preserve data

            // Product Snapshot (frozen at time of order)
            $table->string('product_code');
            $table->string('product_name');
            $table->text('product_description')->nullable();
            $table->string('product_thumbnail')->nullable();
            $table->decimal('price', 15, 0); // Price at time of purchase
            $table->integer('quantity');
            $table->decimal('subtotal', 15, 0); // price * quantity

            $table->timestamps();

            // Indexes
            $table->index('order_id');
            $table->index('product_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};
