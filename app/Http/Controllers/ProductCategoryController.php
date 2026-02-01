<?php

namespace App\Http\Controllers;

use App\Models\ProductCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductCategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $validated = $request->validate([
            'search' => 'nullable|string|max:255',
            'sort' => 'nullable|string|in:id,name,description,products_count,created_at',
            'direction' => 'nullable|string|in:asc,desc',
            'per_page' => 'nullable|integer|min:1|max:100'
        ]);

        $search = $validated['search'] ?? null;
        $sort = $validated['sort'] ?? 'created_at';
        $direction = $validated['direction'] ?? 'desc';
        $perPage = $validated['per_page'] ?? 10;

        $query = ProductCategory::withCount('products');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                    ->orWhere('description', 'LIKE', "%{$search}%");
            });
        }
        $query->orderBy($sort, $direction);
        $categories = $query->paginate($perPage)->appends($validated);

        return Inertia::render('dashboard/product-category/index', [
            'categories' => $categories,
            'filters' => [
                'search' => $search,
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
        return response()->json([
            'message' => 'Create category form',
            'data' => [
                'form_fields' => [
                    'name' => 'required|string|max:255|unique',
                    'description' => 'nullable|string'
                ]
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
                'name' => 'required|string|max:255|unique:product_categories,name',
                'description' => 'nullable|string',
            ]);

            $category = ProductCategory::create($validated);

            return redirect()->route('categories.index')->with('flash', [
                'type' => 'success',
                'message' => 'Category created successfully!'
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            throw $e;
        } catch (\Exception $e) {
            return redirect()->route('categories.index')->with('flash', [
                'type' => 'error',
                'message' => 'Failed to create category. Please try again.'
            ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(ProductCategory $productCategory)
    {
        $productCategory->load('products');
        return response()->json([
            'message' => 'Category retrieved successfully',
            'data' => $productCategory,
            'route_info' => [
                'current_route' => request()->route()->getName(),
                'method' => request()->method(),
            ]
        ], 200, [], JSON_PRETTY_PRINT);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ProductCategory $productCategory)
    {
        dd(['category' => $productCategory, 'message' => 'Edit category form']);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ProductCategory $productCategory)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255|unique:product_categories,name,' . $productCategory->id,
                'description' => 'nullable|string',
            ]);

            $productCategory->update($validated);

            return redirect()->route('categories.index')->with('flash', [
                'type' => 'success',
                'message' => 'Category updated successfully!'
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            throw $e;
        } catch (\Exception $e) {
            return redirect()->route('categories.index')->with('flash', [
                'type' => 'error',
                'message' => 'Failed to update category. Please try again.'
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ProductCategory $productCategory)
    {
        try {

            if ($productCategory->products()->count() > 0) {
                return redirect()->route('categories.index')->with('flash', [
                    'type' => 'error',
                    'message' => 'Cannot delete category that contains products. Please move or delete the products first.'
                ]);
            }

            $productCategory->delete();

            return redirect()->route('categories.index')->with('flash', [
                'type' => 'success',
                'message' => 'Category deleted successfully!'
            ]);
        } catch (\Exception $e) {
            return redirect()->route('categories.index')->with('flash', [
                'type' => 'error',
                'message' => 'Failed to delete category. Please try again.'
            ]);
        }
    }
}
