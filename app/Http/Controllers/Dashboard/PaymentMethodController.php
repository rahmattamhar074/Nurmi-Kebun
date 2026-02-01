<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\PaymentMethod;
use App\Services\PaymentMethodService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaymentMethodController extends Controller
{
    protected $paymentMethodService;

    public function __construct(PaymentMethodService $paymentMethodService)
    {
        $this->paymentMethodService = $paymentMethodService;
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $paymentMethods = PaymentMethod::ordered()->paginate(10);

        return Inertia::render('dashboard/payment-method/index', [
            'paymentMethods' => $paymentMethods,
        ]);
    }



    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, PaymentMethod $paymentMethod)
    {
        try {
            $validated = $request->validate([
                'account_number' => 'required|string|max:255',
                'account_holder_name' => 'required|string|max:255',
            ]);

            $paymentMethod->update($validated);

            return redirect()->route('dashboard.payment-methods.index')->with([
                'flash' => [
                    'type' => 'success',
                    'message' => 'Payment method updated successfully!'
                ]
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            throw $e;
        } catch (\Exception $e) {
            return back()->with([
                'flash' => [
                    'type' => 'error',
                    'message' => 'Failed to update payment method. Please try again.'
                ]
            ]);
        }
    }



    /**
     * Toggle active status of payment method.
     */
    public function toggleStatus(PaymentMethod $paymentMethod)
    {
        $paymentMethod->update([
            'is_active' => !$paymentMethod->is_active
        ]);

        $status = $paymentMethod->is_active ? 'activated' : 'deactivated';

        return redirect()->route('dashboard.payment-methods.index')
            ->with('flash', [
                'type' => 'success',
                'message' => "Payment method {$status} successfully.",
            ]);
    }
}
