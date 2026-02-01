<?php

namespace App\Services;

use App\Models\Province;
use App\Models\City;
use App\Models\Subdistrict;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class RajaongkirService
{
  private string $apiKey;
  private string $baseUrl;
  private string $accountType; // 'starter', 'basic', 'pro'

  public function __construct()
  {
    $this->apiKey = config('services.rajaongkir.api_key', '');
    $this->accountType = config('services.rajaongkir.account_type', 'starter');
    $this->baseUrl = $this->accountType === 'starter'
      ? 'https://api.rajaongkir.com/starter'
      : 'https://api.rajaongkir.com/basic';
  }

  /**
   * Sync provinces from RajaOngkir API
   */
  public function syncProvinces(): array
  {
    try {
      $response = Http::withHeaders([
        'key' => $this->apiKey
      ])->get("{$this->baseUrl}/province");

      if (!$response->successful()) {
        throw new \Exception('Failed to fetch provinces from RajaOngkir');
      }

      $data = $response->json();
      $provinces = $data['rajaongkir']['results'];
      $synced = 0;

      foreach ($provinces as $provinceData) {
        Province::updateOrCreate(
          ['id' => $provinceData['province_id']],
          ['name' => $provinceData['province']]
        );
        $synced++;
      }

      Log::info("Synced {$synced} provinces from RajaOngkir");
      return ['success' => true, 'count' => $synced];
    } catch (\Exception $e) {
      Log::error('Failed to sync provinces: ' . $e->getMessage());
      return ['success' => false, 'error' => $e->getMessage()];
    }
  }

  /**
   * Sync cities for a specific province from RajaOngkir API
   */
  public function syncCities(?int $provinceId = null): array
  {
    try {
      $url = "{$this->baseUrl}/city";
      if ($provinceId) {
        $url .= "?province={$provinceId}";
      }

      $response = Http::withHeaders([
        'key' => $this->apiKey
      ])->get($url);

      if (!$response->successful()) {
        throw new \Exception('Failed to fetch cities from RajaOngkir');
      }

      $data = $response->json();
      $cities = $data['rajaongkir']['results'];
      $synced = 0;

      foreach ($cities as $cityData) {
        City::updateOrCreate(
          ['id' => $cityData['city_id']],
          [
            'province_id' => $cityData['province_id'],
            'name' => $cityData['city_name'],
            'type' => $cityData['type'],
            'postal_code' => $cityData['postal_code'],
          ]
        );
        $synced++;
      }

      Log::info("Synced {$synced} cities from RajaOngkir");
      return ['success' => true, 'count' => $synced];
    } catch (\Exception $e) {
      Log::error('Failed to sync cities: ' . $e->getMessage());
      return ['success' => false, 'error' => $e->getMessage()];
    }
  }

  /**
   * Sync subdistricts for a specific city (Pro account only)
   */
  public function syncSubdistricts(int $cityId): array
  {
    if ($this->accountType === 'starter') {
      return ['success' => false, 'error' => 'Subdistricts require Basic or Pro account'];
    }

    try {
      $response = Http::withHeaders([
        'key' => $this->apiKey
      ])->get("{$this->baseUrl}/subdistrict", [
        'city' => $cityId
      ]);

      if (!$response->successful()) {
        throw new \Exception('Failed to fetch subdistricts from RajaOngkir');
      }

      $data = $response->json();
      $subdistricts = $data['rajaongkir']['results'];
      $synced = 0;

      foreach ($subdistricts as $subdistrictData) {
        Subdistrict::updateOrCreate(
          ['id' => $subdistrictData['subdistrict_id']],
          [
            'city_id' => $subdistrictData['city_id'],
            'name' => $subdistrictData['subdistrict_name'],
          ]
        );
        $synced++;
      }

      Log::info("Synced {$synced} subdistricts for city {$cityId}");
      return ['success' => true, 'count' => $synced];
    } catch (\Exception $e) {
      Log::error('Failed to sync subdistricts: ' . $e->getMessage());
      return ['success' => false, 'error' => $e->getMessage()];
    }
  }

  /**
   * Get shipping cost calculation
   */
  public function getShippingCost(int $origin, int $destination, int $weight, array $couriers = ['jne', 'tiki', 'pos']): array
  {
    try {
      $response = Http::withHeaders([
        'key' => $this->apiKey
      ])->post("{$this->baseUrl}/cost", [
        'origin' => $origin,
        'destination' => $destination,
        'weight' => $weight,
        'courier' => implode(':', $couriers)
      ]);

      if (!$response->successful()) {
        throw new \Exception('Failed to get shipping cost from RajaOngkir');
      }

      $data = $response->json();
      return [
        'success' => true,
        'results' => $data['rajaongkir']['results']
      ];
    } catch (\Exception $e) {
      Log::error('Failed to get shipping cost: ' . $e->getMessage());
      return ['success' => false, 'error' => $e->getMessage()];
    }
  }

  /**
   * Get cached provinces or fetch from API
   */
  public function getProvinces(): array
  {
    return Cache::remember('rajaongkir.provinces', 86400, function () {
      $provinces = Province::orderBy('name')->get();

      if ($provinces->isEmpty()) {
        $this->syncProvinces();
        $provinces = Province::orderBy('name')->get();
      }

      return $provinces->toArray();
    });
  }

  /**
   * Get cached cities for a province or fetch from API
   */
  public function getCities(int $provinceId): array
  {
    return Cache::remember("rajaongkir.cities.{$provinceId}", 86400, function () use ($provinceId) {
      $cities = City::where('province_id', $provinceId)
        ->orderBy('type')
        ->orderBy('name')
        ->get();

      if ($cities->isEmpty()) {
        $this->syncCities($provinceId);
        $cities = City::where('province_id', $provinceId)
          ->orderBy('type')
          ->orderBy('name')
          ->get();
      }

      return $cities->toArray();
    });
  }

  /**
   * Get cached subdistricts for a city or fetch from API
   */
  public function getSubdistricts(int $cityId): array
  {
    return Cache::remember("rajaongkir.subdistricts.{$cityId}", 86400, function () use ($cityId) {
      $subdistricts = Subdistrict::where('city_id', $cityId)
        ->orderBy('name')
        ->get();

      if ($subdistricts->isEmpty() && $this->accountType !== 'starter') {
        $this->syncSubdistricts($cityId);
        $subdistricts = Subdistrict::where('city_id', $cityId)
          ->orderBy('name')
          ->get();
      }

      return $subdistricts->toArray();
    });
  }

  /**
   * Calculate shipping cost using the new RajaOngkir Komerce API
   * 
   * @param string $destinationDistrictId The destination district ID
   * @param int $weight Weight in grams
   * @param string $couriers Colon-separated courier codes (e.g., 'jne:sicepat:jnt')
   * @param string $priceSort Sort by price: 'lowest' or 'highest'
   * @return array
   * @throws \Exception
   */
  public function calculateShippingCost(
    string $destinationDistrictId,
    int $weight,
    string $couriers = 'jne:sicepat:jnt:anteraja:pos',
    string $priceSort = 'lowest'
  ): array {
    try {
      $komerceBaseUrl = config('services.rajaongkir.base_url');
      $shippingKey = config('services.rajaongkir.shipping_key');
      $originDistrictId = config('services.rajaongkir.origin_zipcode'); // This is actually district ID based on your config

      $response = Http::asForm()
        ->withHeaders([
          'key' => $shippingKey,
        ])
        ->post("{$komerceBaseUrl}/calculate/district/domestic-cost", [
          'origin' => $originDistrictId,
          'destination' => $destinationDistrictId,
          'weight' => $weight,
          'courier' => $couriers,
          'price' => $priceSort,
        ]);

      if ($response->failed()) {
        Log::error('RajaOngkir Komerce API Error', [
          'status' => $response->status(),
          'body' => $response->body(),
        ]);

        throw new \Exception('Failed to calculate shipping cost: ' . $response->body());
      }

      $data = $response->json();

      // Check if the API returned an error
      if (isset($data['error']) && $data['error']) {
        throw new \Exception($data['message'] ?? 'Unknown error from RajaOngkir API');
      }

      return $data;
    } catch (\Exception $e) {
      Log::error('RajaOngkir Shipping Calculation Exception', [
        'message' => $e->getMessage(),
        'destination' => $destinationDistrictId,
        'weight' => $weight,
      ]);

      throw $e;
    }
  }

  /**
   * Get formatted shipping options from the Komerce API response
   *
   * @param array $response The raw API response from calculateShippingCost
   * @return array Simplified array of shipping options
   */
  public function formatShippingOptions(array $response): array
  {
    if (!isset($response['data']) || !is_array($response['data'])) {
      return [];
    }

    $options = [];

    foreach ($response['data'] as $courier) {
      if (!isset($courier['costs']) || !is_array($courier['costs'])) {
        continue;
      }

      foreach ($courier['costs'] as $service) {
        $options[] = [
          'courier_code' => $courier['code'] ?? null,
          'courier_name' => $courier['name'] ?? null,
          'service_code' => $service['service'] ?? null,
          'service_description' => $service['description'] ?? null,
          'cost' => $service['cost'][0]['value'] ?? 0,
          'etd' => $service['cost'][0]['etd'] ?? null,
          'note' => $service['cost'][0]['note'] ?? null,
        ];
      }
    }

    return $options;
  }
}
