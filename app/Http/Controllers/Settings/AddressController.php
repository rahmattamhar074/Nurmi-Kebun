<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\City;
use App\Models\Province;
use App\Models\Subdistrict;
use App\Models\UserAddress;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class AddressController extends Controller
{

  /**
   * Display a listing of user addresses.
   */
  public function index()
  {
    /** @var User $user */
    $user = Auth::user();
    $addresses = $user->addresses()
      ->orderBy('is_default', 'desc')
      ->orderBy('created_at', 'desc')
      ->get();

    return Inertia::render('settings/addresses/index', [
      'addresses' => $addresses,
    ]);
  }

  /**
   * Show the form for creating a new address.
   */
  public function create()
  {
    return Inertia::render('settings/addresses/create');
  }

  /**
   * Store a newly created address in storage.
   */
  public function store(Request $request)
  {
    try {
      $addressCount = Auth::user()->addresses()->count();
      if ($addressCount >= 3) {
        return back()->with([
          'type' => 'error',
          'message' => 'You can only have up to 3 addresses.'
        ]);
      }

      $validated = $request->validate([
        'name' => 'required|string|max:255',
        'recipient_name' => 'required|string|max:255',
        'phone' => 'required|string|max:20',
        'province_id' => 'required|integer',
        'province_name' => 'required|string|max:255',
        'city_id' => 'required|integer',
        'city_name' => 'required|string|max:255',
        'subdistrict_id' => 'nullable|integer',
        'subdistrict_name' => 'nullable|string|max:255',
        'postal_code' => 'required|string|max:10',
        'full_address' => 'required|string|max:1000',
      ]);

      $isFirstAddress = $addressCount === 0;

      $address = UserAddress::create(array_merge($validated, [
        'user_id' => Auth::id(),
      ]));

      if ($isFirstAddress) {
        $address->setAsDefault();
      }

      return back()->with([
        'type' => 'success',
        'message' => 'Address created successfully!'
      ]);
    } catch (ValidationException $e) {
      throw $e;
    } catch (\Exception $e) {
      Log::error('Failed to create address', [
        'error' => $e->getMessage(),
        'trace' => $e->getTraceAsString(),
        'user_id' => Auth::id(),
      ]);

      return back()->with([
        'type' => 'error',
        'message' => 'Failed to create address. Please try again.'
      ]);
    }
  }

  /**
   * Show the form for editing the specified address.
   */
  public function edit(UserAddress $address)
  {
    if ($address->user_id !== Auth::id()) {
      abort(403);
    }

    return Inertia::render('settings/addresses/edit', [
      'address' => $address,
    ]);
  }

  /**
   * Get a single address for editing (AJAX endpoint).
   */
  public function show(UserAddress $address)
  {
    if ($address->user_id !== Auth::id()) {
      abort(403);
    }

    return response()->json([
      'success' => true,
      'address' => $address
    ]);
  }

  /**
   * Update the specified address in storage.
   */
  public function update(Request $request, UserAddress $address)
  {
    if ($address->user_id !== Auth::id()) {
      abort(403);
    }

    try {
      $validated = $request->validate([
        'name' => 'required|string|max:255',
        'recipient_name' => 'required|string|max:255',
        'phone' => 'required|string|max:20',
        'province_id' => 'required|integer',
        'province_name' => 'required|string|max:255',
        'city_id' => 'required|integer',
        'city_name' => 'required|string|max:255',
        'subdistrict_id' => 'nullable|integer',
        'subdistrict_name' => 'nullable|string|max:255',
        'postal_code' => 'required|string|max:10',
        'full_address' => 'required|string|max:1000',
      ]);

      $address->update($validated);

      return redirect()->route('settings.addresses.index')->with([
        'type' => 'success',
        'message' => 'Address updated successfully!'
      ]);
    } catch (ValidationException $e) {
      throw $e;
    } catch (\Exception $e) {
      Log::error('Failed to update address', [
        'error' => $e->getMessage(),
        'trace' => $e->getTraceAsString(),
        'user_id' => Auth::id(),
        'address_id' => $address->id,
      ]);

      return back()->with([
        'type' => 'error',
        'message' => 'Failed to update address. Please try again.'
      ]);
    }
  }

  /**
   * Remove the specified address from storage.
   */
  public function destroy(UserAddress $address)
  {
    if ($address->user_id !== Auth::id()) {
      abort(403);
    }

    try {
      $address->delete();

      return redirect()->back()->with([
        'type' => 'success',
        'message' => 'Address deleted successfully!'
      ]);
    } catch (\Exception $e) {
      return back()->with([
        'type' => 'error',
        'message' => 'Failed to delete address. Please try again.'
      ]);
    }
  }

  /**
   * Set address as default.
   */
  public function setDefault(UserAddress $address)
  {
    if ($address->user_id !== Auth::id()) {
      abort(403);
    }

    try {
      $address->setAsDefault();

      return redirect()->back()->with([
        'type' => 'success',
        'message' => 'Default address updated successfully!'
      ]);
    } catch (\Exception $e) {
      return back()->with([
        'type' => 'error',
        'message' => 'Failed to set default address. Please try again.'
      ]);
    }
  }

  /**
   * Get provinces from database
   */
  public function getProvinces(Request $request)
  {
    try {
      $provinces = Province::orderBy('name')->get();
      return response()->json($provinces);
    } catch (\Exception $e) {
      return response()->json(['error' => 'Failed to fetch provinces'], 500);
    }
  }

  /**
   * Get cities by province from database
   */
  public function getCities(Request $request)
  {
    try {
      $provinceId = $request->get('province_id');
      $cities = City::where('province_id', $provinceId)
        ->orderBy('type')
        ->orderBy('name')
        ->get();
      return response()->json($cities);
    } catch (\Exception $e) {
      return response()->json(['error' => 'Failed to fetch cities'], 500);
    }
  }

  /**
   * Get subdistricts by city from database
   */
  public function getSubdistricts(Request $request)
  {
    try {
      $cityId = $request->get('city_id');
      $subdistricts = Subdistrict::where('city_id', $cityId)
        ->orderBy('name')
        ->get();
      return response()->json($subdistricts);
    } catch (\Exception $e) {
      return response()->json(['error' => 'Failed to fetch subdistricts'], 500);
    }
  }
}
