<?php

namespace App\Events;

use App\Models\Order;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class OrderPaid implements ShouldBroadcastNow
{
  use Dispatchable, InteractsWithSockets, SerializesModels;

  public Order $order;

  /**
   * Create a new event instance.
   */
  public function __construct(Order $order)
  {
    $this->order = $order;
  }

  /**
   * Get the channels the event should broadcast on.
   */
  public function broadcastOn(): Channel
  {
    return new Channel('admin-notifications');
  }

  /**
   * The event's broadcast name.
   */
  public function broadcastAs(): string
  {
    return 'order.paid';
  }

  /**
   * Get the data to broadcast.
   */
  public function broadcastWith(): array
  {
    return [
      'order_id' => $this->order->id,
      'order_number' => $this->order->order_number,
      'customer_name' => $this->order->user->name,
      'total' => $this->order->total,
      'payment_uploaded_at' => $this->order->payment_uploaded_at?->toISOString(),
    ];
  }
}
