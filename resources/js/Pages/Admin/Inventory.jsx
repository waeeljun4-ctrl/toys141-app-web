import { useState, useMemo } from 'react';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import AdminLayout from '../../Layouts/AdminLayout';

function VariantRow({ productId, variant, onSaved }) {
    const [stock, setStock] = useState(variant.stock);
    const [dirty, setDirty] = useState(false);
    const [saving, setSaving] = useState(false);

    async function save() {
        setSaving(true);
        try {
            await axios.patch(route('admin.inventory.updateVariantStock', variant.id), { stock });
            setDirty(false);
            onSaved(productId, variant.id, stock);
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="flex items-center gap-2 px-3 py-2 bg-cream-2 rounded-lg">
            <span className="text-xs font-bold text-ink w-16 truncate">{variant.size || '—'}</span>
            <span className="flex items-center gap-1 text-xs text-muted w-24 truncate">
                {variant.color_hex && <span className="w-3 h-3 rounded-full border border-cream-3 shrink-0" style={{ background: variant.color_hex }} />}
                {variant.color || '—'}
            </span>
            <input type="number" min="0" value={stock}
                onChange={e => { setStock(parseInt(e.target.value) || 0); setDirty(true); }}
                className="w-16 border border-cream-3 focus:border-accent rounded-lg px-2 py-1 text-xs text-center text-ink bg-white outline-none" />
            {dirty && (
                <button onClick={save} disabled={saving}
                    className="text-xs bg-accent text-white font-bold px-2.5 py-1 rounded-lg hover:bg-accent-light transition-colors disabled:opacity-50">
                    {saving ? '⏳' : '💾'}
                </button>
            )}
        </div>
    );
}

function ProductRow({ product, onUpdate, onVariantSaved }) {
    const [open, setOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [wholesalePrice, setWholesalePrice] = useState(product.wholesale_price ?? '');
    const [wholesaleDirty, setWholesaleDirty] = useState(false);
    const [wholesaleSaving, setWholesaleSaving] = useState(false);
    const totalStock = product.variants.reduce((s, v) => s + v.stock, 0);
    const wholesaleValue = product.track_stock ? totalStock * (product.wholesale_price || 0) : null;
    const retailValue = product.track_stock ? totalStock * (product.price || 0) : null;

    async function toggleTrack() {
        const next = !product.track_stock;
        setSaving(true);
        try {
            await axios.patch(route('admin.inventory.updateTracking', product.id), { track_stock: next });
            onUpdate(product.id, { track_stock: next });
        } finally {
            setSaving(false);
        }
    }

    async function saveWholesalePrice() {
        setWholesaleSaving(true);
        try {
            const value = wholesalePrice === '' ? null : parseFloat(wholesalePrice);
            await axios.patch(route('admin.inventory.updateWholesalePrice', product.id), { wholesale_price: value });
            onUpdate(product.id, { wholesale_price: value });
            setWholesaleDirty(false);
        } finally {
            setWholesaleSaving(false);
        }
    }

    return (
        <div className="border-b border-cream-3 last:border-b-0">
            <div className="flex items-center gap-3 px-4 py-3 hover:bg-cream transition-colors flex-wrap">
                <button onClick={() => setOpen(o => !o)} className="text-muted text-xs w-4 shrink-0">
                    {product.variants.length ? (open ? '▾' : '◂') : ''}
                </button>
                {product.image
                    ? <img src={`/storage/${product.image}`} className="w-8 h-8 rounded-lg object-cover shrink-0" />
                    : <span className="w-8 h-8 rounded-lg bg-cream-2 flex items-center justify-center shrink-0">👕</span>}
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-ink truncate">{product.name}</p>
                    <p className="text-xs text-muted truncate">{product.category?.name} · {product.variants.length} خيار · سعر مفرق: {product.price ?? '—'}₪</p>
                </div>
                {product.track_stock && (
                    <span className={`text-xs font-bold px-2 py-1 rounded-lg shrink-0 ${totalStock <= 0 ? 'bg-red-100 text-red-600' : totalStock <= 10 ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'}`}>
                        {totalStock <= 0 ? 'نفذت الكمية' : `المجموع: ${totalStock}`}
                    </span>
                )}
                {product.track_stock && wholesaleValue !== null && (
                    <span className="text-xs text-muted shrink-0">
                        قيمة المخزون: <span className="font-bold text-ink">{wholesaleValue.toLocaleString('ar')}₪</span> جملة ·{' '}
                        <span className="font-bold text-accent">{retailValue.toLocaleString('ar')}₪</span> مفرق
                    </span>
                )}
                <div className="flex items-center gap-1 shrink-0">
                    <label className="text-xs font-bold text-muted">سعر الجملة</label>
                    <input type="number" min="0" step="0.01" value={wholesalePrice} placeholder="—"
                        onChange={e => { setWholesalePrice(e.target.value); setWholesaleDirty(true); }}
                        className="w-20 border border-cream-3 focus:border-accent rounded-lg px-2 py-1 text-xs text-center text-ink bg-white outline-none placeholder-muted/40" />
                    {wholesaleDirty && (
                        <button onClick={saveWholesalePrice} disabled={wholesaleSaving}
                            className="text-xs bg-accent text-white font-bold px-2 py-1 rounded-lg hover:bg-accent-light transition-colors disabled:opacity-50">
                            {wholesaleSaving ? '⏳' : '💾'}
                        </button>
                    )}
                </div>
                <label className="flex items-center gap-1.5 text-xs font-bold text-muted shrink-0 cursor-pointer">
                    <input type="checkbox" checked={product.track_stock} disabled={saving} onChange={toggleTrack}
                        className="accent-accent w-4 h-4 cursor-pointer" />
                    تتبع الكمية
                </label>
            </div>
            {open && product.variants.length > 0 && (
                <div className="px-4 pb-3 flex flex-wrap gap-2">
                    {product.variants.map(v => (
                        <VariantRow key={v.id} productId={product.id} variant={v} onSaved={onVariantSaved} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default function Inventory({ products: initialProducts }) {
    const [products, setProducts] = useState(initialProducts);
    const [search, setSearch] = useState('');
    const filtered = products.filter(p => !search || p.name.includes(search));

    // Live totals across everything currently tracked — recompute whenever
    // a variant's stock or a product's wholesale price is saved, since both
    // flow back into this same `products` state instead of staying local
    // to each row.
    const { totalWholesaleValue, totalRetailValue } = useMemo(() => {
        return products.filter(p => p.track_stock).reduce((acc, p) => {
            const qty = p.variants.reduce((s, v) => s + v.stock, 0);
            acc.totalWholesaleValue += qty * (p.wholesale_price || 0);
            acc.totalRetailValue += qty * (p.price || 0);
            return acc;
        }, { totalWholesaleValue: 0, totalRetailValue: 0 });
    }, [products]);

    function updateProduct(productId, updates) {
        setProducts(prev => prev.map(p => p.id === productId ? { ...p, ...updates } : p));
    }

    function updateVariantStock(productId, variantId, stock) {
        setProducts(prev => prev.map(p => p.id !== productId ? p : {
            ...p,
            variants: p.variants.map(v => v.id === variantId ? { ...v, stock } : v),
        }));
    }

    return (
        <>
            <Head title="المخزن — الإدارة" />
            <AdminLayout title="📦 المخزن">
                <p className="text-muted text-sm mb-4">
                    فعّل "تتبع الكمية" فقط للمنتجات اللي بدك تراقب مخزونها — الباقي بضل متاح دايماً بدون حد أقصى.
                    افتح المنتج (◂) لتعديل كمية كل مقاس/لون. سعر المفرق بيجي تلقائي من صفحة المنتج.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                    <div className="bg-white rounded-2xl border border-cream-3 p-5">
                        <p className="text-xs text-muted mb-1">قيمة المخزون بسعر الجملة</p>
                        <p className="text-2xl font-black text-ink">{totalWholesaleValue.toLocaleString('ar')}₪</p>
                    </div>
                    <div className="bg-white rounded-2xl border border-cream-3 p-5">
                        <p className="text-xs text-muted mb-1">قيمة المخزون بسعر المفرق</p>
                        <p className="text-2xl font-black text-accent">{totalRetailValue.toLocaleString('ar')}₪</p>
                    </div>
                </div>

                <input value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="🔍 بحث بالاسم..."
                    className="border border-cream-3 rounded-xl px-3 py-2 text-sm text-ink bg-white focus:outline-none focus:border-accent w-52 mb-4" />

                <div className="bg-white rounded-2xl border border-cream-3 overflow-hidden">
                    {filtered.map(p => (
                        <ProductRow key={p.id} product={p} onUpdate={updateProduct} onVariantSaved={updateVariantStock} />
                    ))}
                    {filtered.length === 0 && (
                        <p className="text-center py-12 text-muted text-sm">لا توجد نتائج</p>
                    )}
                </div>
            </AdminLayout>
        </>
    );
}
