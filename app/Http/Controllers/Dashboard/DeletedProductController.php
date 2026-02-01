<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DeletedProductController extends Controller
{
  /**
   * Display a listing of soft-deleted products.
   */
  public function index(Request $request)
  {
    $query = Product::onlyTrashed()
      ->with('categories');

    // Search functionality
    if ($request->has('search') && $request->search) {
      $search = $request->search;
      $query->where(function ($q) use ($search) {
        $q->where('name', 'like', "%{$search}%")
          ->orWhere('product_code', 'like', "%{$search}%");
      });
    }

    // Category filter
    if ($request->has('category') && $request->category !== 'all') {
      $query->whereHas('categories', function ($q) use ($request) {
        $q->where('product_category_id', $request->category);
      });
    }

    // Stock status filter
    if ($request->has('stock_status') && $request->stock_status !== 'all') {
      switch ($request->stock_status) {
        case 'in_stock':
          $query->where('stock', '>', 0);
          break;
        case 'out_of_stock':
          $query->where('stock', '=', 0);
          break;
      }
    }

    $products = $query->latest('deleted_at')->paginate(10);

    // Get all categories for filtering
    $categories = \App\Models\ProductCategory::all();

    return Inertia::render('dashboard/product/deleted/page', [
      'products' => $products,
      'categories' => $categories,
      'filters' => [
        'search' => $request->search,
        'category' => $request->category,
        'stock_status' => $request->stock_status,
      ],
    ]);
  }

  /**
   * Restore a soft-deleted product.
   */
  public function restore($id)
  {
    $product = Product::onlyTrashed()->findOrFail($id);
    $product->restore();

    return redirect()->back()->with('success', 'Product restored successfully.');
  }
}
