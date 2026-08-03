<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id', 'brand_id', 'name', 'name_he', 'name_en',
        'description', 'description_he', 'description_en',
        'image', 'images', 'video', 'video_url', 'badge',
        'price', 'compare_price', 'wholesale_price', 'is_active', 'sort_order', 'track_stock', 'stock_quantity',
    ];

    protected $casts = [
        'is_active'     => 'boolean',
        'price'         => 'float',
        'compare_price' => 'float',
        'wholesale_price' => 'float',
        'images'        => 'array',
        'track_stock'   => 'boolean',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function brand()
    {
        return $this->belongsTo(Brand::class);
    }

    public function variants()
    {
        return $this->hasMany(ProductVariant::class)->orderBy('sort_order');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true)->orderBy('sort_order');
    }

    public function discountPercent(): ?int
    {
        if (!$this->compare_price || $this->compare_price <= $this->price) {
            return null;
        }

        return (int) round((($this->compare_price - $this->price) / $this->compare_price) * 100);
    }

    public function isSoldOut(): bool
    {
        if (! $this->track_stock) {
            return false;
        }

        if ($this->variants->isNotEmpty()) {
            return $this->variants->sum('stock') <= 0;
        }

        return $this->stock_quantity !== null && $this->stock_quantity <= 0;
    }
}
