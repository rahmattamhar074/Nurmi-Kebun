<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductCategory;
use App\Http\Requests\UpdateProductRequest;
use App\Services\ProductService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    protected ProductService $productService;

    public function __construct(ProductService $productService)
    {
        $this->productService = $productService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $validated = $request->validate([
            'search' => 'nullable|string|max:255',
            'category' => 'nullable|integer|exists:product_categories,id',
            'stock_status' => 'nullable|string|in:in_stock,low_stock,out_of_stock',
            'sort' => 'nullable|string|in:id,name,price,stock,created_at',
            'direction' => 'nullable|string|in:asc,desc',
            'per_page' => 'nullable|integer|min:1|max:100'
        ]);

        $search = $validated['search'] ?? null;
        $categoryId = $validated['category'] ?? null;
        $stockStatus = $validated['stock_status'] ?? null;
        $sort = $validated['sort'] ?? 'created_at';
        $direction = $validated['direction'] ?? 'desc';
        $perPage = $validated['per_page'] ?? 15;

        $query = Product::with('categories');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                    ->orWhere('description', 'LIKE', "%{$search}%");
            });
        }

        if ($categoryId) {
            $query->whereHas('categories', function ($q) use ($categoryId) {
                $q->where('product_categories.id', $categoryId);
            });
        }


        if ($stockStatus) {
            switch ($stockStatus) {
                case 'in_stock':
                    $query->where('stock', '>', 10);
                    break;
                case 'low_stock':
                    $query->whereBetween('stock', [1, 10]);
                    break;
                case 'out_of_stock':
                    $query->where('stock', '=', 0);
                    break;
            }
        }


        $query->orderBy($sort, $direction);
        $products = $query->paginate($perPage)->appends($validated);

        // Add image URLs to products
        $products->getCollection()->transform(function ($product) {
            $product->thumbnail_url = $product->thumbnail_url;
            $product->image_urls = $product->image_urls;
            return $product;
        });

        $categories = ProductCategory::orderBy('name')->get();
        return Inertia::render('dashboard/product/index', [
            'products' => $products,
            'categories' => $categories,
            'filters' => [
                'search' => $search,
                'category' => $categoryId,
                'stock_status' => $stockStatus,
                'sort' => $sort,
                'direction' => $direction,
            ]
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $categories = ProductCategory::orderBy('name')->get();

        return response()->json([
            'message' => 'Create product form data',
            'data' => [
                'categories' => $categories
            ],
            'route_info' => [
                'current_route' => request()->route()->getName(),
                'method' => request()->method(),
            ]
        ], 200, [], JSON_PRETTY_PRINT);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'product_code' => 'required|string|max:50|unique:products,product_code',
                'name' => 'required|string|max:255',
                'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                'images' => 'nullable|array',
                'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
                'description' => 'nullable|string|max:1000',
                'price' => 'required|numeric|min:0|max:99999999.99',
                'stock' => 'required|integer|min:0|max:999999',
                'weight' => 'required|integer|min:1',
                'notes' => 'nullable|string',
                'category_ids' => 'required|array|min:1',
                'category_ids.*' => 'exists:product_categories,id',
            ], [
                'thumbnail.uploaded' => 'The thumbnail failed to upload. The file size may exceed the server limit (2MB).',
                'images.*.uploaded' => 'One of the images failed to upload. The file size may exceed the server limit (2MB).',
            ]);

            $product = $this->productService->createProduct($validated);

            return redirect()->route('products.index')->with([
                'flash' => [
                    'type' => 'success',
                    'message' => 'Product created successfully!'
                ]
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            throw $e;
        } catch (\Exception $e) {
            return back()->with([
                'flash' => [
                    'type' => 'error',
                    'message' => 'Failed to create product. Please try again.'
                ]
            ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        $product->load('categories');

        return response()->json([
            'message' => 'Product retrieved successfully',
            'data' => $product,
            'route_info' => [
                'current_route' => request()->route()->getName(),
                'method' => request()->method(),
            ]
        ], 200, [], JSON_PRETTY_PRINT);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        $categories = ProductCategory::orderBy('name')->get();
        $product->load('categories');

        return response()->json([
            'message' => 'Edit product form data',
            'data' => [
                'product' => $product,
                'categories' => $categories,
                'selected_category_ids' => $product->categories->pluck('id')->toArray()
            ],
            'route_info' => [
                'current_route' => request()->route()->getName(),
                'method' => request()->method(),
            ]
        ], 200, [], JSON_PRETTY_PRINT);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        try {
            $validated = $request->validate([
                'product_code' => 'required|string|max:50|unique:products,product_code,' . $product->id,
                'name' => 'required|string|max:255',
                'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                'images' => 'nullable|array',
                'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
                'removed_images' => 'nullable|array',
                'removed_images.*' => 'string',
                'description' => 'nullable|string|max:1000',
                'price' => 'required|numeric|min:0|max:99999999.99',
                'stock' => 'required|integer|min:0|max:999999',
                'weight' => 'required|integer|min:1',
                'notes' => 'nullable|string',
                'category_ids' => 'required|array|min:1',
                'category_ids.*' => 'exists:product_categories,id',
            ], [
                'thumbnail.uploaded' => 'The thumbnail failed to upload. The file size may exceed the server limit (2MB).',
                'images.*.uploaded' => 'One of the images failed to upload. The file size may exceed the server limit (2MB).',
            ]);

            $product = $this->productService->updateProduct($product, $validated);

            return redirect()->route('products.index')->with([
                'flash' => [
                    'type' => 'success',
                    'message' => 'Product updated successfully!'
                ]
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            throw $e;
        } catch (\Exception $e) {
            return back()->with([
                'flash' => [
                    'type' => 'error',
                    'message' => 'Failed to update product. Please try again.'
                ]
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        try {
            $this->productService->deleteProduct($product);

            return redirect()->route('products.index')->with([
                'flash' => [
                    'type' => 'success',
                    'message' => 'Product deleted successfully!'
                ]
            ]);
        } catch (\Exception $e) {
            return back()->with([
                'flash' => [
                    'type' => 'error',
                    'message' => 'Failed to delete product. Please try again.'
                ]
            ]);
        }
    }

    /**
     * Get reviews for a specific product (API endpoint for lazy loading)
     */
    public function getReviews(Product $product)
    {
        $reviews = \App\Models\Review::where('product_id', $product->id)
            ->with('user')
            ->latest()
            ->limit(5)
            ->get();

        // Calculate average rating
        $averageRating = $reviews->avg('score');
        $reviewCount = $reviews->count();

        return response()->json([
            'reviews' => $reviews,
            'average_rating' => $averageRating ? round($averageRating, 1) : 0,
            'review_count' => $reviewCount,
        ]);
    }
}
