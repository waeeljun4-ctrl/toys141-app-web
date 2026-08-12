import { useState, useMemo, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { useCart } from './CartContext';
import { useWishlist } from './WishlistContext';
import { useLocale } from './LocaleContext';
import { localField } from '../i18n';
import { Button } from './UI';
import { waMsg, WA_LINK } from '../config';

function uniqueSizes(variants, oneSizeLabel) {
    const seen = new Set();
    const out = [];
    for (const v of variants) {
        const size = v.size || oneSizeLabel;
        if (!seen.has(size)) { seen.add(size); out.push(size); }
    }
    return out;
}

export default function ProductDetail({ product, onClose }) {
    const { addItem, setOpen: setCartOpen } = useCart();
    const { has: inWishlist, toggle: toggleWishlist } = useWishlist();
    const { t, locale } = useLocale();
    const { siteSettings } = usePage().props;
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
    const [activeImage, setActiveImage] = useState(galleryImages[0] ?? null);

    function handleAddCart() {
        if (outOfStock) return;
        addItem({ ...product, name: pName }, { size, color }, qty);
        onClose();
        setCartOpen(true);
    }

    function handleWA() {
        if (!siteSettings?.whatsapp_number) return;
        const variantLabel = [size, color].filter(Boolean).join(' · ');
        window.open(WA_LINK(waMsg(pName, variantLabel, product.price), siteSettings.whatsapp_number), '_blank');
    }

    return (
        <div className="fixed inset-0 z-40 bg-ink/60 backdrop-blur-sm flex items-end justify-center sm:items-center"
            onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="bg-white dark:bg-ink-2 w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl">

                {/* Header */}
                <div className="flex items-center justify-between px-4 pt-4">
                    <h2 className="font-bold text-base text-ink dark:text-cream">{pName}</h2>
                    <div className="flex items-center gap-2">
                        <button onClick={() => toggleWishlist({ ...product, name: pName })}
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-colors ${inWishlist(product.id) ? 'bg-red-100 text-red-500' : 'bg-cream-2 dark:bg-ink text-ink dark:text-cream hover:bg-cream-3'}`}>
                            {inWishlist(product.id) ? '♥' : '♡'}
                        </button>
                        <button onClick={onClose} className="w-8 h-8 rounded-full bg-cream-2 dark:bg-ink text-ink dark:text-cream flex items-center justify-center text-sm hover:bg-cream-3">✕</button>
                    </div>
                </div>

                {/* Media */}
                {product.video || product.video_url_full ? (
                    <div className="mx-4 mt-4 rounded-xl overflow-hidden bg-black aspect-video">
                        <video src={product.video ? `/storage/${product.video}` : product.video_url_full}
                            controls autoPlay muted loop playsInline className="w-full h-full object-contain" />
                    </div>
                ) : (
                    <>
                        <div className="mx-4 mt-4 h-56 bg-gradient-to-br from-cream-2 to-cream-3 dark:from-ink dark:to-ink-2 rounded-xl overflow-hidden flex items-center justify-center text-5xl">
                            {activeImage
                                ? <img src={`/storage/${activeImage}`} alt={pName} className="w-full h-full object-cover" />
                                : '👕'
                            }
                        </div>
                        {galleryImages.length > 1 && (
                            <div className="mx-4 mt-2 flex gap-2 overflow-x-auto scrollbar-hide">
                                {galleryImages.map(path => (
                                    <button key={path} type="button" onClick={() => setActiveImage(path)}
                                        className={`shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-colors ${activeImage === path ? 'border-accent' : 'border-cream-3 dark:border-white/10 opacity-70 hover:opacity-100'}`}>
                                        <img src={`/storage/${path}`} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </>
                )}

                <div className="px-4 pb-6 mt-4 space-y-4">
                    <p className="text-sm text-muted leading-relaxed">{pDesc}</p>

                    {/* Sizes */}
                    {sizes.length > 0 && (
                        <div>
                            <p className="text-xs font-bold tracking-widest uppercase text-muted mb-2">{t('sizeLabel')}</p>
                            <div className="flex flex-wrap gap-2">
                                {sizes.map(s => {
                                    const sizeVariants = variants.filter(v => (v.size || oneSizeLabel) === s);
                                    const sizeInStock = !product.track_stock || sizeVariants.some(v => v.stock > 0);
                                    return (
                                        <button key={s} disabled={!sizeInStock} onClick={() => setSize(s)}
                                            className={`min-w-[44px] py-2 px-3 border-2 rounded-xl text-sm font-bold transition-colors
                                                ${size === s ? 'border-accent bg-accent-pale text-accent' : 'border-cream-3 dark:border-white/10 text-muted hover:border-accent hover:text-accent'}
                                                ${!sizeInStock ? 'opacity-30 cursor-not-allowed line-through' : ''}`}>
                                            {s}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Colors */}
                    {colorsForSize.length > 1 && (
                        <div>
                            <p className="text-xs font-bold tracking-widest uppercase text-muted mb-2">{t('colorLabel')}</p>
                            <div className="flex flex-wrap gap-2">
                                {colorsForSize.map(v => (
                                    <button key={v.id} onClick={() => setColor(v.color)} disabled={product.track_stock && v.stock <= 0}
                                        className={`flex items-center gap-1.5 py-1.5 px-3 border-2 rounded-xl text-sm font-bold transition-colors
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

                    {/* Quantity */}
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

                    {outOfStock && (
                        <p className="text-sm text-red-500 font-bold">{t('outOfStockMsg')}</p>
                    )}
                    {lowStock && (
                        <p className="text-sm text-orange-500 font-bold">{t('lowStockPiecesLabel')(stock)}</p>
                    )}

                    {/* Price */}
                    <div className="bg-gradient-to-r from-ink to-ink-2 rounded-xl p-4 flex items-center justify-between">
                        <div>
                            {discount && (
                                <div className="flex items-center gap-2 mb-0.5">
                                    <span className="text-sm text-white/30 line-through">{product.compare_price}₪</span>
                                    <span className="bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">-{discount}%</span>
                                </div>
                            )}
                            <p className="text-2xl font-black text-accent">{product.price}₪</p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-2">
                        <Button variant="dark" className="w-full py-3" onClick={handleAddCart} disabled={outOfStock}>
                            🛒 {t('addToCart')}
                        </Button>
                        {siteSettings?.whatsapp_number && (
                            <Button variant="wa" className="w-full py-3" onClick={handleWA}>
                                💬 {t('orderViaWA')}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
