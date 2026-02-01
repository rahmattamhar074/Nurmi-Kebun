<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class ProductCategory extends Model
{
    protected $fillable = [
        'name',
        'description',
    ];

    /**
     * Get the products for the category.
     */
    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'product_category_pivot');
    }

    /**
     * Get the count of products in this category
     */
    public function getProductsCountAttribute(): int
    {
        return $this->products()->count();
    }

    /**
     * Check if the category has any products
     */
    public function hasProducts(): bool
    {
        return $this->products()->exists();
    }

    /**
     * Add products to the category
     */
    public function addProducts(array $productIds): void
    {
        $this->products()->attach($productIds);
    }

    /**
     * Remove products from the category
     */
    public function removeProducts(array $productIds): void
    {
        $this->products()->detach($productIds);
    }
}
