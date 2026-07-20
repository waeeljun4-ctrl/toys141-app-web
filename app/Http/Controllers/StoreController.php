<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use App\Models\Category;
use App\Models\DiscountCampaign;
use App\Models\HeroSlide;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StoreController extends Controller
{
    public function index(Request $request)
    {
        $heroSlides = HeroSlide::active()->get();
        $categories = Category::active()->get(['id', 'parent_id', 'name', 'name_he', 'name_en', 'icon', 'image', 'key']);
        $brands     = Brand::active()->get(['id', 'name', 'logo']);

        $products = Product::active()
            ->with(['category:id,parent_id,name,name_he,name_en,key', 'brand:id,name', 'variants'])
            ->get([
                'id', 'category_id', 'brand_id',
                'name', 'name_he', 'name_en',
                'description', 'description_he', 'description_en',
                'image', 'images', 'video', 'video_url', 'badge', 'price', 'compare_price', 'track_stock', 'stock_quantity', 'created_at',
            ]);

        $products = DiscountCampaign::applyToProducts($products, $request->user()?->id);

        return Inertia::render('Store/Index', [
            'heroSlides' => $heroSlides,
            'categories' => $categories,
            'brands'     => $brands,
            'products'   => $products,
        ]);
    }
}
