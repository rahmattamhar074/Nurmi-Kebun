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
        Schema::create('support_tickets', function (Blueprint $table) {
            $table->id();
            $table->string('ticket_number')->unique();
            $table->foreignUuid('user_id')->constrained()->onDelete('cascade');
            $table->string('order_id')->nullable(); // Changed to string to allow any order number
            $table->string('subject');
            $table->enum('status', ['active', 'resolved', 'closed'])->default('active');
            $table->timestamp('last_reply_at')->nullable();
            $table->enum('last_reply_by', ['customer', 'admin'])->nullable();
            $table->timestamp('resolved_at')->nullable();
            $table->foreignUuid('resolved_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();
            $table->softDeletes();

            // Indexes for performance
            $table->index('user_id');
            $table->index('status');
            $table->index('last_reply_at');
            $table->index(['status', 'last_reply_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('support_tickets');
    }
};
