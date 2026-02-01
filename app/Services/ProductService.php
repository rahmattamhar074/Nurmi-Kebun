<?php

namespace App\Services;

use App\Models\Product;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class ProductService
{
  /**
   * Create a new product with associated files and categories.
   *
   * @param array $data
   * @return Product
   * @throws \Exception
   */
  public function createProduct(array $data): Product
  {
    $uploadedFiles = $this->handleFileUploads($data);

    try {
      DB::beginTransaction();

      $productData = $this->prepareProductData($data, $uploadedFiles);
      $categoryIds = $data['category_ids'];

      $product = Product::create($productData);
      $product->categories()->attach($categoryIds);

      DB::commit();

      Log::info('Product created successfully', [
        'product_id' => $product->id,
        'name' => $product->name,
        'categories' => count($categoryIds),
      ]);

      return $product;
    } catch (\Exception $e) {
      DB::rollBack();
      $this->cleanupFiles($uploadedFiles);

      Log::error('Product creation failed: ' . $e->getMessage(), [
        'data' => collect($data)->except(['thumbnail', 'images'])->toArray(),
        'trace' => $e->getTraceAsString()
      ]);

      throw $e;
    }
  }

  /**
   * Update an existing product with associated files and categories.
   *
   * @param Product $product
   * @param array $data
   * @return Product
   * @throws \Exception
   */
  public function updateProduct(Product $product, array $data): Product
  {
    $uploadedFiles = [];

    try {
      DB::beginTransaction();


      $currentImages = $this->manageProductImages($product, $data, $uploadedFiles);


      $thumbnailPath = $this->updateThumbnail($product, $data, $uploadedFiles);


      $productData = $this->prepareProductData($data, [
        'thumbnail' => $thumbnailPath,
        'images' => $currentImages
      ]);

      $categoryIds = $data['category_ids'];

      $product->update($productData);
      $product->categories()->sync($categoryIds);

      DB::commit();

      Log::info('Product updated successfully', [
        'product_id' => $product->id,
        'name' => $product->name,
        'categories' => count($categoryIds),
      ]);

      return $product;
    } catch (\Exception $e) {
      DB::rollBack();
      $this->cleanupFiles($uploadedFiles);

      Log::error('Product update failed: ' . $e->getMessage(), [
        'product_id' => $product->id,
        'data' => collect($data)->except(['thumbnail', 'images'])->toArray(),
        'trace' => $e->getTraceAsString()
      ]);

      throw $e;
    }
  }

  /**
   * Handle file uploads for product creation.
   *
   * @param array $data
   * @return array
   * @throws \Exception
   */
  private function handleFileUploads(array $data): array
  {
    $uploadedFiles = [
      'thumbnail' => null,
      'images' => []
    ];

    try {

      if (isset($data['thumbnail']) && $data['thumbnail'] instanceof UploadedFile) {
        $uploadedFiles['thumbnail'] = $data['thumbnail']->store('products/thumbnails', 'public');
      }


      if (isset($data['images']) && is_array($data['images'])) {
        foreach ($data['images'] as $image) {
          if ($image instanceof UploadedFile) {
            $uploadedFiles['images'][] = $image->store('products/images', 'public');
          }
        }
      }

      return $uploadedFiles;
    } catch (\Exception $e) {
      $this->cleanupFiles($uploadedFiles);
      throw $e;
    }
  }

  /**
   * Manage product images during update (handle removal and addition).
   *
   * @param Product $product
   * @param array $data
   * @param array &$uploadedFiles
   * @return array
   */
  private function manageProductImages(Product $product, array $data, array &$uploadedFiles): array
  {

    $currentImages = $product->images ?? [];
    $validExistingImages = [];


    foreach ($currentImages as $imagePath) {
      if (Storage::disk('public')->exists($imagePath)) {
        $validExistingImages[] = $imagePath;
      } else {
        Log::warning("Orphaned image reference cleaned up: {$imagePath}", [
          'product_id' => $product->id
        ]);
      }
    }


    if (isset($data['removed_images']) && !empty($data['removed_images'])) {
      foreach ($data['removed_images'] as $removedImage) {
        if (
          Storage::disk('public')->exists($removedImage) &&
          in_array($removedImage, $validExistingImages)
        ) {
          Storage::disk('public')->delete($removedImage);
          Log::info("Deleted image: {$removedImage}", ['product_id' => $product->id]);
        }
      }

      $validExistingImages = array_diff($validExistingImages, $data['removed_images']);
    }


    if (isset($data['images']) && is_array($data['images'])) {
      foreach ($data['images'] as $image) {
        if ($image instanceof UploadedFile) {
          $uploadedFiles['images'][] = $image->store('products/images', 'public');
        }
      }
    }


    return array_values(array_merge($validExistingImages, $uploadedFiles['images'] ?? []));
  }

  /**
   * Update product thumbnail.
   *
   * @param Product $product
   * @param array $data
   * @param array &$uploadedFiles
   * @return string|null
   */
  private function updateThumbnail(Product $product, array $data, array &$uploadedFiles): ?string
  {
    if (isset($data['thumbnail']) && $data['thumbnail'] instanceof UploadedFile) {

      if ($product->thumbnail && Storage::disk('public')->exists($product->thumbnail)) {
        Storage::disk('public')->delete($product->thumbnail);
      }

      $thumbnailPath = $data['thumbnail']->store('products/thumbnails', 'public');
      $uploadedFiles['thumbnail'] = $thumbnailPath;

      return $thumbnailPath;
    }

    return $product->thumbnail;
  }

  /**
   * Prepare product data for database storage.
   *
   * @param array $data
   * @param array $uploadedFiles
   * @return array
   */
  private function prepareProductData(array $data, array $uploadedFiles): array
  {
    $productData = [
      'product_code' => $data['product_code'],
      'name' => $data['name'],
      'description' => $data['description'] ?? null,
      'price' => $data['price'],
      'stock' => $data['stock'],
      'weight' => $data['weight'],
      'notes' => $data['notes'] ?? null,
    ];

    if (isset($uploadedFiles['thumbnail'])) {
      $productData['thumbnail'] = $uploadedFiles['thumbnail'];
    }

    if (isset($uploadedFiles['images'])) {
      $productData['images'] = !empty($uploadedFiles['images']) ? $uploadedFiles['images'] : null;
    }

    return $productData;
  }

  /**
   * Clean up uploaded files in case of errors.
   *
   * @param array $uploadedFiles
   */
  private function cleanupFiles(array $uploadedFiles): void
  {
    if (isset($uploadedFiles['thumbnail']) && $uploadedFiles['thumbnail']) {
      if (Storage::disk('public')->exists($uploadedFiles['thumbnail'])) {
        Storage::disk('public')->delete($uploadedFiles['thumbnail']);
      }
    }

    if (isset($uploadedFiles['images']) && is_array($uploadedFiles['images'])) {
      foreach ($uploadedFiles['images'] as $imagePath) {
        if (Storage::disk('public')->exists($imagePath)) {
          Storage::disk('public')->delete($imagePath);
        }
      }
    }
  }

  /**
   * Delete a product and clean up its associated files.
   *
   * @param Product $product
   * @return bool
   */
  public function deleteProduct(Product $product): bool
  {
    try {
      DB::beginTransaction();

      // Delete thumbnail if exists
      if ($product->thumbnail && Storage::disk('public')->exists($product->thumbnail)) {
        Storage::disk('public')->delete($product->thumbnail);
      }

      // Delete images if exist
      if ($product->images && is_array($product->images)) {
        foreach ($product->images as $imagePath) {
          if (Storage::disk('public')->exists($imagePath)) {
            Storage::disk('public')->delete($imagePath);
          }
        }
      }

      // Detach categories
      $product->categories()->detach();

      // Delete the product (order_items will have product_id set to null, but snapshots preserve data)
      $deleted = $product->delete();

      DB::commit();

      Log::info('Product deleted successfully', [
        'product_id' => $product->id,
        'name' => $product->name,
      ]);

      return $deleted;
    } catch (\Exception $e) {
      DB::rollBack();

      Log::error('Product deletion failed: ' . $e->getMessage(), [
        'product_id' => $product->id,
        'trace' => $e->getTraceAsString()
      ]);

      throw $e;
    }
  }
}
