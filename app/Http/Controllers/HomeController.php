<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class HomeController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $bestSellingProducts = Product::select('products.*')
            ->selectSub(function ($query) {
                $query->selectRaw('COALESCE(SUM(order_items.quantity), 0)')
                    ->from('order_items')
                    ->whereColumn('order_items.product_id', 'products.id');
            }, 'total_sold')
            ->with(['categories', 'reviews'])
            ->orderByDesc('total_sold')
            ->limit(8)
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'product_code' => $product->product_code,
                    'name' => $product->name,
                    'thumbnail_url' => $product->thumbnail_url,
                    'price' => $product->price,
                    'stock' => $product->stock,
                    'category_names' => $product->category_names,
                    'total_sold' => $product->total_sold,
                ];
            });

        return inertia('home/page', [
            'bestSellingProducts' => $bestSellingProducts,
        ]);
    }
}
