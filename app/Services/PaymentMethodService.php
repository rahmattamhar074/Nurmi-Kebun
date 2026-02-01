<?php

namespace App\Services;

use App\Models\PaymentMethod;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class PaymentMethodService
{


  /**
   * Update an existing payment method.
   *
   * @param PaymentMethod $paymentMethod
   * @param array $data
   * @return PaymentMethod
   * @throws \Exception
   */
  public function updatePaymentMethod(PaymentMethod $paymentMethod, array $data): PaymentMethod
  {
    try {
      $paymentMethod->update([
        'account_number' => $data['account_number'],
        'account_holder_name' => $data['account_holder_name'],
      ]);

      Log::info('Payment method updated successfully', [
        'payment_method_id' => $paymentMethod->id,
        'name' => $paymentMethod->name,
      ]);

      return $paymentMethod;
    } catch (\Exception $e) {
      Log::error('Payment method update failed: ' . $e->getMessage(), [
        'payment_method_id' => $paymentMethod->id,
        'data' => $data,
        'trace' => $e->getTraceAsString()
      ]);

      throw $e;
    }
  }
}
