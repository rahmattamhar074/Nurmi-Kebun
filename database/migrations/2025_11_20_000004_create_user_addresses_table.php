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
    Schema::create('user_addresses', function (Blueprint $table) {
      $table->uuid('id')->primary();
      $table->foreignUuid('user_id')->constrained()->onDelete('cascade');

      // Address identification
      $table->string('name'); // Address label (e.g., "Home", "Office")
      $table->string('recipient_name');
      $table->string('phone', 20);

      // Location data (Linked to local RajaOngkir tables)
      $table->unsignedInteger('province_id');
      $table->string('province_name');
      $table->unsignedInteger('city_id');
      $table->string('city_name');
      $table->unsignedBigInteger('subdistrict_id')->nullable();
      $table->string('subdistrict_name')->nullable();

      // Address details
      $table->string('postal_code', 10);
      $table->text('full_address');

      // Address management
      $table->boolean('is_default')->default(false);
      $table->boolean('is_active')->default(true);

      $table->timestamps();

      // Indexes for performance
      $table->index(['user_id', 'is_default']);
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('user_addresses');
  }
};
