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
    private const PRODUCT_COLUMNS = [
        'id', 'category_id', 'brand_id',
        'name', 'name_he', 'name_en',
        'description', 'description_he', 'description_en',
        'image', 'images', 'video', 'video_url', 'badge', 'price', 'compare_price', 'track_stock', 'stock_quantity', 'created_at',
    ];

    private const PRODUCT_WITH = ['category:id,parent_id,name,name_he,name_en,key', 'brand:id,name', 'variants'];

    public function index(Request $request)
    {
        $heroSlides = HeroSlide::active()->get();
        $categories = Category::active()->get(['id', 'parent_id', 'name', 'name_he', 'name_en', 'icon', 'image', 'key']);
        $brands     = Brand::active()->get(['id', 'name', 'logo']);

        $products = Product::active()
            ->with(self::PRODUCT_WITH)
            ->get(self::PRODUCT_COLUMNS);

        $products = DiscountCampaign::applyToProducts($products, $request->user()?->id);

        return Inertia::render('Store/Index', [
            'heroSlides' => $heroSlides,
            'categories' => $categories,
            'brands'     => $brands,
            'products'   => $products,
        ]);
    }

    public function product(Request $request, Product $product)
    {
        abort_unless($product->is_active, 404);

        $product->load(self::PRODUCT_WITH);
        $viewerId = $request->user()?->id;

        $productCollection = DiscountCampaign::applyToProducts(collect([$product]), $viewerId);

        $related = Product::active()
            ->where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->with(self::PRODUCT_WITH)
            ->inRandomOrder()
            ->limit(8)
            ->get(self::PRODUCT_COLUMNS);

        $related = DiscountCampaign::applyToProducts($related, $viewerId);

        return Inertia::render('Store/Product', [
            'product' => $productCollection->first(),
            'related' => $related,
        ]);
    }
}
