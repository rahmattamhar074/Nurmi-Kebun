<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ShippingCostService
{
  protected string $apiKey;
  protected string $baseUrl;
  protected int $originPostalCode;

  public function __construct()
  {
    $this->apiKey = config('services.shipping.biteship_api_key');
    $this->baseUrl = config('services.shipping.biteship_base_url');
    $this->originPostalCode = (int) config('services.shipping.origin_postal_code');
  }

  /**
   * Calculate shipping cost from origin to destination using Biteship API
   *
   * @param string $destinationPostalCode The destination postal code from user's address
   * @param array $items Array of items with name, weight, quantity, and value
   * @param string $couriers Comma-separated courier codes (e.g., 'jne,jnt,sicepat')
   * @return array Grouped by courier
   * @throws \Exception
   */
  public function calculate(
    string $destinationPostalCode,
    array $items,
    string $couriers = 'jne,jnt,sicepat,anteraja,pos'
  ): array {
    try {
      Log::info('Calculating shipping cost with Biteship', [
        'origin_postal_code' => $this->originPostalCode,
        'destination_postal_code' => $destinationPostalCode,
        'items_count' => count($items),
        'couriers' => $couriers,
        'api_key_set' => !empty($this->apiKey),
        'base_url' => $this->baseUrl,
      ]);

      $payload = [
        'origin_postal_code' => $this->originPostalCode,
        'destination_postal_code' => (int) $destinationPostalCode,
        'couriers' => $couriers,
        'items' => $items,
      ];

      Log::info('Biteship request payload', [
        'url' => "{$this->baseUrl}/v1/rates/couriers",
        'payload' => $payload,
      ]);

      $response = Http::withHeaders([
        'Authorization' => "{$this->apiKey}",
        'Content-Type' => 'application/json',
      ])->post("{$this->baseUrl}/v1/rates/couriers", $payload);

      Log::info('Biteship API Response', [
        'status' => $response->status(),
        'body' => $response->body(),
      ]);

      if ($response->failed()) {
        Log::error('Biteship API Error', [
          'status' => $response->status(),
          'body' => $response->body(),
          'destination_postal_code' => $destinationPostalCode,
        ]);

        throw new \Exception('Failed to calculate shipping cost: ' . $response->body());
      }

      $data = $response->json();

      if (!isset($data['success']) || !$data['success']) {
        Log::error('Biteship API returned error', [
          'error_data' => $data,
        ]);
        throw new \Exception($data['message'] ?? 'Unknown error from Biteship API');
      }

      return $this->formatResponse($data);
    } catch (\Exception $e) {
      Log::error('Shipping Cost Calculation Exception', [
        'message' => $e->getMessage(),
        'destination_postal_code' => $destinationPostalCode,
      ]);

      throw $e;
    }
  }

  /**
   * Format the Biteship API response into courier groups
   *
   * @param array $response The raw API response from Biteship
   * @return array Courier groups with their services
   */
  protected function formatResponse(array $response): array
  {
    Log::info('Formatting Biteship response', [
      'has_pricing' => isset($response['pricing']),
      'pricing_count' => isset($response['pricing']) ? count($response['pricing']) : 0,
    ]);

    if (!isset($response['pricing']) || !is_array($response['pricing'])) {
      Log::warning('Response pricing is missing or not an array', [
        'response' => $response,
      ]);
      return [];
    }

    // Group services by courier
    $courierGroups = [];

    foreach ($response['pricing'] as $pricing) {
      $courierCode = $pricing['courier_code'] ?? null;
      $courierName = $pricing['courier_name'] ?? null;

      if (!$courierCode) {
        continue;
      }

      // Initialize courier group if not exists
      if (!isset($courierGroups[$courierCode])) {
        $courierGroups[$courierCode] = [
          'courier_code' => $courierCode,
          'courier_name' => $courierName,
          'services' => [],
        ];
      }

      // Add service to courier group
      $courierGroups[$courierCode]['services'][] = [
        'service_code' => $pricing['courier_service_code'] ?? null,
        'service_name' => $pricing['courier_service_name'] ?? null,
        'description' => $pricing['description'] ?? null,
        'duration' => $pricing['duration'] ?? null,
        'price' => $pricing['price'] ?? 0,
        'type' => $pricing['service_type'] ?? null,
      ];
    }

    // Convert to indexed array
    $result = array_values($courierGroups);

    Log::info('Formatted courier groups', [
      'courier_count' => count($result),
      'groups' => $result,
    ]);

    return $result;
  }
}
