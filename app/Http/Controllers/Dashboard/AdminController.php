<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAdminRequest;
use App\Http\Resources\AdminResource;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class AdminController extends Controller
{
  /**
   * Display a listing of admin users.
   */
  public function index(Request $request)
  {
    $validated = $request->validate([
      'search' => 'nullable|string|max:255',
      'sort' => 'nullable|string|in:name,email,created_at',
      'direction' => 'nullable|string|in:asc,desc',
      'per_page' => 'nullable|integer|min:1|max:100'
    ]);

    $search = $validated['search'] ?? null;
    $sort = $validated['sort'] ?? 'created_at';
    $direction = $validated['direction'] ?? 'desc';
    $perPage = $validated['per_page'] ?? 15;

    $query = User::role('administrator')->with('roles');

    if ($search) {
      $query->where(function ($q) use ($search) {
        $q->where('name', 'LIKE', "%{$search}%")
          ->orWhere('email', 'LIKE', "%{$search}%")
          ->orWhere('phone', 'LIKE', "%{$search}%");
      });
    }

    $query->orderBy($sort, $direction);
    $admins = $query->paginate($perPage)->appends($validated);

    return Inertia::render('dashboard/admin-accounts/index', [
      'admins' => AdminResource::collection($admins),
      'filters' => [
        'search' => $search,
        'sort' => $sort,
        'direction' => $direction,
      ]
    ]);
  }

  /**
   * Store a newly created admin user.
   */
  public function store(StoreAdminRequest $request)
  {
    try {
      $validated = $request->validated();

      $user = User::create([
        'name' => $validated['name'],
        'email' => $validated['email'],
        'phone' => $validated['phone'],
        'password' => Hash::make($validated['password']),
      ]);

      $user->assignRole('administrator');

      return redirect()->route('dashboard.admin-accounts.index')->with([
        'flash' => [
          'type' => 'success',
          'message' => 'Admin account created successfully!'
        ]
      ]);
    } catch (\Exception $e) {
      return back()->with([
        'flash' => [
          'type' => 'error',
          'message' => 'Failed to create admin account. Please try again.'
        ]
      ]);
    }
  }

  /**
   * Update the current admin's profile settings (name and optionally password).
   */
  public function updateSettings(Request $request): RedirectResponse
  {
    $user = $request->user();

    // Base validation rules
    $rules = [
      'name' => ['required', 'string', 'max:255'],
    ];

    // Password fields are required if any of them is filled
    $hasPasswordInput = $request->filled('current_password')
      || $request->filled('password')
      || $request->filled('password_confirmation');

    if ($hasPasswordInput) {
      $rules['current_password'] = ['required', 'current_password'];
      $rules['password'] = ['required', Password::defaults(), 'confirmed'];
    }

    $validated = $request->validate($rules, [
      'current_password.current_password' => 'The current password is incorrect.',
    ]);

    // Update name
    $user->name = $validated['name'];

    // Update password if provided
    if ($hasPasswordInput) {
      $user->password = Hash::make($validated['password']);
    }

    $user->save();

    return back()->with([
      'flash' => [
        'type' => 'success',
        'message' => 'Settings updated successfully!'
      ]
    ]);
  }
}
