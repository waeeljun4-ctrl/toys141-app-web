<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use App\Services\ImageCompressionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class BrandController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Brands', [
            'brands' => Brand::orderBy('sort_order')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'       => 'required|string|max:60|unique:brands,name',
            'sort_order' => 'integer',
            'is_active'  => 'boolean',
        ]);

        Brand::create($data);
        return back()->with('success', 'تم إضافة الماركة ✅');
    }

    public function update(Request $request, Brand $brand)
    {
        $data = $request->validate([
            'name'       => 'required|string|max:60|unique:brands,name,' . $brand->id,
            'sort_order' => 'integer',
            'is_active'  => 'boolean',
        ]);

        $brand->update($data);
        return back()->with('success', 'تم تحديث الماركة ✅');
    }

    public function uploadLogo(Request $request, Brand $brand, ImageCompressionService $imageCompressor)
    {
        $request->validate(['logo' => 'required|image|max:5120']);
        if ($brand->logo) Storage::disk('public')->delete($brand->logo);
        $brand->update(['logo' => $imageCompressor->compressAndStore($request->file('logo'), 'brands')]);
        return back()->with('success', 'تم رفع شعار الماركة ✅');
    }

    public function destroyLogo(Brand $brand)
    {
        if ($brand->logo) {
            Storage::disk('public')->delete($brand->logo);
            $brand->update(['logo' => null]);
        }
        return back()->with('success', 'تم حذف الشعار');
    }

    public function destroy(Brand $brand)
    {
        if ($brand->products()->exists()) {
            return back()->withErrors(['error' => 'لا يمكن حذف ماركة فيها منتجات']);
        }
        $brand->delete();
        return back()->with('success', 'تم الحذف');
    }
}
