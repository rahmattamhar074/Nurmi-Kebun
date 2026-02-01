<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        // Get today's date range
        $today = Carbon::today();
        $todayEnd = Carbon::tomorrow();

        // 1. Statistics (Daily - Today's data)
        $statistics = [
            'orders_today' => Order::whereBetween('created_at', [$today, $todayEnd])->count(),
            'total_products' => Product::count(),
            'total_customers' => User::role('customer')->count(),
            'revenue_today' => Order::whereBetween('created_at', [$today, $todayEnd])
                ->whereNotIn('status', ['cancelled'])
                ->sum('total'),
        ];

        // 2. Chart Data (Weekly - Last 7 days including today)
        $chartData = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::today()->subDays($i);
            $nextDate = Carbon::today()->subDays($i - 1);

            $ordersCount = Order::whereBetween('created_at', [$date, $nextDate])->count();
            $revenue = Order::whereBetween('created_at', [$date, $nextDate])
                ->whereNotIn('status', ['cancelled'])
                ->sum('total');

            $chartData[] = [
                'date' => $date->format('M d'),
                'orders' => $ordersCount,
                'revenue' => (float) $revenue,
            ];
        }

        // 3. Pending Orders Summary (All-time - excluding completed and cancelled)
        $pendingOrders = [
            [
                'status' => 'pending_payment',
                'label' => 'Pending Payment',
                'count' => Order::where('status', 'pending_payment')->count(),
            ],
            [
                'status' => 'payment_verification',
                'label' => 'Awaiting Confirmation',
                'count' => Order::where('status', 'payment_verification')->count(),
            ],
            [
                'status' => 'processing',
                'label' => 'Processing',
                'count' => Order::where('status', 'processing')->count(),
            ],
            [
                'status' => 'shipped',
                'label' => 'Shipped',
                'count' => Order::where('status', 'shipped')->count(),
            ],
        ];

        // 4. Top Selling Products (All-time - Top 5 by units sold)
        $topProducts = DB::table('order_items')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->leftJoin('reviews', 'products.id', '=', 'reviews.product_id')
            ->select(
                'products.id as product_id',
                'products.name as product_name',
                DB::raw('SUM(order_items.quantity) as units_sold'),
                DB::raw('SUM(order_items.subtotal) as revenue'),
                DB::raw('COALESCE(AVG(reviews.score), 0) as average_rating')
            )
            ->groupBy('products.id', 'products.name')
            ->orderByDesc('units_sold')
            ->limit(4)
            ->get()
            ->map(function ($item) {
                return [
                    'product_id' => $item->product_id,
                    'product_name' => $item->product_name,
                    'units_sold' => (int) $item->units_sold,
                    'revenue' => (float) $item->revenue,
                    'average_rating' => round((float) $item->average_rating, 1),
                ];
            });

        return inertia('dashboard/home/page', [
            'statistics' => $statistics,
            'chartData' => $chartData,
            'pendingOrders' => $pendingOrders,
            'topProducts' => $topProducts,
        ]);
    }
}
