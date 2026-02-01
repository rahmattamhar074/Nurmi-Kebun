<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SettingsController extends Controller
{
    /**
     * Display the profile settings page.
     */
    public function profile(Request $request): Response
    {
        return Inertia::render('settings/profile', [
            'user' => $request->user()->only(['id', 'name', 'email', 'email_verified_at']),
        ]);
    }

    /**
     * Display the password change page.
     */
    public function password(): Response
    {
        return Inertia::render('settings/password');
    }

    /**
     * Display the appearance settings page.
     */
    public function appearance(): Response
    {
        return Inertia::render('settings/appearance');
    }

    /**
     * Display the delete account (danger zone) page.
     */
    public function deleteAccount(Request $request): Response
    {
        return Inertia::render('settings/delete-account', [
            'user' => $request->user()->only(['id', 'name', 'email']),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function updateProfile(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $request->user()->id,
        ]);

        $request->user()->fill($validated);

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return redirect()->route('settings.profile')->with([
            'flash' => [
                'type' => 'success',
                'message' => 'Profile updated successfully!'
            ]
        ]);
    }

    /**
     * Update the user's password.
     */
    public function updatePassword(Request $request)
    {
        $validated = $request->validate([
            'current_password' => 'required|current_password',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $request->user()->update([
            'password' => bcrypt($validated['password']),
        ]);

        return redirect()->route('settings.password')->with([
            'flash' => [
                'type' => 'success',
                'message' => 'Password updated successfully!'
            ]
        ]);
    }
}
