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
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();

            // Store IDs without foreign key constraints (reviews are independent)
            $table->unsignedBigInteger('order_id');
            $table->unsignedBigInteger('order_item_id');
            $table->uuid('user_id'); // UUID to match users table
            $table->unsignedBigInteger('product_id');

            // Snapshots for display (preserved even if related records are deleted)
            $table->string('order_number');
            $table->string('product_name');
            $table->string('user_name');

            // Review data
            $table->tinyInteger('score')->unsigned(); // 1-5
            $table->text('review')->nullable();

            $table->timestamps();

            // Ensure one review per product per order
            $table->unique(['order_id', 'order_item_id'], 'unique_review_per_order_item');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
