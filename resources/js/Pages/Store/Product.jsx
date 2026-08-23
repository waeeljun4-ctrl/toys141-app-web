import { useState, useMemo, useEffect, useRef } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { CartProvider, useCart } from '../../Components/CartContext';
import { WishlistProvider, useWishlist } from '../../Components/WishlistContext';
import { LocaleProvider, useLocale } from '../../Components/LocaleContext';
import { ThemeProvider, useTheme } from '../../Components/ThemeContext';
import { localField } from '../../i18n';
import CartDrawer from '../../Components/CartDrawer';
import WishlistDrawer from '../../Components/WishlistDrawer';
import ProductCard, { uniqueSizes, sizeLabel } from '../../Components/ProductCard';
import WhatsAppButton from '../../Components/WhatsAppButton';
import InstallBanner from '../../Components/InstallBanner';
import { Button } from '../../Components/UI';
import { waMsg, WA_LINK } from '../../config';

function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();
    return (
        <button onClick={toggleTheme} aria-label="toggle theme"
            className="w-9 h-9 rounded-xl bg-cream-2 dark:bg-ink-2 border border-cream-3 dark:border-white/10 flex items-center justify-center text-sm text-ink dark:text-cream hover:bg-accent-pale hover:border-accent hover:text-accent transition-colors shrink-0">
            {theme === 'dark' ? '☀️' : '🌙'}
        </button>
    );
}

const LANGS = [
    { code: 'ar', label: 'ع',  full: 'العربية' },
    { code: 'he', label: 'ע',  full: 'עברית'   },
    { code: 'en', label: 'EN', full: 'English'  },
];

