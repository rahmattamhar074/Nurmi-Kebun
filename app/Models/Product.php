<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'product_code',
        'name',
        'thumbnail',
        'images',
        'description',
        'price',
        'stock',
        'weight',
        'notes',
    ];

    protected $casts = [
        'images' => 'array',
        'price' => 'decimal:2',
        'weight' => 'integer',
    ];

    /**
     * Get the categories for the product.
     */
    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(ProductCategory::class, 'product_category_pivot');
    }

    /**
     * Get all reviews for the product.
     */
    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    /**
     * Backward compatibility - get the first category
     * @deprecated Use categories() instead
     */
    public function productCategory()
    {
        return $this->categories()->first();
    }

    /**
     * Get a list of category names as a string
     */
    public function getCategoryNamesAttribute(): string
    {
        return $this->categories->pluck('name')->implode(', ');
    }

    /**
     * Get an array of category IDs
     */
    public function getCategoryIdsAttribute(): array
    {
        return $this->categories->pluck('id')->toArray();
    }

    /**
     * Get the full URL for the thumbnail image
     */
    public function getThumbnailUrlAttribute(): ?string
    {
        if (!$this->thumbnail) {
            return null;
        }

        if (str_starts_with($this->thumbnail, 'http')) {
            return $this->thumbnail;
        }

        return '/storage/' . ltrim($this->thumbnail, '/');
    }

    /**
     * Get full URLs for all images
     */
    public function getImageUrlsAttribute(): array
    {
        if (!$this->images || !is_array($this->images)) {
            return [];
        }

        return collect($this->images)->map(function ($image) {
            if (str_starts_with($image, 'http')) {
                return $image;
            }

            return '/storage/' . ltrim($image, '/');
        })->toArray();
    }

    /**
     * Check if the product belongs to a specific category
     */
    public function hasCategory($categoryId): bool
    {
        return $this->categories()->where('product_category_id', $categoryId)->exists();
    }

    /**
     * Add categories to the product
     */
    public function addCategories(array $categoryIds): void
    {
        $this->categories()->attach($categoryIds);
    }

    /**
     * Remove categories from the product
     */
    public function removeCategories(array $categoryIds): void
    {
        $this->categories()->detach($categoryIds);
    }

    /**
     * Replace all categories for the product
     */
    public function syncCategories(array $categoryIds): void
    {
        $this->categories()->sync($categoryIds);
    }
}
