<?php

namespace App\Console\Commands;

use App\Models\Order;
use Illuminate\Console\Command;

class CancelExpiredOrdersCommand extends Command
{
  /**
   * The name and signature of the console command.
   *
   * @var string
   */
  protected $signature = 'cancel:expired-orders';

  /**
   * The console command description.
   *
   * @var string
   */
  protected $description = 'Automatically cancel orders that have been unpaid or unverified for too long';

  /**
   * Execute the console command.
   */
  public function handle()
  {
    $sevenDaysAgo = now()->subDays(7);
    $fourteenDaysAgo = now()->subDays(14);

    // Find unpaid orders older than 7 days
    $unpaidOrders = Order::query()
      ->where('status', 'pending_payment')
      ->where('created_at', '<=', $sevenDaysAgo)
      ->get();

    // Find unverified payment orders older than 14 days
    $unverifiedOrders = Order::query()
      ->where('status', 'payment_verification')
      ->where('payment_uploaded_at', '<=', $fourteenDaysAgo)
      ->get();

    $cancelledCount = 0;

    // Cancel unpaid orders
    foreach ($unpaidOrders as $order) {
      $order->cancelOrder(
        'Automatically cancelled - No payment received after 7 days',
        'system'
      );
      $cancelledCount++;
    }

    // Cancel unverified orders
    foreach ($unverifiedOrders as $order) {
      $order->cancelOrder(
        'Automatically cancelled - Payment not verified after 14 days',
        'system'
      );
      $cancelledCount++;
    }

    $this->info("Cancelled {$cancelledCount} expired order(s) automatically.");

    return Command::SUCCESS;
  }
}
