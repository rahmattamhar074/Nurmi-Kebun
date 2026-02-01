<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Review extends Model
{
    protected $fillable = [
        'order_id',
        'order_item_id',
        'user_id',
        'product_id',
        'order_number',
        'product_name',
        'user_name',
        'score',
        'review',
    ];

    protected $casts = [
        'score' => 'integer',
    ];

    /**
     * Get the order that owns the review (may be null if deleted).
     */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class)->withDefault();
    }

    /**
     * Get the order item that owns the review (may be null if deleted).
     */
    public function orderItem(): BelongsTo
    {
        return $this->belongsTo(OrderItem::class)->withDefault();
    }

    /**
     * Get the user that wrote the review (may be null if deleted).
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class)->withDefault();
    }

    /**
     * Get the product that was reviewed (may be null if deleted).
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class)->withDefault();
    }
}
