<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Services\ImageCompressionService;
use App\Services\VideoCompressionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with(['category:id,name', 'brand:id,name'])->orderBy('sort_order');

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%$search%")
                  ->orWhere('description', 'like', "%$search%");
            });
        }

        return Inertia::render('Admin/Products', [
            'products'   => $query->get(),
            'categories' => Category::active()->get(['id', 'name', 'icon']),
            'search'     => $request->input('search', ''),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/ProductEdit', [
            'product'    => null,
            'categories' => Category::active()->get(['id', 'name', 'icon']),
            'brands'     => Brand::active()->get(['id', 'name']),
        ]);
    }

    public function edit(Product $product)
    {
        return Inertia::render('Admin/ProductEdit', [
            'product'    => $product->load('variants'),
            'categories' => Category::active()->get(['id', 'name', 'icon']),
            'brands'     => Brand::active()->get(['id', 'name']),
        ]);
    }

    private function validateFields(): array
    {
        return [
            'category_id'    => 'required|exists:categories,id',
            'brand_id'       => 'nullable|exists:brands,id',
            'name'           => 'required|string|max:150',
            'name_he'        => 'nullable|string|max:200',
            'name_en'        => 'nullable|string|max:200',
            'description'    => 'nullable|string|max:1000',
            'description_he' => 'nullable|string|max:1000',
            'description_en' => 'nullable|string|max:1000',
            'image'          => 'nullable|image|max:10240',
            'video'          => 'nullable|mimetypes:video/mp4,video/quicktime,video/x-msvideo,video/webm|max:2097152',
            'video_url'      => 'nullable|max:500',
            'badge'          => 'nullable|string|max:30',
            'price'          => 'required|numeric|min:0',
            'compare_price'  => 'nullable|numeric|min:0',
            'stock_quantity' => 'nullable|integer|min:0',
            'is_active'      => 'boolean',
            'sort_order'     => 'integer',
            'variants'                 => 'nullable|array',
            'variants.*.id'            => 'nullable|integer|exists:product_variants,id',
            'variants.*.size'          => 'nullable|string|max:20',
            'variants.*.color'         => 'nullable|string|max:30',
            'variants.*.color_hex'     => 'nullable|string|max:7',
            'variants.*.stock'         => 'nullable|integer|min:0',
            'variants.*.sku'           => 'nullable|string|max:60',
        ];
    }

    private function syncVariants(Product $product, ?array $variants): void
    {
        $keepIds = [];

        foreach ($variants ?? [] as $i => $variant) {
            $payload = [
                'size'       => $variant['size']       ?? null,
                'color'      => $variant['color']      ?? null,
                'color_hex'  => $variant['color_hex']  ?? null,
                'stock'      => $variant['stock']       ?? 0,
                'sku'        => $variant['sku']        ?: null,
                'sort_order' => $i,
            ];

            if (!empty($variant['id'])) {
                $product->variants()->where('id', $variant['id'])->update($payload);
                $keepIds[] = $variant['id'];
            } else {
                $keepIds[] = $product->variants()->create($payload)->id;
            }
        }

        $product->variants()->whereNotIn('id', $keepIds)->delete();
    }

    public function store(Request $request, ImageCompressionService $imageCompressor, VideoCompressionService $videoCompressor)
    {
        $data = $request->validate($this->validateFields());
        $variants = $data['variants'] ?? null;
        unset($data['variants']);

        if ($request->hasFile('image')) {
            $data['image'] = $imageCompressor->compressAndStore($request->file('image'), 'products');
        }
        if ($request->hasFile('video')) {
            $data['video'] = $videoCompressor->compressAndStore($request->file('video'), 'products/videos');
        }

        $product = Product::create($data);
        $this->syncVariants($product, $variants);
        $this->syncStockTracking($product, $variants);

        return back()->with('success', 'تم إضافة المنتج ✅');
    }

    // Typing stock numbers into the form means you want them enforced — no separate hidden toggle needed.
    // Variants (if any) are the source of truth; otherwise the product-level quantity governs.
    // Leaving the quantity blank means "unlimited" — tracking stays off.
    private function syncStockTracking(Product $product, ?array $variants): void
    {
        if (!empty($variants)) {
            $product->update(['track_stock' => true, 'stock_quantity' => null]);
        } elseif ($product->stock_quantity !== null) {
            $product->update(['track_stock' => true]);
        } else {
            $product->update(['track_stock' => false]);
        }
    }

    public function update(Request $request, Product $product, ImageCompressionService $imageCompressor, VideoCompressionService $videoCompressor)
    {
        $data = $request->validate($this->validateFields());
        $variants = $data['variants'] ?? null;
        unset($data['variants']);

        if ($request->hasFile('image')) {
            if ($product->image) Storage::disk('public')->delete($product->image);
            $data['image'] = $imageCompressor->compressAndStore($request->file('image'), 'products');
        }
        if ($request->hasFile('video')) {
            if ($product->video) Storage::disk('public')->delete($product->video);
            $data['video'] = $videoCompressor->compressAndStore($request->file('video'), 'products/videos');
        }

        $product->update($data);
        $this->syncVariants($product, $variants);
        $this->syncStockTracking($product, $variants);

        return back()->with('success', 'تم تحديث المنتج ✅');
    }

    public function destroyImage(Product $product)
    {
        if ($product->image) {
            Storage::disk('public')->delete($product->image);
            $product->update(['image' => null]);
        }
        return back()->with('success', 'تم حذف الصورة');
    }

    public function destroyVideo(Product $product)
    {
        if ($product->video) {
            Storage::disk('public')->delete($product->video);
            $product->update(['video' => null]);
        }
        return back()->with('success', 'تم حذف الفيديو');
    }

    public function reorder(Request $request)
    {
        $order = $request->validate(['order' => 'required|array'])['order'];
        foreach ($order as $index => $id) {
            Product::where('id', $id)->update(['sort_order' => $index]);
        }
        return response()->json(['ok' => true]);
    }

    public function destroy(Product $product)
    {
        if ($product->image) Storage::disk('public')->delete($product->image);
        $product->delete();
        return back()->with('success', 'تم حذف المنتج');
    }
}
