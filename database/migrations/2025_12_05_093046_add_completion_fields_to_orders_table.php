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
        Schema::table('orders', function (Blueprint $table) {
            $table->timestamp('completed_at')->nullable()->after('shipped_at');
            $table->enum('completion_method', ['manual', 'auto'])->nullable()->after('completed_at');
            $table->uuid('completed_by')->nullable()->after('completion_method'); // Admin user UUID
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['completed_at', 'completion_method', 'completed_by']);
        });
    }
};