function LangPicker() {
    const { locale, setLocale } = useLocale();
    const [open, setOpen] = useState(false);
    const current = LANGS.find(l => l.code === locale) ?? LANGS[0];

    return (
        <div className="relative">
            <button onClick={() => setOpen(o => !o)}
                className="w-9 h-9 rounded-xl bg-cream-2 dark:bg-ink-2 border border-cream-3 dark:border-white/10 flex items-center justify-center text-sm font-bold text-ink dark:text-cream hover:bg-accent-pale hover:border-accent hover:text-accent transition-colors shrink-0">
                {current.label}
            </button>
            {open && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
                    <div className="absolute top-full mt-1.5 end-0 bg-white dark:bg-ink-2 border border-cream-3 dark:border-white/10 rounded-xl shadow-xl z-50 overflow-hidden min-w-[130px]">
                        {LANGS.map(l => (
                            <button key={l.code} onClick={() => { setLocale(l.code); setOpen(false); }}
                                className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-bold transition-colors ${locale === l.code ? 'bg-accent-pale text-accent' : 'text-ink dark:text-cream hover:bg-cream-2 dark:hover:bg-ink'}`}>
                                <span className="font-mono w-6 text-center shrink-0">{l.label}</span>
                                <span>{l.full}</span>
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

function getYoutubeEmbed(url) {
    if (!url) return null;
    const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([A-Za-z0-9_-]{11})/);
    return m ? `https://www.youtube.com/embed/${m[1]}` : null;
}

function ProductPageContent({ product, related }) {
    const { addItem, setOpen: setCartOpen, count } = useCart();
    const { has: inWishlist, toggle: toggleWishlist, count: wishCount, setOpen: setWishOpen } = useWishlist();
    const { t, locale, dict } = useLocale();
    const { siteSettings } = usePage().props;
    const waNumber = siteSettings?.whatsapp_number;

    const pName = localField(product, 'name', locale);
    const pDesc = localField(product, 'description', locale);
    const variants = product.variants || [];
    const oneSizeLabel = t('oneSize');
    const sizes = useMemo(() => uniqueSizes(variants, oneSizeLabel), [variants, oneSizeLabel]);

    const [size, setSize] = useState(sizes[0] || null);
    const [color, setColor] = useState(null);
    const [qty, setQty] = useState(1);

    const colorsForSize = useMemo(
        () => variants.filter(v => (v.size || oneSizeLabel) === size),
        [variants, size, oneSizeLabel]
    );

    useEffect(() => {
        if (colorsForSize.length && !colorsForSize.some(v => v.color === color)) {
            setColor(colorsForSize[0].color);
        }
    }, [size]); // eslint-disable-line react-hooks/exhaustive-deps

    const currentVariant = colorsForSize.find(v => v.color === color) || colorsForSize[0] || null;
    const hasVariants = variants.length > 0;
    const stock = hasVariants ? (currentVariant?.stock ?? 0) : (product.stock_quantity ?? Infinity);
    const outOfStock = product.track_stock && stock <= 0;
    const lowStock = product.track_stock && !outOfStock && stock <= 10;

    const discount = product.compare_price && product.compare_price > product.price
        ? Math.round((1 - product.price / product.compare_price) * 100)
        : null;

    const galleryImages = [product.image, ...(product.images || [])].filter(Boolean);
    const [activeIndex, setActiveIndex] = useState(0);
    const touchStartX = useRef(null);
    const youtubeEmbedUrl = getYoutubeEmbed(product.video_url);

    function prevImage() { setActiveIndex(i => (i - 1 + galleryImages.length) % galleryImages.length); }
    function nextImage() { setActiveIndex(i => (i + 1) % galleryImages.length); }

    function handleTouchStart(e) { touchStartX.current = e.touches[0].clientX; }
    function handleTouchEnd(e) {
        if (touchStartX.current === null) return;
        const delta = e.changedTouches[0].clientX - touchStartX.current;
        if (Math.abs(delta) > 40) (delta > 0 ? prevImage : nextImage)();
        touchStartX.current = null;
    }

    function handleAddCart() {
        if (outOfStock) return;
        addItem({ ...product, name: pName }, { size, color }, qty);
        setCartOpen(true);
    }

    function handleWA() {
        if (!waNumber) return;
        const variantLabel = [size, color].filter(Boolean).join(' · ');
        window.open(WA_LINK(waMsg(pName, variantLabel, product.price), waNumber), '_blank');
    }

    const categoryName = localField(product.category, 'name', locale);

    return (
        <div className="min-h-screen bg-cream dark:bg-ink transition-colors">
            <Head title={`${pName} — ${t('storeTitle')}`} />

            <div className="bg-ink text-center text-xs py-2 text-white/50 tracking-wide">
                🚚 {t('topBanner')}
            </div>

            <nav className="sticky top-0 z-30 bg-white/90 dark:bg-ink/90 backdrop-blur-xl border-b border-cream-3 dark:border-white/10 h-16 flex items-center justify-between px-4 sm:px-6 gap-4">
                <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => setWishOpen(true)}
                        className="relative bg-cream-2 dark:bg-ink-2 border border-cream-3 dark:border-white/10 text-ink dark:text-cream w-9 h-9 rounded-xl flex items-center justify-center hover:bg-accent-pale hover:border-accent hover:text-accent transition-colors">
                        ♡
                        {wishCount > 0 && (
                            <span className="absolute -top-1 -end-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{wishCount}</span>
                        )}
                    </button>
                    <LangPicker />
                    <ThemeToggle />
                    <button onClick={() => setCartOpen(true)}
                        className="relative bg-ink text-white w-9 h-9 rounded-xl flex items-center justify-center hover:bg-accent transition-colors shadow-sm">
                        🛒
                        {count > 0 && (
                            <span className="absolute -top-1 -end-1 w-4 h-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">{count}</span>
                        )}
                    </button>
                </div>
                <a href="/" className="flex items-center gap-2 shrink-0">
                    <span className="w-8 h-8 rounded-xl bg-accent flex items-center justify-center text-white text-sm font-black shadow-sm shadow-accent/30">🧸</span>
                    <span className="font-display text-xl font-bold text-ink dark:text-cream">
                        TOYS<span className="text-accent">.141</span>
                    </span>
                </a>
            </nav>

            <div className="max-w-6xl mx-auto px-4 py-6">
                {/* Breadcrumb */}
                <div className="flex items-center gap-1.5 text-xs text-muted mb-5 flex-wrap">
                    <Link href="/" className="hover:text-accent transition-colors">{t('allProducts')}</Link>
                    {categoryName && (
                        <>
                            <span>/</span>
                            <span>{categoryName}</span>
                        </>
                    )}
                    <span>/</span>
                    <span className="text-ink dark:text-cream font-bold">{pName}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Gallery */}
                    <div>
                        {product.video || product.video_url ? (
                            <div className="rounded-2xl overflow-hidden bg-black aspect-square">
                                {product.video ? (
                                    <video src={`/storage/${product.video}`} controls autoPlay muted loop playsInline className="w-full h-full object-contain" />
                                ) : youtubeEmbedUrl ? (
                                    <iframe src={youtubeEmbedUrl} className="w-full h-full" allowFullScreen title={pName} />
                                ) : (
                                    <video src={product.video_url} controls autoPlay muted loop playsInline className="w-full h-full object-contain" />
                                )}
                            </div>
                        ) : (
                            <>
                                <div className="aspect-square bg-gradient-to-br from-cream-2 to-cream-3 dark:from-ink dark:to-ink-2 rounded-2xl overflow-hidden relative">
                                    {galleryImages.length > 0 ? (
                                        <>
                                            <div dir="ltr" className="flex h-full transition-transform duration-500 ease-out"
                                                style={{ transform: `translateX(-${activeIndex * 100}%)` }}
                                                onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
                                                {galleryImages.map(path => (
                                                    <div key={path} className="w-full h-full shrink-0">
                                                        <img src={`/storage/${path}`} alt={pName} className="w-full h-full object-cover" draggable={false} />
                                                    </div>
                                                ))}
                                            </div>
                                            {galleryImages.length > 1 && (
                                                <>
                                                    <button onClick={prevImage} aria-label="prev" type="button"
                                                        className="absolute top-1/2 -translate-y-1/2 end-3 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-ink flex items-center justify-center backdrop-blur-sm shadow-sm transition-colors">›</button>
                                                    <button onClick={nextImage} aria-label="next" type="button"
                                                        className="absolute top-1/2 -translate-y-1/2 start-3 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-ink flex items-center justify-center backdrop-blur-sm shadow-sm transition-colors">‹</button>
                                                </>
                                            )}
                                        </>
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-6xl">🧸</div>
                                    )}
                                </div>
                                {galleryImages.length > 1 && (
                                    <div className="mt-2 flex gap-2 overflow-x-auto scrollbar-hide">
                                        {galleryImages.map((path, i) => (
                                            <button key={path} type="button" onClick={() => setActiveIndex(i)}
                                                className={`shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-colors ${activeIndex === i ? 'border-accent' : 'border-cream-3 dark:border-white/10 opacity-70 hover:opacity-100'}`}>
                                                <img src={`/storage/${path}`} alt="" className="w-full h-full object-cover" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Info */}
                    <div className="space-y-5">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                {product.brand && <p className="text-xs font-bold tracking-widest uppercase text-accent mb-1.5">{product.brand.name}</p>}
                                <h1 className="text-2xl font-black text-ink dark:text-cream leading-tight">{pName}</h1>
                            </div>
                            <button onClick={() => toggleWishlist({ ...product, name: pName })}
                                className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0 transition-colors ${inWishlist(product.id) ? 'bg-red-100 text-red-500' : 'bg-cream-2 dark:bg-ink-2 text-ink dark:text-cream hover:bg-cream-3'}`}>
                                {inWishlist(product.id) ? '♥' : '♡'}
                            </button>
                        </div>

                        <div className="flex items-center gap-2">
                            {discount && <span className="text-base text-muted line-through">{product.compare_price}₪</span>}
                            <span className="text-3xl font-black text-accent">{product.price}₪</span>
                            {discount && (
                                <span className="bg-red-500 text-white text-xs font-black px-2 py-0.5 rounded-full">-{discount}%</span>
                            )}
                        </div>

                        {pDesc && <p className="text-sm text-muted leading-relaxed">{pDesc}</p>}

                        {sizes.length > 0 && (
                            <div>
                                <p className="text-xs font-bold tracking-widest uppercase text-muted mb-2">{t('sizeLabel')}</p>
                                <div className="flex flex-wrap gap-2">
                                    {sizes.map(s => {
                                        const sizeVariants = variants.filter(v => (v.size || oneSizeLabel) === s);
                                        const sizeInStock = !product.track_stock || sizeVariants.some(v => v.stock > 0);
                                        return (
                                            <button key={s} disabled={!sizeInStock} onClick={() => setSize(s)}
                                                className={`min-w-[48px] py-2.5 px-3.5 border-2 rounded-xl text-sm font-bold transition-colors
                                                    ${size === s ? 'border-accent bg-accent-pale text-accent' : 'border-cream-3 dark:border-white/10 text-muted hover:border-accent hover:text-accent'}
                                                    ${!sizeInStock ? 'opacity-30 cursor-not-allowed line-through' : ''}`}>
                                                {sizeLabel(s, variants, locale)}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {colorsForSize.length > 1 && (
                            <div>
                                <p className="text-xs font-bold tracking-widest uppercase text-muted mb-2">{t('colorLabel')}</p>
                                <div className="flex flex-wrap gap-2">
                                    {colorsForSize.map(v => (
                                        <button key={v.id} onClick={() => setColor(v.color)} disabled={product.track_stock && v.stock <= 0}
                                            className={`flex items-center gap-1.5 py-2 px-3.5 border-2 rounded-xl text-sm font-bold transition-colors
                                                ${color === v.color ? 'border-accent bg-accent-pale text-accent' : 'border-cream-3 dark:border-white/10 text-muted hover:border-accent hover:text-accent'}
                                                ${product.track_stock && v.stock <= 0 ? 'opacity-30 cursor-not-allowed' : ''}`}>
                                            {v.color_hex && (
                                                <span className="w-3.5 h-3.5 rounded-full border border-cream-3 dark:border-white/20 shrink-0" style={{ background: v.color_hex }} />
                                            )}
                                            {(locale === 'he' ? v.color_he : locale === 'en' ? v.color_en : null)?.trim() || v.color}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div>
                            <p className="text-xs font-bold tracking-widest uppercase text-muted mb-2">{t('quantityLabel')}</p>
                            <div className="flex items-center gap-3">
                                <button onClick={() => setQty(q => Math.max(1, q - 1))}
                                    className="w-9 h-9 rounded-xl bg-cream-2 dark:bg-ink text-ink dark:text-cream font-bold hover:bg-cream-3">−</button>
                                <span className="font-bold w-6 text-center">{qty}</span>
                                <button onClick={() => setQty(q => q + 1)}
                                    className="w-9 h-9 rounded-xl bg-cream-2 dark:bg-ink text-ink dark:text-cream font-bold hover:bg-cream-3">+</button>
                            </div>
                        </div>

                        {outOfStock && <p className="text-sm text-red-500 font-bold">{t('outOfStockMsg')}</p>}
                        {lowStock && <p className="text-sm text-orange-500 font-bold">{t('lowStockPiecesLabel')(stock)}</p>}

                        <div className="space-y-2 pt-2">
                            <Button variant="dark" className="w-full py-3" onClick={handleAddCart} disabled={outOfStock}>
                                🛒 {t('addToCart')}
                            </Button>
                            {waNumber && (
                                <Button variant="wa" className="w-full py-3" onClick={handleWA}>
                                    💬 {t('orderViaWA')}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Related products */}
                {related.length > 0 && (
                    <div className="mt-16">
                        <h2 className="text-xl font-black text-ink dark:text-cream mb-5">{t('relatedProductsLabel')}</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                            {related.map(p => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <footer className="bg-ink px-4 py-10 text-center mt-16">
                <p className="font-black text-white text-xl mb-1">
                    TOYS<span className="text-accent">.141</span>
                </p>
                <p className="text-white/40 text-xs mb-6 leading-relaxed">{t('footerDesc')}</p>
                <p className="text-white/20 text-xs">{dict.footerCopy(new Date().getFullYear())}</p>
            </footer>

            <CartDrawer />
            <WishlistDrawer onOpenProduct={p => router.visit(`/product/${p.id}`)} />
            <WhatsAppButton />
        </div>
    );
}

export default function ProductPage({ product, related }) {
    return (
        <ThemeProvider>
            <LocaleProvider>
                <WishlistProvider>
                    <CartProvider>
                        <ProductPageContent product={product} related={related} />
                        <InstallBanner />
                    </CartProvider>
                </WishlistProvider>
            </LocaleProvider>
        </ThemeProvider>
    );
}
