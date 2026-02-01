<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CartItem extends Model
{
    protected $fillable = [
        'user_id',
        'product_id',
        'quantity',
        'price',
    ];

    protected $casts = [
        'quantity' => 'integer',
        'price' => 'decimal:0',
    ];

    /**
     * Get the user that owns the cart item.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the product for this cart item.
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Get the total price for this cart item (price * quantity).
     */
    public function getTotalPriceAttribute(): float
    {
        return $this->price * $this->quantity;
    }

    /**
     * Scope to get cart items for a specific user.
     */
    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Add or update a cart item for a user.
     */

    public static function addOrUpdate(string $userId, int $productId, int $quantity, float $price): self
    {
        $cartItem = static::where('user_id', $userId)
            ->where('product_id', $productId)
            ->first();

        if ($cartItem) {
            // Item exists, increment the quantity
            $cartItem->increment('quantity', $quantity);
            $cartItem->update(['price' => $price]);
            return $cartItem->fresh();
        }

        // Item doesn't exist, create new
        return static::create([
            'user_id' => $userId,
            'product_id' => $productId,
            'quantity' => $quantity,
            'price' => $price,
        ]);
    }

    /**
     * Clear all cart items for a user.
     */
    public static function clearForUser(string $userId): bool
    {
        return static::where('user_id', $userId)->delete();
    }
}
