<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ProductVariant extends Model
{
    use HasFactory;

    protected $fillable = ['product_id', 'size', 'size_he', 'size_en', 'color', 'color_he', 'color_en', 'color_hex', 'stock', 'sku', 'sort_order'];

    protected $casts = [
        'stock' => 'integer',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function scopeInStock($query)
    {
        return $query->where('stock', '>', 0);
    }
}
