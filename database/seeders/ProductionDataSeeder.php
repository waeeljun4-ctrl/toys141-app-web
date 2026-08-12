<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Brand;
use App\Models\Product;
use App\Models\HeroSlide;
use Illuminate\Database\Seeder;

/**
 * Real catalog data exported from the local working database —
 * generated, not hand-written. Re-run the export if the local
 * catalog changes before the next deploy.
 */
class ProductionDataSeeder extends Seeder
{
    public function run(): void
    {
        $categories = array (
  0 => 
  array (
    'name' => 'ألعاب أطفال صغار',
    'name_he' => 'צעצועים לפעוטות',
    'name_en' => 'Toddler Toys',
    'icon' => '🍼',
    'image' => NULL,
    'key' => 'toddler',
    'sort_order' => 1,
    'is_active' => true,
  ),
  1 => 
  array (
    'name' => 'ألعاب أولاد',
    'name_he' => 'צעצועים לבנים',
    'name_en' => 'Boys\' Toys',
    'icon' => '🚗',
    'image' => NULL,
    'key' => 'boys',
    'sort_order' => 2,
    'is_active' => true,
  ),
  2 => 
  array (
    'name' => 'ألعاب بنات',
    'name_he' => 'צעצועים לבנות',
    'name_en' => 'Girls\' Toys',
    'icon' => '👸',
    'image' => NULL,
    'key' => 'girls',
    'sort_order' => 3,
    'is_active' => true,
  ),
  3 => 
  array (
    'name' => 'ألعاب تعليمية',
    'name_he' => 'צעצועים חינוכיים',
    'name_en' => 'Educational',
    'icon' => '🧩',
    'image' => NULL,
    'key' => 'educational',
    'sort_order' => 4,
    'is_active' => true,
  ),
  4 => 
  array (
    'name' => 'ألعاب إلكترونية',
    'name_he' => 'צעצועים אלקטרוניים',
    'name_en' => 'Electronic & RC',
    'icon' => '🎮',
    'image' => NULL,
    'key' => 'electronic',
    'sort_order' => 5,
    'is_active' => true,
  ),
  5 => 
  array (
    'name' => 'ألعاب خارجية',
    'name_he' => 'צעצועי חוץ',
    'name_en' => 'Outdoor Toys',
    'icon' => '⚽',
    'image' => NULL,
    'key' => 'outdoor',
    'sort_order' => 6,
    'is_active' => true,
  ),
  6 => 
  array (
    'name' => 'ألعاب جماعية وبازل',
    'name_he' => 'משחקי קופסה ופאזל',
    'name_en' => 'Board Games & Puzzles',
    'icon' => '🎲',
    'image' => NULL,
    'key' => 'boardgames',
    'sort_order' => 7,
    'is_active' => true,
  ),
  7 => 
  array (
    'name' => 'بالونات وحفلات',
    'name_he' => 'בלונים ומסיבות',
    'name_en' => 'Balloons & Party',
    'icon' => '🎈',
    'image' => NULL,
    'key' => 'party',
    'sort_order' => 8,
    'is_active' => true,
  ),
);
        $categoryIds = [];
        foreach ($categories as $cat) {
            $categoryIds[$cat['key']] = Category::updateOrCreate(['key' => $cat['key']], $cat)->id;
        }

        $brands = array (
);
        $brandIds = [];
        foreach ($brands as $brand) {
            $brandIds[$brand['name']] = Brand::updateOrCreate(['name' => $brand['name']], $brand)->id;
        }

        $products = array (
  0 => 
  array (
    'name' => 'مكعبات بناء ملونة',
    'name_he' => NULL,
    'name_en' => NULL,
    'description' => 'طقم مكعبات بلاستيك آمنة للأطفال، تنمي التركيز والتناسق',
    'description_he' => NULL,
    'description_en' => NULL,
    'image' => NULL,
    'images' => NULL,
    'video' => NULL,
    'video_url' => NULL,
    'badge' => 'جديد',
    'price' => 45.0,
    'wholesale_price' => NULL,
    'compare_price' => NULL,
    'track_stock' => true,
    'stock_quantity' => NULL,
    'is_active' => true,
    'sort_order' => 1,
    'variants' => 
    array (
      0 => 
      array (
        'size' => 'قياسي',
        'color' => 'ألوان متعددة',
        'color_he' => NULL,
        'color_en' => NULL,
        'color_hex' => NULL,
        'stock' => 36,
        'sku' => NULL,
        'sort_order' => 0,
      ),
    ),
    'category_key' => 'toddler',
    'brand_name' => NULL,
  ),
  1 => 
  array (
    'name' => 'دمية قماشية طرية',
    'name_he' => NULL,
    'name_en' => NULL,
    'description' => 'دمية حيوان طرية آمنة للرضع والأطفال الصغار',
    'description_he' => NULL,
    'description_en' => NULL,
    'image' => NULL,
    'images' => NULL,
    'video' => NULL,
    'video_url' => NULL,
    'badge' => NULL,
    'price' => 35.0,
    'wholesale_price' => NULL,
    'compare_price' => NULL,
    'track_stock' => true,
    'stock_quantity' => NULL,
    'is_active' => true,
    'sort_order' => 2,
    'variants' => 
    array (
      0 => 
      array (
        'size' => 'صغير',
        'color' => 'بني',
        'color_he' => NULL,
        'color_en' => NULL,
        'color_hex' => NULL,
        'stock' => 20,
        'sku' => NULL,
        'sort_order' => 0,
      ),
      1 => 
      array (
        'size' => 'كبير',
        'color' => 'بني',
        'color_he' => NULL,
        'color_en' => NULL,
        'color_hex' => NULL,
        'stock' => 20,
        'sku' => NULL,
        'sort_order' => 1,
      ),
    ),
    'category_key' => 'toddler',
    'brand_name' => NULL,
  ),
  2 => 
  array (
    'name' => 'سيارة تحكم عن بعد',
    'name_he' => NULL,
    'name_en' => NULL,
    'description' => 'سيارة سباق بريموت كنترول، شحن USB',
    'description_he' => NULL,
    'description_en' => NULL,
    'image' => NULL,
    'images' => NULL,
    'video' => NULL,
    'video_url' => NULL,
    'badge' => 'الأكثر مبيعاً',
    'price' => 120.0,
    'wholesale_price' => NULL,
    'compare_price' => 160.0,
    'track_stock' => true,
    'stock_quantity' => NULL,
    'is_active' => true,
    'sort_order' => 1,
    'variants' => 
    array (
      0 => 
      array (
        'size' => 'قياسي',
        'color' => 'أحمر',
        'color_he' => NULL,
        'color_en' => NULL,
        'color_hex' => NULL,
        'stock' => 20,
        'sku' => NULL,
        'sort_order' => 0,
      ),
      1 => 
      array (
        'size' => 'قياسي',
        'color' => 'أزرق',
        'color_he' => NULL,
        'color_en' => NULL,
        'color_hex' => NULL,
        'stock' => 20,
        'sku' => NULL,
        'sort_order' => 1,
      ),
    ),
    'category_key' => 'boys',
    'brand_name' => NULL,
  ),
  3 => 
  array (
    'name' => 'مجسمات أبطال خارقين',
    'name_he' => NULL,
    'name_en' => NULL,
    'description' => 'طقم مجسمات حركية بمفاصل متحركة',
    'description_he' => NULL,
    'description_en' => NULL,
    'image' => NULL,
    'images' => NULL,
    'video' => NULL,
    'video_url' => NULL,
    'badge' => NULL,
    'price' => 60.0,
    'wholesale_price' => NULL,
    'compare_price' => NULL,
    'track_stock' => true,
    'stock_quantity' => NULL,
    'is_active' => true,
    'sort_order' => 2,
    'variants' => 
    array (
      0 => 
      array (
        'size' => 'قياسي',
        'color' => 'متعدد',
        'color_he' => NULL,
        'color_en' => NULL,
        'color_hex' => NULL,
        'stock' => 20,
        'sku' => NULL,
        'sort_order' => 0,
      ),
    ),
    'category_key' => 'boys',
    'brand_name' => NULL,
  ),
  4 => 
  array (
    'name' => 'دمية أزياء مع إكسسوارات',
    'name_he' => NULL,
    'name_en' => NULL,
    'description' => 'دمية مع طقم ملابس وإكسسوارات قابلة للتبديل',
    'description_he' => NULL,
    'description_en' => NULL,
    'image' => NULL,
    'images' => NULL,
    'video' => NULL,
    'video_url' => NULL,
    'badge' => 'جديد',
    'price' => 75.0,
    'wholesale_price' => NULL,
    'compare_price' => NULL,
    'track_stock' => true,
    'stock_quantity' => NULL,
    'is_active' => true,
    'sort_order' => 1,
    'variants' => 
    array (
      0 => 
      array (
        'size' => 'قياسي',
        'color' => 'وردي',
        'color_he' => NULL,
        'color_en' => NULL,
        'color_hex' => NULL,
        'stock' => 20,
        'sku' => NULL,
        'sort_order' => 0,
      ),
    ),
    'category_key' => 'girls',
    'brand_name' => NULL,
  ),
  5 => 
  array (
    'name' => 'بيت دمى مصغر',
    'name_he' => NULL,
    'name_en' => NULL,
    'description' => 'بيت دمى بلاستيك بثلاثة طوابق مع أثاث',
    'description_he' => NULL,
    'description_en' => NULL,
    'image' => NULL,
    'images' => NULL,
    'video' => NULL,
    'video_url' => NULL,
    'badge' => NULL,
    'price' => 140.0,
    'wholesale_price' => NULL,
    'compare_price' => 180.0,
    'track_stock' => true,
    'stock_quantity' => NULL,
    'is_active' => true,
    'sort_order' => 2,
    'variants' => 
    array (
      0 => 
      array (
        'size' => 'قياسي',
        'color' => 'وردي/أبيض',
        'color_he' => NULL,
        'color_en' => NULL,
        'color_hex' => NULL,
        'stock' => 20,
        'sku' => NULL,
        'sort_order' => 0,
      ),
    ),
    'category_key' => 'girls',
    'brand_name' => NULL,
  ),
  6 => 
  array (
    'name' => 'لوح رسم إلكتروني',
    'name_he' => NULL,
    'name_en' => NULL,
    'description' => 'لوح رسم ضوئي قابل للمسح، ينمي الإبداع',
    'description_he' => NULL,
    'description_en' => NULL,
    'image' => NULL,
    'images' => NULL,
    'video' => NULL,
    'video_url' => NULL,
    'badge' => NULL,
    'price' => 55.0,
    'wholesale_price' => NULL,
    'compare_price' => NULL,
    'track_stock' => true,
    'stock_quantity' => NULL,
    'is_active' => true,
    'sort_order' => 1,
    'variants' => 
    array (
      0 => 
      array (
        'size' => 'قياسي',
        'color' => 'متعدد',
        'color_he' => NULL,
        'color_en' => NULL,
        'color_hex' => NULL,
        'stock' => 20,
        'sku' => NULL,
        'sort_order' => 0,
      ),
    ),
    'category_key' => 'educational',
    'brand_name' => NULL,
  ),
  7 => 
  array (
    'name' => 'حروف وأرقام مغناطيسية',
    'name_he' => NULL,
    'name_en' => NULL,
    'description' => 'طقم تعليمي للحروف العربية والأرقام بالمغناطيس',
    'description_he' => NULL,
    'description_en' => NULL,
    'image' => NULL,
    'images' => NULL,
    'video' => NULL,
    'video_url' => NULL,
    'badge' => 'جديد',
    'price' => 40.0,
    'wholesale_price' => NULL,
    'compare_price' => NULL,
    'track_stock' => true,
    'stock_quantity' => NULL,
    'is_active' => true,
    'sort_order' => 2,
    'variants' => 
    array (
      0 => 
      array (
        'size' => 'قياسي',
        'color' => 'متعدد',
        'color_he' => NULL,
        'color_en' => NULL,
        'color_hex' => NULL,
        'stock' => 20,
        'sku' => NULL,
        'sort_order' => 0,
      ),
    ),
    'category_key' => 'educational',
    'brand_name' => NULL,
  ),
  8 => 
  array (
    'name' => 'درون صغير للأطفال',
    'name_he' => NULL,
    'name_en' => NULL,
    'description' => 'طائرة درون خفيفة سهلة التحكم للمبتدئين',
    'description_he' => NULL,
    'description_en' => NULL,
    'image' => NULL,
    'images' => NULL,
    'video' => NULL,
    'video_url' => NULL,
    'badge' => 'خصم',
    'price' => 150.0,
    'wholesale_price' => NULL,
    'compare_price' => 190.0,
    'track_stock' => true,
    'stock_quantity' => NULL,
    'is_active' => true,
    'sort_order' => 1,
    'variants' => 
    array (
      0 => 
      array (
        'size' => 'قياسي',
        'color' => 'أسود',
        'color_he' => NULL,
        'color_en' => NULL,
        'color_hex' => NULL,
        'stock' => 20,
        'sku' => NULL,
        'sort_order' => 0,
      ),
    ),
    'category_key' => 'electronic',
    'brand_name' => NULL,
  ),
  9 => 
  array (
    'name' => 'دراجة هوائية أطفال',
    'name_he' => NULL,
    'name_en' => NULL,
    'description' => 'دراجة أطفال بعجلات مساعدة، مقاسات متعددة',
    'description_he' => NULL,
    'description_en' => NULL,
    'image' => NULL,
    'images' => NULL,
    'video' => NULL,
    'video_url' => NULL,
    'badge' => NULL,
    'price' => 280.0,
    'wholesale_price' => NULL,
    'compare_price' => NULL,
    'track_stock' => true,
    'stock_quantity' => NULL,
    'is_active' => true,
    'sort_order' => 1,
    'variants' => 
    array (
      0 => 
      array (
        'size' => '12 إنش',
        'color' => 'أحمر',
        'color_he' => NULL,
        'color_en' => NULL,
        'color_hex' => NULL,
        'stock' => 20,
        'sku' => NULL,
        'sort_order' => 0,
      ),
      1 => 
      array (
        'size' => '16 إنش',
        'color' => 'أزرق',
        'color_he' => NULL,
        'color_en' => NULL,
        'color_hex' => NULL,
        'stock' => 20,
        'sku' => NULL,
        'sort_order' => 1,
      ),
    ),
    'category_key' => 'outdoor',
    'brand_name' => NULL,
  ),
  10 => 
  array (
    'name' => 'كرة قدم رقم 5',
    'name_he' => NULL,
    'name_en' => NULL,
    'description' => 'كرة قدم مطاطية مقاس قانوني',
    'description_he' => NULL,
    'description_en' => NULL,
    'image' => NULL,
    'images' => NULL,
    'video' => NULL,
    'video_url' => NULL,
    'badge' => NULL,
    'price' => 30.0,
    'wholesale_price' => NULL,
    'compare_price' => NULL,
    'track_stock' => true,
    'stock_quantity' => NULL,
    'is_active' => true,
    'sort_order' => 2,
    'variants' => 
    array (
      0 => 
      array (
        'size' => 'مقاس 5',
        'color' => 'أبيض/أسود',
        'color_he' => NULL,
        'color_en' => NULL,
        'color_hex' => NULL,
        'stock' => 20,
        'sku' => NULL,
        'sort_order' => 0,
      ),
    ),
    'category_key' => 'outdoor',
    'brand_name' => NULL,
  ),
  11 => 
  array (
    'name' => 'بازل 100 قطعة',
    'name_he' => NULL,
    'name_en' => NULL,
    'description' => 'بازل تركيب مناسب للأعمار 6+',
    'description_he' => NULL,
    'description_en' => NULL,
    'image' => NULL,
    'images' => NULL,
    'video' => NULL,
    'video_url' => NULL,
    'badge' => NULL,
    'price' => 25.0,
    'wholesale_price' => NULL,
    'compare_price' => NULL,
    'track_stock' => true,
    'stock_quantity' => NULL,
    'is_active' => true,
    'sort_order' => 1,
    'variants' => 
    array (
      0 => 
      array (
        'size' => '100 قطعة',
        'color' => 'متعدد',
        'color_he' => NULL,
        'color_en' => NULL,
        'color_hex' => NULL,
        'stock' => 20,
        'sku' => NULL,
        'sort_order' => 0,
      ),
    ),
    'category_key' => 'boardgames',
    'brand_name' => NULL,
  ),
  12 => 
  array (
    'name' => 'طقم بالونات عيد ميلاد',
    'name_he' => NULL,
    'name_en' => NULL,
    'description' => 'طقم بالونات وزينة حفلة أعياد ميلاد',
    'description_he' => NULL,
    'description_en' => NULL,
    'image' => NULL,
    'images' => NULL,
    'video' => NULL,
    'video_url' => NULL,
    'badge' => 'جديد',
    'price' => 20.0,
    'wholesale_price' => NULL,
    'compare_price' => NULL,
    'track_stock' => true,
    'stock_quantity' => NULL,
    'is_active' => true,
    'sort_order' => 1,
    'variants' => 
    array (
      0 => 
      array (
        'size' => 'قياسي',
        'color' => 'متعدد',
        'color_he' => NULL,
        'color_en' => NULL,
        'color_hex' => NULL,
        'stock' => 20,
        'sku' => NULL,
        'sort_order' => 0,
      ),
    ),
    'category_key' => 'party',
    'brand_name' => NULL,
  ),
);
        foreach ($products as $prod) {
            $variants = $prod['variants'];
            unset($prod['variants']);
            $catKey = $prod['category_key'];
            unset($prod['category_key']);
            $prod['category_id'] = $categoryIds[$catKey] ?? null;
            $brandName = $prod['brand_name'];
            unset($prod['brand_name']);
            $prod['brand_id'] = $brandName ? ($brandIds[$brandName] ?? null) : null;
            $product = Product::updateOrCreate(['name' => $prod['name']], $prod);
            $product->variants()->delete();
            foreach ($variants as $variant) {
                $product->variants()->create($variant);
            }
        }

        $heroSlides = array (
  0 => 
  array (
    'image' => NULL,
    'title' => 'أجمل الألعاب لأطفالك',
    'title_he' => 'הצעצועים הכי יפים לילדים שלכם',
    'title_en' => NULL,
    'subtitle' => 'تشكيلة جديدة من الألعاب كل أسبوع',
    'subtitle_he' => 'קולקציה חדשה של צעצועים כל שבוע',
    'subtitle_en' => NULL,
    'cta_text' => 'تصفح المنتجات',
    'cta_text_he' => 'לקנייה עכשיו',
    'cta_text_en' => NULL,
    'cta_link' => NULL,
    'sort_order' => 1,
    'is_active' => true,
  ),
  1 => 
  array (
    'image' => NULL,
    'title' => 'خصومات تصل لـ 30%',
    'title_he' => 'הנחות עד 30%',
    'title_en' => NULL,
    'subtitle' => 'على تشكيلة مختارة من الألعاب التعليمية والترفيهية',
    'subtitle_he' => 'על קולקציה נבחרת של צעצועים חינוכיים ובידוריים',
    'subtitle_en' => NULL,
    'cta_text' => 'شوف العروض',
    'cta_text_he' => 'לצפייה במבצעים',
    'cta_text_en' => NULL,
    'cta_link' => NULL,
    'sort_order' => 2,
    'is_active' => true,
  ),
  2 => 
  array (
    'image' => NULL,
    'title' => 'توصيل سريع لباب بيتك',
    'title_he' => 'משלוח מהיר עד הבית',
    'title_en' => NULL,
    'subtitle' => 'لجميع مناطق الضفة الغربية خلال 1-3 أيام عمل',
    'subtitle_he' => 'לכל אזורי הגדה המערבית תוך 1-3 ימי עסקים',
    'subtitle_en' => NULL,
    'cta_text' => 'ابدأ التسوق',
    'cta_text_he' => 'התחילו לקנות',
    'cta_text_en' => NULL,
    'cta_link' => NULL,
    'sort_order' => 3,
    'is_active' => true,
  ),
);
        foreach ($heroSlides as $slide) {
            HeroSlide::updateOrCreate(['title' => $slide['title']], $slide);
        }
    }
}
