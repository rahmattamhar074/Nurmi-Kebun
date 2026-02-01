<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class Order extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'order_number',
        'user_id',
        'status',
        'subtotal',
        'shipping_cost',
        'total',
        'payment_method_id',
        'payment_method_name',
        'payment_method_type',
        'payment_account_number',
        'payment_account_holder',
        'payment_receipt',
        'sender_account_name',
        'sender_account_number',
        'payment_amount',
        'payment_date',
        'contact_phone',
        'payment_uploaded_at',
        'payment_verified_at',
        'verified_by',
        'user_address_id',
        'shipping_name',
        'recipient_name',
        'recipient_phone',
        'province_name',
        'city_name',
        'subdistrict_name',
        'postal_code',
        'full_address',
        'tracking_number',
        'shipped_at',
        'completed_at',
        'completion_method',
        'completed_by',
        'customer_notes',
        'admin_notes',
        'cancellation_reason',
        'cancelled_at',
        'cancelled_by',
    ];

    protected $casts = [
        'subtotal' => 'decimal:0',
        'shipping_cost' => 'decimal:0',
        'total' => 'decimal:0',
        'payment_amount' => 'decimal:0',
        'payment_date' => 'datetime',
        'payment_uploaded_at' => 'datetime',
        'payment_verified_at' => 'datetime',
        'shipped_at' => 'datetime',
        'completed_at' => 'datetime',
        'cancelled_at' => 'datetime',
    ];

    protected $appends = ['payment_receipt_url'];

    /**
     * Get the full URL for the payment receipt.
     */
    public function getPaymentReceiptUrlAttribute(): ?string
    {
        if (!$this->payment_receipt) {
            return null;
        }

        return \Storage::url($this->payment_receipt);
    }

    /**
     * Boot the model.
     */
    protected static function booted()
    {
        // Generate order number on creation
        static::creating(function ($order) {
            if (!$order->order_number) {
                $order->order_number = static::generateOrderNumber();
            }
        });

        // Handle stock management on status changes
        static::updated(function ($order) {
            $originalStatus = $order->getOriginal('status');
            $newStatus = $order->status;

            // Deduct stock when payment is verified (moving to processing)
            if ($originalStatus === 'payment_verification' && $newStatus === 'processing') {
                foreach ($order->items as $item) {
                    $item->product->decrement('stock', $item->quantity);
                }
            }

            // Restore stock if order is cancelled (and was in processing or later)
            if ($newStatus === 'cancelled' && in_array($originalStatus, ['processing', 'shipped'])) {
                foreach ($order->items as $item) {
                    $item->product->increment('stock', $item->quantity);
                }
            }
        });
    }

    /**
     * Generate a unique order number.
     */
    public static function generateOrderNumber(): string
    {
        $date = now()->format('Ymd');
        $count = static::whereDate('created_at', today())->count() + 1;
        return sprintf('ORD-%s-%04d', $date, $count);
    }

    /**
     * Get the user that owns the order.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the order items.
     */
    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * Get the payment method.
     */
    public function paymentMethod(): BelongsTo
    {
        return $this->belongsTo(PaymentMethod::class);
    }

    /**
     * Get the user address reference.
     */
    public function userAddress(): BelongsTo
    {
        return $this->belongsTo(UserAddress::class);
    }

    /**
     * Get the admin who verified the payment.
     */
    public function verifiedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    /**
     * Get the admin who completed the order.
     */
    public function completedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'completed_by');
    }

    /**
     * Check if order can be cancelled.
     */
    public function canBeCancelled(): bool
    {
        return in_array($this->status, ['pending_payment', 'payment_verification']);
    }

    /**
     * Check if payment can be uploaded.
     */
    public function canUploadPayment(): bool
    {
        return $this->status === 'pending_payment';
    }

    /**
     * Check if order is awaiting payment verification.
     */
    public function isAwaitingVerification(): bool
    {
        return $this->status === 'payment_verification';
    }

    /**
     * Check if order can be completed.
     */
    public function canBeCompleted(): bool
    {
        return $this->status === 'shipped';
    }

    /**
     * Complete the order.
     */
    public function completeOrder(string $method = 'manual', ?string $completedBy = null): bool
    {
        if (!$this->canBeCompleted()) {
            return false;
        }

        $this->update([
            'status' => 'completed',
            'completed_at' => now(),
            'completion_method' => $method,
            'completed_by' => $completedBy,
        ]);

        return true;
    }

    /**
     * Cancel the order.
     */
    public function cancelOrder(string $reason, string $cancelledBy): bool
    {
        $originalStatus = $this->status;

        // Restore stock if order was in processing or shipped
        if (in_array($originalStatus, ['processing', 'shipped'])) {
            foreach ($this->items as $item) {
                $item->product->increment('stock', $item->quantity);
            }
        }

        $this->update([
            'status' => 'cancelled',
            'cancellation_reason' => $reason,
            'cancelled_at' => now(),
            'cancelled_by' => $cancelledBy,
        ]);

        return true;
    }
}
