<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\HeroSlide;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Admin user
        User::updateOrCreate(
            ['email' => 'admin@toys141.ps'],
            ['name' => 'TOYS 141 Admin', 'password' => Hash::make('admin123'), 'role' => 'admin']
        );

        // Hero slider (homepage banner — no images yet, uses the gradient fallback)
        $slides = [
            ['title' => 'أجمل الألعاب لأطفالك', 'subtitle' => 'تشكيلة جديدة من الألعاب كل أسبوع', 'cta_text' => 'تصفح المنتجات', 'sort_order' => 1],
            ['title' => 'خصومات تصل لـ 30%', 'subtitle' => 'على تشكيلة مختارة من الألعاب التعليمية والترفيهية', 'cta_text' => 'شوف العروض', 'sort_order' => 2],
            ['title' => 'توصيل سريع لباب بيتك', 'subtitle' => 'لجميع مناطق الضفة الغربية خلال 1-3 أيام عمل', 'cta_text' => 'ابدأ التسوق', 'sort_order' => 3],
        ];

        foreach ($slides as $slide) {
            HeroSlide::updateOrCreate(['title' => $slide['title']], $slide);
        }

        // Categories
        $cats = [
            ['name' => 'ألعاب أطفال صغار', 'name_he' => 'צעצועים לפעוטות', 'name_en' => 'Toddler Toys', 'icon' => '🍼', 'key' => 'toddler',    'sort_order' => 1],
            ['name' => 'ألعاب أولاد',       'name_he' => 'צעצועים לבנים',   'name_en' => "Boys' Toys",   'icon' => '🚗', 'key' => 'boys',        'sort_order' => 2],
            ['name' => 'ألعاب بنات',        'name_he' => 'צעצועים לבנות',   'name_en' => "Girls' Toys",  'icon' => '👸', 'key' => 'girls',       'sort_order' => 3],
            ['name' => 'ألعاب تعليمية',     'name_he' => 'צעצועים חינוכיים','name_en' => 'Educational',  'icon' => '🧩', 'key' => 'educational', 'sort_order' => 4],
            ['name' => 'ألعاب إلكترونية',   'name_he' => 'צעצועים אלקטרוניים', 'name_en' => 'Electronic & RC', 'icon' => '🎮', 'key' => 'electronic', 'sort_order' => 5],
            ['name' => 'ألعاب خارجية',      'name_he' => 'צעצועי חוץ',      'name_en' => 'Outdoor Toys', 'icon' => '⚽', 'key' => 'outdoor',     'sort_order' => 6],
            ['name' => 'ألعاب جماعية وبازل', 'name_he' => 'משחקי קופסה ופאזל', 'name_en' => 'Board Games & Puzzles', 'icon' => '🎲', 'key' => 'boardgames', 'sort_order' => 7],
            ['name' => 'بالونات وحفلات',     'name_he' => 'בלונים ומסיבות',  'name_en' => 'Balloons & Party', 'icon' => '🎈', 'key' => 'party',      'sort_order' => 8],
        ];

        foreach ($cats as $cat) {
            Category::updateOrCreate(['key' => $cat['key']], $cat);
        }

        $toddler     = Category::where('key', 'toddler')->first()->id;
        $boys        = Category::where('key', 'boys')->first()->id;
        $girls       = Category::where('key', 'girls')->first()->id;
        $educational = Category::where('key', 'educational')->first()->id;
        $electronic  = Category::where('key', 'electronic')->first()->id;
        $outdoor     = Category::where('key', 'outdoor')->first()->id;
        $boardgames  = Category::where('key', 'boardgames')->first()->id;
        $party       = Category::where('key', 'party')->first()->id;

        // Demo products — placeholders for the real catalog/photos/prices
        $products = [
            [
                'category_id' => $toddler, 'brand_id' => null,
                'name' => 'مكعبات بناء ملونة', 'description' => 'طقم مكعبات بلاستيك آمنة للأطفال، تنمي التركيز والتناسق',
                'badge' => 'جديد', 'price' => 45, 'compare_price' => null, 'sort_order' => 1,
                'variants' => [['size' => 'قياسي', 'color' => 'ألوان متعددة']],
            ],
            [
                'category_id' => $toddler, 'brand_id' => null,
                'name' => 'دمية قماشية طرية', 'description' => 'دمية حيوان طرية آمنة للرضع والأطفال الصغار',
                'badge' => null, 'price' => 35, 'compare_price' => null, 'sort_order' => 2,
                'variants' => [['size' => 'صغير', 'color' => 'بني'], ['size' => 'كبير', 'color' => 'بني']],
            ],
            [
                'category_id' => $boys, 'brand_id' => null,
                'name' => 'سيارة تحكم عن بعد', 'description' => 'سيارة سباق بريموت كنترول، شحن USB',
                'badge' => 'الأكثر مبيعاً', 'price' => 120, 'compare_price' => 160, 'sort_order' => 1,
                'variants' => [['size' => 'قياسي', 'color' => 'أحمر'], ['size' => 'قياسي', 'color' => 'أزرق']],
            ],
            [
                'category_id' => $boys, 'brand_id' => null,
                'name' => 'مجسمات أبطال خارقين', 'description' => 'طقم مجسمات حركية بمفاصل متحركة',
                'badge' => null, 'price' => 60, 'compare_price' => null, 'sort_order' => 2,
                'variants' => [['size' => 'قياسي', 'color' => 'متعدد']],
            ],
            [
                'category_id' => $girls, 'brand_id' => null,
                'name' => 'دمية أزياء مع إكسسوارات', 'description' => 'دمية مع طقم ملابس وإكسسوارات قابلة للتبديل',
                'badge' => 'جديد', 'price' => 75, 'compare_price' => null, 'sort_order' => 1,
                'variants' => [['size' => 'قياسي', 'color' => 'وردي']],
            ],
            [
                'category_id' => $girls, 'brand_id' => null,
                'name' => 'بيت دمى مصغر', 'description' => 'بيت دمى بلاستيك بثلاثة طوابق مع أثاث',
                'badge' => null, 'price' => 140, 'compare_price' => 180, 'sort_order' => 2,
                'variants' => [['size' => 'قياسي', 'color' => 'وردي/أبيض']],
            ],
            [
                'category_id' => $educational, 'brand_id' => null,
                'name' => 'لوح رسم إلكتروني', 'description' => 'لوح رسم ضوئي قابل للمسح، ينمي الإبداع',
                'badge' => null, 'price' => 55, 'compare_price' => null, 'sort_order' => 1,
                'variants' => [['size' => 'قياسي', 'color' => 'متعدد']],
            ],
            [
                'category_id' => $educational, 'brand_id' => null,
                'name' => 'حروف وأرقام مغناطيسية', 'description' => 'طقم تعليمي للحروف العربية والأرقام بالمغناطيس',
                'badge' => 'جديد', 'price' => 40, 'compare_price' => null, 'sort_order' => 2,
                'variants' => [['size' => 'قياسي', 'color' => 'متعدد']],
            ],
            [
                'category_id' => $electronic, 'brand_id' => null,
                'name' => 'درون صغير للأطفال', 'description' => 'طائرة درون خفيفة سهلة التحكم للمبتدئين',
                'badge' => 'خصم', 'price' => 150, 'compare_price' => 190, 'sort_order' => 1,
                'variants' => [['size' => 'قياسي', 'color' => 'أسود']],
            ],
            [
                'category_id' => $outdoor, 'brand_id' => null,
                'name' => 'دراجة هوائية أطفال', 'description' => 'دراجة أطفال بعجلات مساعدة، مقاسات متعددة',
                'badge' => null, 'price' => 280, 'compare_price' => null, 'sort_order' => 1,
                'variants' => [['size' => '12 إنش', 'color' => 'أحمر'], ['size' => '16 إنش', 'color' => 'أزرق']],
            ],
            [
                'category_id' => $outdoor, 'brand_id' => null,
                'name' => 'كرة قدم رقم 5', 'description' => 'كرة قدم مطاطية مقاس قانوني',
                'badge' => null, 'price' => 30, 'compare_price' => null, 'sort_order' => 2,
                'variants' => [['size' => 'مقاس 5', 'color' => 'أبيض/أسود']],
            ],
            [
                'category_id' => $boardgames, 'brand_id' => null,
                'name' => 'بازل 100 قطعة', 'description' => 'بازل تركيب مناسب للأعمار 6+',
                'badge' => null, 'price' => 25, 'compare_price' => null, 'sort_order' => 1,
                'variants' => [['size' => '100 قطعة', 'color' => 'متعدد']],
            ],
            [
                'category_id' => $party, 'brand_id' => null,
                'name' => 'طقم بالونات عيد ميلاد', 'description' => 'طقم بالونات وزينة حفلة أعياد ميلاد',
                'badge' => 'جديد', 'price' => 20, 'compare_price' => null, 'sort_order' => 1,
                'variants' => [['size' => 'قياسي', 'color' => 'متعدد']],
            ],
        ];

        foreach ($products as $data) {
            $variants = $data['variants'];
            unset($data['variants']);

            $product = Product::updateOrCreate(
                ['category_id' => $data['category_id'], 'name' => $data['name']],
                $data
            );

            $product->variants()->delete();
            foreach ($variants as $i => $variant) {
                $product->variants()->create($variant + ['stock' => 20, 'sort_order' => $i]);
            }
        }
    }
}
