import { useState, useRef, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { useWishlist } from './WishlistContext';
import { useLocale } from './LocaleContext';
import { localField } from '../i18n';

export function uniqueSizes(variants, oneSizeLabel) {
    const seen = new Set();
    const out = [];
    for (const v of (variants || [])) {
        const size = v.size || oneSizeLabel;
        if (!seen.has(size)) { seen.add(size); out.push(size); }
    }
    return out;
}

// Size selection/matching always stays keyed on the raw Arabic value stored
// on the variant — only the text shown to the customer gets translated.
export function sizeLabel(rawSize, variants, locale) {
    if (locale === 'ar') return rawSize;
    const v = (variants || []).find(v => v.size === rawSize);
    return v?.[`size_${locale}`] || rawSize;
}

export default function ProductCard({ product }) {
    const { has: inWishlist, toggle: toggleWishlist } = useWishlist();
    const { locale, t } = useLocale();
    const videoRef = useRef(null);
    const cardRef = useRef(null);
    const [hovering, setHovering] = useState(false);
    const galleryImages = [product.image, ...(product.images || [])].filter(Boolean);
    const [activeIndex, setActiveIndex] = useState(0);
    const sizes = uniqueSizes(product.variants, t('oneSize'));
    const discount = product.compare_price && product.compare_price > product.price
        ? Math.round((1 - product.price / product.compare_price) * 100)
        : null;
    const hasVariants = product.variants?.length > 0;
    const totalStock = hasVariants
        ? product.variants.reduce((s, v) => s + (v.stock || 0), 0)
        : (product.stock_quantity ?? Infinity);
    const soldOut = product.track_stock && totalStock <= 0;
    const lowStock = product.track_stock && !soldOut && totalStock <= 10;

    function handleMouseEnter() {
        if (!product.video) return;
        setHovering(true);
        videoRef.current?.play().catch(() => {});
    }

    function handleMouseLeave() {
        if (!product.video) return;
        setHovering(false);
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
    }

    // Touch devices never fire mouseenter/mouseleave — instead, autoplay the
    // preview video once the card scrolls into view, so a finger swiping
    // past it on mobile gets the same preview a mouse hover gives on desktop.
    useEffect(() => {
        if (!product.video) return;
        if (typeof window === 'undefined' || !window.matchMedia('(hover: none)').matches) return;
        const el = cardRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(([entry]) => {
            setHovering(entry.isIntersecting);
            if (entry.isIntersecting) {
                videoRef.current?.play().catch(() => {});
            } else if (videoRef.current) {
                videoRef.current.pause();
                videoRef.current.currentTime = 0;
            }
        }, { threshold: 0.6 });
        observer.observe(el);
        return () => observer.disconnect();
    }, [product.video]);

    // Auto-cycle through the product's photos so the card itself previews
    // the gallery without the customer needing to open it.
    useEffect(() => {
        if (galleryImages.length < 2) return;
        const id = setInterval(() => setActiveIndex(i => (i + 1) % galleryImages.length), 2500);
        return () => clearInterval(id);
    }, [galleryImages.length]);

    return (
        <div ref={cardRef} onClick={() => router.visit(`/product/${product.id}`)}
            onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}
            className="group bg-white dark:bg-ink-2 rounded-3xl overflow-hidden border border-cream-3 dark:border-white/10 shadow-sm hover:shadow-2xl hover:shadow-ink/10 hover:-translate-y-1.5 hover:border-transparent transition-all duration-300 cursor-pointer">

            <div className="relative overflow-hidden aspect-square bg-gradient-to-br from-cream-2 to-cream-3 dark:from-ink dark:to-ink-2">
                {galleryImages.length > 0
                    ? <img src={`/storage/${galleryImages[activeIndex]}`} alt={localField(product, 'name', locale)}
                        className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${soldOut ? 'grayscale opacity-50' : ''}`} />
                    : <div className="w-full h-full flex items-center justify-center text-4xl">🧸</div>
                }
                {soldOut && (
                    <div className="absolute inset-0 bg-ink/50 flex items-center justify-center z-10">
                        <span className="bg-white text-ink text-xs font-black px-3 py-1.5 rounded-full">{t('soldOutLabel')}</span>
                    </div>
                )}
                {product.video && (
                    <video ref={videoRef} src={`/storage/${product.video}`} muted loop playsInline preload="none"
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 pointer-events-none ${hovering ? 'opacity-100' : 'opacity-0'}`} />
                )}
                <button onClick={e => { e.stopPropagation(); toggleWishlist({ ...product, name: localField(product, 'name', locale) }); }}
                    className={`absolute top-2.5 start-2.5 w-8 h-8 rounded-full flex items-center justify-center text-sm z-10 shadow-sm backdrop-blur-sm transition-colors
                        ${inWishlist(product.id) ? 'bg-red-500 text-white' : 'bg-white/85 text-ink hover:bg-white'}`}>
                    {inWishlist(product.id) ? '♥' : '♡'}
                </button>
                {discount && (
                    <span className="absolute top-2.5 end-2.5 bg-red-500 text-white text-xs font-black px-2.5 py-1 rounded-lg shadow-sm z-10">-{discount}%</span>
                )}
                {!discount && product.badge && (
                    <span className="absolute top-2.5 end-2.5 bg-accent text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm z-10">
                        {product.badge}
                    </span>
                )}
            </div>
            {galleryImages.length > 1 && (
                <div className="flex gap-1.5 px-3 pt-2.5 overflow-x-auto">
                    {galleryImages.map((img, i) => (
                        <button key={i} onClick={e => { e.stopPropagation(); setActiveIndex(i); }}
                            className={`shrink-0 w-8 h-8 rounded-lg overflow-hidden border-2 transition-colors ${activeIndex === i ? 'border-accent' : 'border-cream-3 dark:border-white/10 opacity-60 hover:opacity-100'}`}>
                            <img src={`/storage/${img}`} className="w-full h-full object-cover" alt="" />
                        </button>
                    ))}
                </div>
            )}

            <div className="p-3.5">
                {product.brand && <p className="text-xs font-bold tracking-widest uppercase text-accent mb-1">{product.brand.name}</p>}
                <p className="text-sm font-extrabold text-ink dark:text-cream mb-1.5 leading-tight">{localField(product, 'name', locale)}</p>

                {sizes.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                        {sizes.slice(0, 6).map(s => (
                            <span key={s} className="text-[11px] font-bold text-muted bg-cream-2 dark:bg-white/5 rounded-md px-1.5 py-0.5">{sizeLabel(s, product.variants, locale)}</span>
                        ))}
                    </div>
                )}

                <div className="flex items-center gap-2">
                    {discount && <span className="text-xs text-muted line-through">{product.compare_price}₪</span>}
                    <span className="text-lg font-black text-accent">{product.price}₪</span>
                </div>
                {lowStock && <p className="text-[11px] font-bold text-orange-500 mt-1">{t('lowStockLabel')(totalStock)}</p>}
            </div>
        </div>
    );
}
