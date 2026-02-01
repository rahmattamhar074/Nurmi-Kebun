<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Http\Resources\ReviewResource;
use App\Models\Review;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReviewController extends Controller
{
    /**
     * Display a listing of reviews.
     */
    public function index(Request $request)
    {
        $validated = $request->validate([
            'search' => 'nullable|string|max:255',
            'score' => 'nullable|integer|min:1|max:5',
            'per_page' => 'nullable|integer|min:1|max:100'
        ]);

        $search = $validated['search'] ?? null;
        $scoreFilter = $validated['score'] ?? null;
        $perPage = $validated['per_page'] ?? 15;

        $query = Review::with(['user', 'product', 'order']);

        // Search by order number
        if ($search) {
            $query->where('order_number', 'LIKE', "%{$search}%");
        }

        // Filter by score
        if ($scoreFilter) {
            $query->where('score', $scoreFilter);
        }

        // Order by most recent first
        $query->orderBy('created_at', 'desc');

        $reviews = $query->paginate($perPage)->appends($validated);

        return Inertia::render('dashboard/reviews/index', [
            'reviews' => ReviewResource::collection($reviews),
            'filters' => [
                'search' => $search,
                'score' => $scoreFilter,
            ]
        ]);
    }
}
