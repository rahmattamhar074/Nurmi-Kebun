<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class CartController extends Controller
{
    /**
     * Get user's cart items.
     */
    public function index(): JsonResponse
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        // Debug: Log which user is making the request
        Log::info('Cart API called', [
            'user_id' => $user->id,
            'user_email' => $user->email,
            'user_role' => $user->roles->pluck('name')->first(),
        ]);

        $cartItems = CartItem::forUser($user->id)
            ->with(['product.categories'])
            ->get()
            ->map(function ($item) {
                return [
                    'product' => [
                        'id' => $item->product->id,
                        'product_code' => $item->product->product_code,
                        'name' => $item->product->name,
                        'thumbnail' => $item->product->thumbnail,
                        'thumbnail_url' => $item->product->thumbnail_url,
                        'image_urls' => $item->product->image_urls,
                        'description' => $item->product->description,
                        'price' => $item->product->price,
                        'stock' => $item->product->stock,
                        'categories' => $item->product->categories,
                    ],
                    'quantity' => $item->quantity,
                    'price' => $item->price,
                    'created_at' => $item->created_at->toISOString(),
                ];
            });

        // Debug: Log how many items were found
        Log::info('Cart items found', ['count' => $cartItems->count()]);

        return response()->json([
            'cart' => [
                'items' => $cartItems,
            ]
        ]);
    }

    /**
     * Sync cart items from frontend.
     */
    public function sync(Request $request): JsonResponse
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        try {
            $validated = $request->validate([
                'items' => 'required|array',
                'items.*.product_id' => 'required|integer|exists:products,id',
                'items.*.quantity' => 'required|integer|min:1',
                'items.*.price' => 'required|numeric|min:0',
            ]);

            DB::transaction(function () use ($user, $validated) {
                CartItem::clearForUser($user->id);

                foreach ($validated['items'] as $item) {
                    $product = Product::findOrFail($item['product_id']);

                    if ($item['quantity'] > $product->stock) {
                        throw ValidationException::withMessages([
                            'items' => "Product '{$product->name}' has insufficient stock. Available: {$product->stock}, Requested: {$item['quantity']}"
                        ]);
                    }

                    CartItem::create([
                        'user_id' => $user->id,
                        'product_id' => $item['product_id'],
                        'quantity' => $item['quantity'],
                        'price' => $item['price'],
                    ]);
                }
            });

            return response()->json([
                'message' => 'Cart synced successfully',
                'synced_at' => now()->toISOString(),
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to sync cart',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Add single item to cart.
     */
    public function store(Request $request): JsonResponse
    {
        $user = Auth::user();

        \Log::info('Cart store (POST) called', [
            'user_id' => $user?->id,
            'user_email' => $user?->email,
            'request_data' => $request->all(),
        ]);

        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        try {
            $validated = $request->validate([
                'product_id' => 'required|integer|exists:products,id',
                'quantity' => 'required|integer|min:1',
                'price' => 'required|numeric|min:0',
            ]);

            $product = Product::findOrFail($validated['product_id']);

            if ($validated['quantity'] > $product->stock) {
                return response()->json([
                    'message' => 'Insufficient stock',
                    'available_stock' => $product->stock,
                    'requested_quantity' => $validated['quantity'],
                ], 422);
            }

            $cartItem = CartItem::addOrUpdate(
                $user->id,
                $validated['product_id'],
                $validated['quantity'],
                $validated['price']
            );

            \Log::info('Cart item added successfully', [
                'user_id' => $user->id,
                'cart_item_id' => $cartItem->id,
                'product_id' => $validated['product_id'],
            ]);

            return response()->json([
                'message' => 'Item added to cart successfully',
                'cart_item' => $cartItem->load('product'),
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to add item to cart',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update cart item quantity.
     */
    public function update(Request $request, string $productId): JsonResponse
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        try {
            $validated = $request->validate([
                'quantity' => 'required|integer|min:0',
            ]);

            $cartItem = CartItem::forUser($user->id)
                ->where('product_id', $productId)
                ->firstOrFail();

            if ($validated['quantity'] == 0) {
                $cartItem->delete();
                return response()->json(['message' => 'Item removed from cart']);
            }

            if ($validated['quantity'] > $cartItem->product->stock) {
                return response()->json([
                    'message' => 'Insufficient stock',
                    'available_stock' => $cartItem->product->stock,
                    'requested_quantity' => $validated['quantity'],
                ], 422);
            }

            $cartItem->update(['quantity' => $validated['quantity']]);

            return response()->json([
                'message' => 'Cart item updated successfully',
                'cart_item' => $cartItem->fresh()->load('product'),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update cart item',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove item from cart.
     */
    public function destroy(string $productId): JsonResponse
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        try {
            $deleted = CartItem::forUser($user->id)
                ->where('product_id', $productId)
                ->delete();

            if ($deleted) {
                return response()->json(['message' => 'Item removed from cart']);
            }

            return response()->json(['message' => 'Item not found in cart'], 404);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to remove item from cart',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Clear entire cart for user.
     */
    public function clear(): JsonResponse
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        try {
            CartItem::clearForUser($user->id);

            return response()->json(['message' => 'Cart cleared successfully']);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to clear cart',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
