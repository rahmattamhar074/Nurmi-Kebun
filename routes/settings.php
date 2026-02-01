<?php

use App\Http\Controllers\Settings;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'role:customer'])->group(function () {
    Route::redirect('settings', 'settings/profile');

    Route::get('settings/profile', [Settings\ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('settings/profile', [Settings\ProfileController::class, 'update'])->name('profile.update');

    Route::get('settings/password', [Settings\PasswordController::class, 'edit'])->name('password.edit');
    Route::put('settings/password', [Settings\PasswordController::class, 'update'])->name('password.update');

    // Address management
    Route::get('settings/addresses', [Settings\AddressController::class, 'index'])->name('settings.addresses.index');
    Route::get('settings/addresses/create', [Settings\AddressController::class, 'create'])->name('settings.addresses.create');
    Route::post('settings/addresses', [Settings\AddressController::class, 'store'])->name('settings.addresses.store');
    Route::get('settings/addresses/{address}', [Settings\AddressController::class, 'show'])->name('settings.addresses.show');
    Route::get('settings/addresses/{address}/edit', [Settings\AddressController::class, 'edit'])->name('settings.addresses.edit');
    Route::put('settings/addresses/{address}', [Settings\AddressController::class, 'update'])->name('settings.addresses.update');
    Route::delete('settings/addresses/{address}', [Settings\AddressController::class, 'destroy'])->name('settings.addresses.destroy');
    Route::patch('settings/addresses/{address}/set-default', [Settings\AddressController::class, 'setDefault'])->name('settings.addresses.set-default');

    // AJAX endpoints for location data
    Route::get('api/provinces', [Settings\AddressController::class, 'getProvinces'])->name('api.provinces');
    Route::get('api/cities', [Settings\AddressController::class, 'getCities'])->name('api.cities');
    Route::get('api/subdistricts', [Settings\AddressController::class, 'getSubdistricts'])->name('api.subdistricts');

    Route::get('settings/appearance', Settings\AppearanceController::class)->name('settings.appearance');
    Route::get('settings/delete-account', [Settings\DeleteAccountController::class, 'index'])->name('settings.delete-account');
    Route::delete('settings/delete-account', [Settings\DeleteAccountController::class, 'destroy'])->name('settings.delete-account');
});
