<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StoreController extends Controller
{
    /**
     * Display the store page with products
     */
    public function __invoke(Request $request): Response
    {
        $validated = $request->validate([
            'search' => 'nullable|string|max:255',
            'category' => 'nullable|integer|exists:product_categories,id',
            'sort' => 'nullable|string|in:name,price,created_at',
            'direction' => 'nullable|string|in:asc,desc',
            'per_page' => 'nullable|integer|min:8|max:48'
        ]);

        $search = $validated['search'] ?? null;
        $categoryId = $validated['category'] ?? null;
        $sort = $validated['sort'] ?? 'created_at';
        $direction = $validated['direction'] ?? 'desc';
        $perPage = $validated['per_page'] ?? 8;

        $query = Product::with('categories')
            ->withCount('reviews')
            ->withAvg('reviews', 'score')
            ->where('stock', '>', 0);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                    ->orWhere('description', 'LIKE', "%{$search}%")
                    ->orWhere('product_code', 'LIKE', "%{$search}%");
            });
        }

        if ($categoryId) {
            $query->whereHas('categories', function ($q) use ($categoryId) {
                $q->where('product_categories.id', $categoryId);
            });
        }

        $query->orderBy($sort, $direction);
        $products = $query->paginate($perPage)->appends($validated);

        $products->getCollection()->transform(function ($product) {
            $product->thumbnail_url = $product->thumbnail_url;
            $product->image_urls = $product->image_urls;
            return $product;
        });

        $categories = ProductCategory::orderBy('name')->get();

        return Inertia::render('store/index', [
            'products' => $products,
            'categories' => $categories,
            'filters' => [
                'search' => $search,
                'category' => $categoryId,
                'sort' => $sort,
                'direction' => $direction,
                'per_page' => $perPage,
            ]
        ]);
    }
}
