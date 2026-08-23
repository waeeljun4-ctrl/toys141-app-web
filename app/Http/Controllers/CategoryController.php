<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Services\ImageCompressionService;
use App\Services\TranslationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function __construct(private TranslationService $translator)
    {
    }

    public function index()
    {
        return Inertia::render('Admin/Categories', [
            'categories' => Category::orderBy('sort_order')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'parent_id'  => 'nullable|exists:categories,id',
            'name'       => 'required|string|max:60',
            'name_he'    => 'nullable|string|max:80',
            'name_en'    => 'nullable|string|max:80',
            'icon'       => 'nullable|string|max:10',
            'key'        => 'required|string|max:40|unique:categories,key',
            'sort_order' => 'integer',
            'is_active'  => 'boolean',
        ]);

        $data['name_he'] = $this->translator->translate($data['name'], 'he');
        $data['name_en'] = $this->translator->translate($data['name'], 'en');

        Category::create($data);
        return back()->with('success', 'تم إضافة الصنف ✅');
    }

    public function update(Request $request, Category $category)
    {
        $data = $request->validate([
            'parent_id'  => ['nullable', 'exists:categories,id', Rule::notIn([$category->id])],
            'name'       => 'required|string|max:60',
            'name_he'    => 'nullable|string|max:80',
            'name_en'    => 'nullable|string|max:80',
            'icon'       => 'nullable|string|max:10',
            'sort_order' => 'integer',
            'is_active'  => 'boolean',
        ]);

        $data['name_he'] = $this->translator->translate($data['name'], 'he');
        $data['name_en'] = $this->translator->translate($data['name'], 'en');

        $category->update($data);
        return back()->with('success', 'تم تحديث الصنف ✅');
    }

    public function uploadImage(Request $request, Category $category, ImageCompressionService $imageCompressor)
    {
        $request->validate(['image' => 'required|image|max:10240']);
        if ($category->image) Storage::disk('public')->delete($category->image);
        $category->update(['image' => $imageCompressor->compressAndStore($request->file('image'), 'categories')]);
        return back()->with('success', 'تم رفع صورة الصنف ✅');
    }

    public function destroyImage(Category $category)
    {
        if ($category->image) {
            Storage::disk('public')->delete($category->image);
            $category->update(['image' => null]);
        }
        return back()->with('success', 'تم حذف الصورة');
    }

    public function destroy(Category $category)
    {
        if ($category->products()->exists()) {
            return back()->withErrors(['error' => 'لا يمكن حذف صنف فيه منتجات']);
        }
        $category->delete();
        return back()->with('success', 'تم الحذف');
    }
}
