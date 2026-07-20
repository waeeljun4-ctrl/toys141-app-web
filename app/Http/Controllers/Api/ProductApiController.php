<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\Category;
use App\Models\DiscountCampaign;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductApiController extends Controller
{
    public function index(Request $request)
    {
        $categories = Category::active()->get(['id', 'name', 'name_he', 'name_en', 'icon', 'key']);
        $brands     = Brand::active()->get(['id', 'name', 'logo']);

        $products = Product::active()
            ->with(['category:id,name,name_he,name_en,key', 'brand:id,name', 'variants'])
            ->get([
                'id', 'category_id', 'brand_id',
                'name', 'name_he', 'name_en',
                'description', 'description_he', 'description_en',
                'image', 'images', 'video', 'video_url', 'badge', 'price', 'compare_price', 'track_stock', 'stock_quantity',
            ]);

        $products = DiscountCampaign::applyToProducts($products, $request->user()?->id)
            ->map(function ($p) {
                $p->image_url = $p->image ? asset('storage/' . $p->image) : null;
                $p->video_url_full = $p->video ? asset('storage/' . $p->video) : $p->video_url;
                return $p;
            });

        return response()->json([
            'categories' => $categories,
            'brands'     => $brands,
            'products'   => $products,
        ]);
    }
}
