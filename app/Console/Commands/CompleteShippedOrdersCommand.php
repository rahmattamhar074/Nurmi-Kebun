<?php

namespace App\Console\Commands;

use App\Models\Order;
use Illuminate\Console\Command;

class CompleteShippedOrdersCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'complete:shipped-orders';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Automatically complete orders that have been shipped for 7 or more days';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $sevenDaysAgo = now()->subDays(7);

        // Find all shipped orders that are 7+ days old
        $orders = Order::query()
            ->where('status', 'shipped')
            ->where('shipped_at', '<=', $sevenDaysAgo)
            ->get();

        $completedCount = 0;

        foreach ($orders as $order) {
            if ($order->completeOrder('auto')) {
                $completedCount++;
            }
        }

        $this->info("Completed {$completedCount} order(s) automatically.");

        return Command::SUCCESS;
    }
}
