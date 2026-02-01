<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Log;

class UpdateProductRequest extends FormRequest
{
  /**
   * Determine if the user is authorized to make this request.
   */
  public function authorize(): bool
  {
    return true;
  }

  /**
   * Get the validation rules that apply to the request.
   *
   * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
   */
  public function rules(): array
  {
    // Debug: Log incoming request data for update
    Log::info('UpdateProductRequest - Raw input:', $this->all());

    return [
      'name' => 'required|string|max:255',
      'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
      'images' => 'nullable|array',
      'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
      'removed_images' => 'nullable|array',
      'removed_images.*' => 'string',
      'description' => 'nullable|string|max:1000',
      'price' => 'required|numeric|min:0|max:99999999.99',
      'stock' => 'required|integer|min:0|max:999999',
      'category_ids' => 'required|array|min:1',
      'category_ids.*' => 'exists:product_categories,id',
    ];
  }

  /**
   * Get custom validation messages.
   *
   * @return array<string, string>
   */
  public function messages(): array
  {
    return [
      'name.required' => 'Product name is required.',
      'name.max' => 'Product name cannot exceed 255 characters.',
      'thumbnail.image' => 'Thumbnail must be an image file.',
      'thumbnail.mimes' => 'Thumbnail must be a JPEG, PNG, JPG, or GIF file.',
      'thumbnail.max' => 'Thumbnail size cannot exceed 2MB.',
      'images.array' => 'Images must be provided as an array.',
      'images.*.image' => 'All uploaded files must be images.',
      'images.*.mimes' => 'Images must be JPEG, PNG, JPG, or GIF files.',
      'images.*.max' => 'Each image cannot exceed 2MB.',
      'removed_images.array' => 'Removed images must be provided as an array.',
      'removed_images.*.string' => 'Each removed image path must be a string.',
      'price.required' => 'Price is required.',
      'price.numeric' => 'Price must be a valid number.',
      'price.min' => 'Price cannot be negative.',
      'price.max' => 'Price cannot exceed 99,999,999.99.',
      'stock.required' => 'Stock quantity is required.',
      'stock.integer' => 'Stock must be a whole number.',
      'stock.min' => 'Stock cannot be negative.',
      'stock.max' => 'Stock cannot exceed 999,999.',
      'category_ids.required' => 'At least one category must be selected.',
      'category_ids.min' => 'At least one category must be selected.',
      'category_ids.*.exists' => 'One or more selected categories are invalid.',
      'description.max' => 'Description cannot exceed 1000 characters.',
    ];
  }

  /**
   * Get custom attributes for validator errors.
   *
   * @return array<string, string>
   */
  public function attributes(): array
  {
    return [
      'category_ids' => 'categories',
      'category_ids.*' => 'category',
      'removed_images' => 'images to remove',
      'removed_images.*' => 'image path',
    ];
  }

  /**
   * Prepare the data for validation.
   */
  protected function prepareForValidation(): void
  {
    // Ensure category_ids is always an array
    if ($this->has('category_ids') && !is_array($this->category_ids)) {
      $this->merge([
        'category_ids' => [$this->category_ids]
      ]);
    }

    // Ensure removed_images is always an array if provided
    if ($this->has('removed_images') && !is_array($this->removed_images)) {
      $this->merge([
        'removed_images' => [$this->removed_images]
      ]);
    }

    // Convert price and stock to appropriate types
    if ($this->has('price')) {
      $this->merge([
        'price' => (float) $this->price
      ]);
    }

    if ($this->has('stock')) {
      $this->merge([
        'stock' => (int) $this->stock
      ]);
    }
  }
}
