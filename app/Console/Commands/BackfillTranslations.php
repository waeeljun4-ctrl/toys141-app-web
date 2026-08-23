<?php

namespace App\Console\Commands;

use App\Models\Category;
use App\Models\HeroSlide;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Services\TranslationService;
use Illuminate\Console\Command;

/**
 * One-time (re-runnable) sweep that fills in he/en translations for every
 * product, category, hero slide, and variant color that was created or
 * edited before the auto-translation feature existed — those rows never
 * had a save() pass through the translator, so their he/en columns stay
 * empty (or, for older rows, hold whatever was typed manually) until this
 * runs. Safe to run again anytime; it always re-derives he/en from the
 * current Arabic text.
 */
class BackfillTranslations extends Command
{
    protected $signature = 'translate:backfill';
    protected $description = 'Auto-translate existing products, categories, hero slides, and variant colors from Arabic to Hebrew/English';

    public function handle(TranslationService $translator): int
    {
        $this->info('Translating categories...');
        Category::all()->each(function (Category $c) use ($translator) {
            $c->name_he = $translator->translate($c->name, 'he');
            $c->name_en = $translator->translate($c->name, 'en');
            $c->save();
            $this->line("  - #{$c->id} {$c->name}");
        });

        $this->info('Translating hero slides...');
        HeroSlide::all()->each(function (HeroSlide $s) use ($translator) {
            $s->title_he = $translator->translate($s->title, 'he');
            $s->title_en = $translator->translate($s->title, 'en');
            $s->subtitle_he = $translator->translate($s->subtitle, 'he');
            $s->subtitle_en = $translator->translate($s->subtitle, 'en');
            $s->cta_text_he = $translator->translate($s->cta_text, 'he');
            $s->cta_text_en = $translator->translate($s->cta_text, 'en');
            $s->save();
            $this->line("  - #{$s->id} {$s->title}");
        });

        $this->info('Translating products...');
        Product::all()->each(function (Product $p) use ($translator) {
            $p->name_he = $translator->translate($p->name, 'he');
            $p->name_en = $translator->translate($p->name, 'en');
            $p->description_he = $translator->translate($p->description, 'he');
            $p->description_en = $translator->translate($p->description, 'en');
            $p->save();
            $this->line("  - #{$p->id} {$p->name}");
        });

        $this->info('Translating product variant colors...');
        ProductVariant::whereNotNull('color')->get()->each(function (ProductVariant $v) use ($translator) {
            $v->color_he = $translator->translate($v->color, 'he');
            $v->color_en = $translator->translate($v->color, 'en');
            $v->save();
        });

        $this->info('Done.');

        return self::SUCCESS;
    }
}
