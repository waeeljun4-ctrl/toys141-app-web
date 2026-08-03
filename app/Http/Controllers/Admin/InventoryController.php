<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InventoryController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Inventory', [
            'products' => Product::with(['category:id,name', 'variants'])
                ->orderBy('sort_order')
                ->get(['id', 'category_id', 'name', 'image', 'track_stock', 'wholesale_price', 'price']),
        ]);
    }

    public function updateTracking(Request $request, Product $product)
    {
        $data = $request->validate([
            'track_stock' => 'required|boolean',
        ]);

        $product->update($data);

        return response()->json(['ok' => true]);
    }

    public function updateWholesalePrice(Request $request, Product $product)
    {
        $data = $request->validate([
            'wholesale_price' => 'nullable|numeric|min:0',
        ]);

        $product->update($data);

        return response()->json(['ok' => true]);
    }

    public function updateVariantStock(Request $request, ProductVariant $variant)
    {
        $data = $request->validate([
            'stock' => 'required|integer|min:0',
        ]);

        $variant->update($data);

        return response()->json(['ok' => true]);
    }
}
